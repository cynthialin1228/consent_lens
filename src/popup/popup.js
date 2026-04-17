(() => {
  const ids = [
    "enabled",
    "showTooltips"
  ];

  function updateSummary(state) {
    const summary = document.getElementById("summary");
    if (!state) {
      summary.textContent = "No scan data yet.";
      return;
    }

    const { counts } = state;
    summary.textContent = `${counts.total} terms flagged on this page. ${counts.high} high, ${counts.medium} medium, ${counts.low} low.`;
  }

  function updateNavigationState(state) {
    const navCounter = document.getElementById("navCounter");
    const prevButton = document.getElementById("prevMatchButton");
    const nextButton = document.getElementById("nextMatchButton");
    const total = state?.total || 0;
    const index = state?.index || 0;

    navCounter.textContent = `${index} / ${total}`;
    prevButton.disabled = total === 0;
    nextButton.disabled = total === 0;
  }

  function setStatus(message = "") {
    const status = document.getElementById("status");
    status.hidden = !message;
    status.textContent = message;
  }

  function applyPresetVisuals(settings) {
    const presets = {
      presetEssential: settings.highlightHigh && !settings.highlightMedium && !settings.highlightLow,
      presetBalanced: settings.highlightHigh && settings.highlightMedium && !settings.highlightLow,
      presetEverything: settings.highlightHigh && settings.highlightMedium && settings.highlightLow
    };

    Object.entries(presets).forEach(([id, active]) => {
      document.getElementById(id).classList.toggle("is-active", active);
    });
  }

  async function refreshPageState() {
    const response = await chrome.runtime.sendMessage({ type: "GET_PAGE_STATE" });
    updateSummary(response.state);
  }

  async function refreshNavigationState() {
    const response = await chrome.runtime.sendMessage({ type: "GET_NAVIGATION_STATE" });
    updateNavigationState(response);
  }

  async function getSettings() {
    const response = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    return response?.settings || {
      enabled: true,
      showTooltips: true,
      highlightHigh: true,
      highlightMedium: true,
      highlightLow: false
    };
  }

  async function syncInputs() {
    const settings = await getSettings();
    ids.forEach((id) => {
      document.getElementById(id).checked = Boolean(settings[id]);
    });
    applyPresetVisuals(settings);
  }

  async function persistSettings() {
    const current = await getSettings();
    const next = { ...current };

    ids.forEach((id) => {
      next[id] = document.getElementById(id).checked;
    });

    await chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings: next });
    const rescanResult = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
    setStatus(rescanResult?.ok ? "" : rescanResult?.reason || "ConsentLens could not scan this page.");
    applyPresetVisuals(next);
    await refreshPageState();
    await refreshNavigationState();
  }

  async function applyPreset(preset) {
    const current = await getSettings();
    const next = { ...current };

    if (preset === "essential") {
      next.highlightHigh = true;
      next.highlightMedium = false;
      next.highlightLow = false;
    }

    if (preset === "balanced") {
      next.highlightHigh = true;
      next.highlightMedium = true;
      next.highlightLow = false;
    }

    if (preset === "everything") {
      next.highlightHigh = true;
      next.highlightMedium = true;
      next.highlightLow = true;
    }

    await chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings: next });
    const rescanResult = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
    setStatus(rescanResult?.ok ? "" : rescanResult?.reason || "ConsentLens could not scan this page.");
    await syncInputs();
    await refreshPageState();
    await refreshNavigationState();
  }

  async function navigate(direction) {
    const response = await chrome.runtime.sendMessage({
      type: "NAVIGATE_MATCH",
      direction
    });

    setStatus(response?.ok ? "" : response?.reason || "ConsentLens could not move to the next term.");
    updateNavigationState(response);
  }

  async function initializePopup() {
    ids.forEach((id) => {
      document.getElementById(id)?.addEventListener("change", persistSettings);
    });

    document.getElementById("rescanButton").addEventListener("click", async () => {
      const result = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
      setStatus(result?.ok ? "" : result?.reason || "ConsentLens could not scan this page.");
      await refreshPageState();
      await refreshNavigationState();
    });

    document.getElementById("prevMatchButton").addEventListener("click", () => navigate("previous"));
    document.getElementById("nextMatchButton").addEventListener("click", () => navigate("next"));

    document.getElementById("presetEssential").addEventListener("click", () => applyPreset("essential"));
    document.getElementById("presetBalanced").addEventListener("click", () => applyPreset("balanced"));
    document.getElementById("presetEverything").addEventListener("click", () => applyPreset("everything"));

    await syncInputs();
    const result = await chrome.runtime.sendMessage({ type: "REQUEST_RESCAN" });
    setStatus(result?.ok ? "" : result?.reason || "ConsentLens could not scan this page.");
    await refreshPageState();
    await refreshNavigationState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePopup, { once: true });
  } else {
    initializePopup();
  }
})();
