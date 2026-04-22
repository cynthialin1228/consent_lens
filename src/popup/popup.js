(() => {
  const { CATEGORY_LABELS, FIRST_RUN_KEY } = globalThis.ConsentLensConstants;

  // Category ids that map to checkbox ids in the HTML
  const CATEGORY_IDS = [
    "legal-rights",
    "money",
    "privacy",
    "data-sharing",
    "tracking",
    "termination",
    "biometrics"
  ];

  // ─── Summary & state display ───────────────────────────────────────────────

  function updateSummary(state) {
    const summary = document.getElementById("summary");
    const severityBadges = document.getElementById("severityBadges");
    const categoryBreakdown = document.getElementById("categoryBreakdown");
    const noResults = document.getElementById("noResults");

    if (!state || state.counts.total === 0) {
      const hasState = Boolean(state);
      summary.textContent = hasState ? "" : "No scan data yet.";
      noResults.hidden = !hasState;
      severityBadges.hidden = true;
      categoryBreakdown.hidden = true;
      return;
    }

    const { counts, categories } = state;
    noResults.hidden = true;
    // Summary shows raw page total — independent of any toolbar filters
    summary.textContent = `${counts.total} term${counts.total !== 1 ? "s" : ""} found on this page.`;

    document.getElementById("countHigh").textContent = counts.high;
    document.getElementById("countMedium").textContent = counts.medium;
    document.getElementById("countLow").textContent = counts.low;
    document.getElementById("badgeHigh").hidden = counts.high === 0;
    document.getElementById("badgeMedium").hidden = counts.medium === 0;
    document.getElementById("badgeLow").hidden = counts.low === 0;
    severityBadges.hidden = false;

    const categoryList = document.getElementById("categoryList");
    const sorted = Object.entries(categories)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length > 0) {
      categoryList.innerHTML = sorted.map(([cat, count]) => {
        const label = CATEGORY_LABELS[cat] || cat;
        return `<div class="category-row">
          <span class="category-bullet"></span>
          <span class="category-name">${label}</span>
          <span class="category-count">${count}</span>
        </div>`;
      }).join("");
      categoryBreakdown.hidden = false;
    } else {
      categoryBreakdown.hidden = true;
    }
  }

  function updateNavigationState(state) {
    // total here is highlightedElements.length from content.js — the filtered
    // navigable count, which may differ from pageState.counts.total
    const total = state?.total || 0;
    const index = state?.index || 0;
    document.getElementById("navCounter").textContent = `${index} / ${total}`;
    document.getElementById("prevMatchButton").disabled = total === 0;
    document.getElementById("nextMatchButton").disabled = total === 0;
  }

  function setStatus(message = "") {
    const status = document.getElementById("status");
    status.hidden = !message;
    status.textContent = message;
  }

  // ─── Preset visuals ────────────────────────────────────────────────────────

  function applyPresetVisuals(settings) {
    // "Essential" = high only. "Everything" = high + medium + low.
    const isEssential = settings.highlightHigh && !settings.highlightMedium && !settings.highlightLow;
    document.getElementById("presetEssential").classList.toggle("is-active", isEssential);
    document.getElementById("presetEverything").classList.toggle("is-active", !isEssential);
  }

  // ─── Settings ──────────────────────────────────────────────────────────────

  async function getSettings() {
    const response = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    return response?.settings || {
      enabled: true,
      showTooltips: true,
      highlightHigh: true,
      highlightMedium: false,
      highlightLow: false,
      categories: {}
    };
  }

  async function syncInputs() {
    const settings = await getSettings();

    const enabledEl = document.getElementById("enabled");
    if (enabledEl) enabledEl.checked = Boolean(settings.enabled);

    // Category checkboxes
    CATEGORY_IDS.forEach((cat) => {
      const el = document.getElementById(`cat-${cat}`);
      if (el) el.checked = settings.categories?.[cat] !== false;
    });

    applyPresetVisuals(settings);
  }

  async function persistSettings() {
    const current = await getSettings();
    const next = { ...current };

    next.enabled = document.getElementById("enabled").checked;

    // Collect category states
    next.categories = { ...current.categories };
    CATEGORY_IDS.forEach((cat) => {
      const el = document.getElementById(`cat-${cat}`);
      if (el) next.categories[cat] = el.checked;
    });

    await chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings: next });
    const rescanResult = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
    setStatus(rescanResult?.ok ? "" : rescanResult?.reason || "ConsentLens could not scan this page.");
    applyPresetVisuals(next);
    await refreshAll();
  }

  async function applyPreset(preset) {
    const current = await getSettings();
    const next = { ...current };

    if (preset === "essential") {
      next.highlightHigh = true;
      next.highlightMedium = false;
      next.highlightLow = false;
    } else if (preset === "everything") {
      next.highlightHigh = true;
      next.highlightMedium = true;
      next.highlightLow = true;
    }

    await chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings: next });
    const rescanResult = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
    setStatus(rescanResult?.ok ? "" : rescanResult?.reason || "ConsentLens could not scan this page.");
    await syncInputs();
    await refreshAll();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async function navigate(direction) {
    const response = await chrome.runtime.sendMessage({ type: "NAVIGATE_MATCH", direction });
    if (!response?.ok) {
      setStatus(response?.reason || "ConsentLens could not move to the next term.");
      return;
    }
    setStatus("");
    // Use the response directly — it comes straight from updateActiveMatch in
    // content.js and already reflects the current filtered highlightedElements.
    updateNavigationState(response);
  }

  // ─── Refresh ───────────────────────────────────────────────────────────────

  async function refreshAll() {
    // Run both in parallel. GET_NAVIGATION_STATE goes directly to the content
    // script (via service worker relay) so it always reflects the live filtered
    // highlightedElements count — not the stale session-stored pageState.
    const [pageStateResponse, navStateResponse] = await Promise.all([
      chrome.runtime.sendMessage({ type: "GET_PAGE_STATE" }),
      chrome.runtime.sendMessage({ type: "GET_NAVIGATION_STATE" })
    ]);
    updateSummary(pageStateResponse?.state ?? null);
    updateNavigationState(navStateResponse);
  }

  // ─── Welcome banner ────────────────────────────────────────────────────────

  async function maybeShowWelcomeBanner() {
    const result = await chrome.storage.sync.get(FIRST_RUN_KEY);
    if (!result[FIRST_RUN_KEY]) {
      document.getElementById("welcomeBanner").hidden = false;
    }
  }

  async function dismissWelcomeBanner() {
    document.getElementById("welcomeBanner").hidden = true;
    await chrome.storage.sync.set({ [FIRST_RUN_KEY]: true });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────

  async function initializePopup() {
    await maybeShowWelcomeBanner();
    document.getElementById("dismissWelcome").addEventListener("click", dismissWelcomeBanner);

    // Main enable toggle
    document.getElementById("enabled").addEventListener("change", persistSettings);

    // Rescan
    document.getElementById("rescanButton").addEventListener("click", async () => {
      const result = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
      setStatus(result?.ok ? "" : result?.reason || "ConsentLens could not scan this page.");
      await refreshAll();
    });

    // Navigation
    document.getElementById("prevMatchButton").addEventListener("click", () => navigate("previous"));
    document.getElementById("nextMatchButton").addEventListener("click", () => navigate("next"));

    // Presets (2 only)
    document.getElementById("presetEssential").addEventListener("click", () => applyPreset("essential"));
    document.getElementById("presetEverything").addEventListener("click", () => applyPreset("everything"));

    // Category checkboxes — each change triggers a rescan
    CATEGORY_IDS.forEach((cat) => {
      document.getElementById(`cat-${cat}`)?.addEventListener("change", persistSettings);
    });

    // Load state
    await syncInputs();
    const result = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
    setStatus(result?.ok ? "" : result?.reason || "ConsentLens could not scan this page.");
    await refreshAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePopup, { once: true });
  } else {
    initializePopup();
  }
})();
