(() => {
  const dictionary = globalThis.ConsentLensDictionary;
  const { CATEGORY_LABELS } = globalThis.ConsentLensConstants;
  const { getSettings } = globalThis.ConsentLensSettings;
  const { buildPatterns, findMatches, collectTextNodes, collectScanRoots } = globalThis.ConsentLensScanner;
  const { clearHighlights, highlightMatches } = globalThis.ConsentLensHighlighter;
  const { attachTooltipListeners } = globalThis.ConsentLensTooltip;
  let observer;
  let isApplyingHighlights = false;
  let allHighlightedElements = [];
  let highlightedElements = [];
  let activeMatchIndex = -1;
  let toolbarElement;
  let toolbarToggleElement;
  let pageState = {
    counts: { total: 0, high: 0, medium: 0, low: 0 },
    categories: {}
  };
  const viewFilters = {
    highRiskOnly: false,
    activeCategories: new Set()
  };

  function buildRuntimeDictionary(settings) {
    const customEntries = (settings.customTerms || [])
      .map((term) => term.trim())
      .filter(Boolean)
      .map((term, index) => ({
        id: `custom-${index}-${term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        phrase: term,
        variants: [],
        category: "custom",
        severity: "medium",
        explanation: "Custom term added by you. Review this section closely."
      }));

    return [...dictionary, ...customEntries];
  }

  function buildPageState(matchGroups) {
    const counts = {
      total: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    const categories = {};

    matchGroups.forEach((match) => {
      counts.total += 1;
      counts[match.entry.severity] += 1;
      categories[match.entry.category] = (categories[match.entry.category] || 0) + 1;
    });

    return { counts, categories };
  }

  async function savePageState(state) {
    await chrome.runtime.sendMessage({
      type: "SAVE_PAGE_STATE",
      state
    });
  }

  function getVisibleCategoryEntries() {
    return Object.entries(pageState.categories)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
  }

  function updateActiveMatch(nextIndex, options = {}) {
    if (!highlightedElements.length) {
      activeMatchIndex = -1;
      return {
        ok: true,
        index: 0,
        total: 0
      };
    }

    if (activeMatchIndex >= 0 && highlightedElements[activeMatchIndex]) {
      highlightedElements[activeMatchIndex].classList.remove("consent-lens-highlight-active");
    }

    activeMatchIndex = ((nextIndex % highlightedElements.length) + highlightedElements.length) % highlightedElements.length;
    const activeElement = highlightedElements[activeMatchIndex];
    activeElement.classList.add("consent-lens-highlight-active");

    if (options.scrollIntoView) {
      activeElement.scrollIntoView({
        behavior: options.behavior || "smooth",
        block: "center",
        inline: "nearest"
      });
    }

    if (options.focus) {
      activeElement.focus({ preventScroll: true });
    }

    return {
      ok: true,
      index: activeMatchIndex + 1,
      total: highlightedElements.length,
      matchedText: activeElement.textContent || "",
      severity: activeElement.dataset.severity || "",
      explanation: activeElement.dataset.explanation || ""
    };
  }

  function getNavigationState() {
    if (!highlightedElements.length) {
      return {
        ok: true,
        index: 0,
        total: 0
      };
    }

    const activeElement = highlightedElements[activeMatchIndex] || highlightedElements[0];

    return {
      ok: true,
      index: activeMatchIndex + 1,
      total: highlightedElements.length,
      matchedText: activeElement.textContent || "",
      severity: activeElement.dataset.severity || "",
      explanation: activeElement.dataset.explanation || ""
    };
  }

  function ensureToolbar() {
    if (!toolbarElement) {
      toolbarElement = document.createElement("aside");
      toolbarElement.className = "consent-lens-toolbar";
      document.documentElement.appendChild(toolbarElement);
    }

    if (!toolbarToggleElement) {
      toolbarToggleElement = document.createElement("button");
      toolbarToggleElement.className = "consent-lens-toolbar-toggle";
      toolbarToggleElement.type = "button";
      toolbarToggleElement.textContent = "Show ConsentLens";
      toolbarToggleElement.hidden = true;
      toolbarToggleElement.addEventListener("click", () => {
        toolbarElement.hidden = false;
        toolbarToggleElement.hidden = true;
      });
      document.documentElement.appendChild(toolbarToggleElement);
    }
  }

  function showToolbar() {
    ensureToolbar();
    toolbarElement.hidden = false;
    toolbarToggleElement.hidden = true;
  }

  function hideToolbar() {
    ensureToolbar();
    toolbarElement.hidden = true;
    toolbarToggleElement.hidden = false;
  }

  function initializeCategoryFilters() {
    const categories = getVisibleCategoryEntries().map(([category]) => category);
    const previousSelection = new Set(
      [...viewFilters.activeCategories].filter((category) => categories.includes(category))
    );

    viewFilters.activeCategories = previousSelection.size ? previousSelection : new Set(categories);
  }

  function renderToolbar() {
    ensureToolbar();

    const navigationState = getNavigationState();
    const visibleCategories = getVisibleCategoryEntries();
    const visibleCount = navigationState.total || 0;
    const rawCount = pageState.counts.total || 0;
    const categoryButtons = visibleCategories.map(([category, count]) => {
      const isActive = viewFilters.activeCategories.has(category);
      const chipClass = `consent-lens-toolbar-chip${isActive ? " is-active" : " is-hidden"}`;
      const label = CATEGORY_LABELS[category] || category;
      return `<button type="button" class="${chipClass}" data-action="toggle-category" data-category="${category}">${label} (${count})</button>`;
    }).join("");

    const termTitle = navigationState.matchedText || "No flagged term selected";
    const termBody = navigationState.explanation || "Use the arrows to move through flagged terms on this page.";

    toolbarElement.innerHTML = `
      <div class="consent-lens-toolbar-header">
        <div>
          <p class="consent-lens-toolbar-title">ConsentLens Review Bar</p>
          <p class="consent-lens-toolbar-subtitle">Showing ${visibleCount} of ${rawCount} flagged terms across ${visibleCategories.length} categories.</p>
        </div>
        <div class="consent-lens-toolbar-actions">
          <button type="button" class="consent-lens-toolbar-button" data-action="toggle-high-risk">${viewFilters.highRiskOnly ? "Show all" : "High risk only"}</button>
          <button type="button" class="consent-lens-toolbar-button" data-action="hide-toolbar">Hide</button>
        </div>
      </div>
      <div class="consent-lens-toolbar-counter">
        <button type="button" class="consent-lens-toolbar-button" data-action="previous" ${visibleCount ? "" : "disabled"}>Prev</button>
        <strong>${navigationState.index || 0} / ${visibleCount}</strong>
        <button type="button" class="consent-lens-toolbar-button is-primary" data-action="next" ${visibleCount ? "" : "disabled"}>Next</button>
      </div>
      <p class="consent-lens-toolbar-summary">Tip: press Alt + Shift + Right or Alt + Shift + Left to jump through flagged terms without opening the popup.</p>
      <div class="consent-lens-toolbar-term">
        <strong>${termTitle}</strong>
        <span>${termBody}</span>
      </div>
      <div class="consent-lens-toolbar-filter-group">
        <p class="consent-lens-toolbar-filter-label">Quick Filters</p>
        <div class="consent-lens-toolbar-chips">${categoryButtons}</div>
      </div>
    `;

    toolbarElement.querySelector("[data-action='previous']")?.addEventListener("click", () => {
      updateActiveMatch(activeMatchIndex - 1, { scrollIntoView: true, focus: true });
      renderToolbar();
    });

    toolbarElement.querySelector("[data-action='next']")?.addEventListener("click", () => {
      updateActiveMatch(activeMatchIndex + 1, { scrollIntoView: true, focus: true });
      renderToolbar();
    });

    toolbarElement.querySelector("[data-action='toggle-high-risk']")?.addEventListener("click", () => {
      viewFilters.highRiskOnly = !viewFilters.highRiskOnly;
      rebuildNavigationState();
    });

    toolbarElement.querySelector("[data-action='hide-toolbar']")?.addEventListener("click", hideToolbar);

    toolbarElement.querySelectorAll("[data-action='toggle-category']").forEach((button) => {
      button.addEventListener("click", () => {
        const { category } = button.dataset;
        if (viewFilters.activeCategories.has(category)) {
          viewFilters.activeCategories.delete(category);
        } else {
          viewFilters.activeCategories.add(category);
        }

        if (!viewFilters.activeCategories.size) {
          getVisibleCategoryEntries().forEach(([name]) => viewFilters.activeCategories.add(name));
        }

        rebuildNavigationState();
      });
    });
  }

  function rebuildNavigationState() {
    highlightedElements = allHighlightedElements.filter((element) => {
      const categoryAllowed = !viewFilters.activeCategories.size || viewFilters.activeCategories.has(element.dataset.category);
      const severityAllowed = !viewFilters.highRiskOnly || element.dataset.severity === "high";
      const isVisible = categoryAllowed && severityAllowed;
      element.classList.toggle("consent-lens-highlight-muted", !isVisible);
      return isVisible;
    });

    allHighlightedElements.forEach((element) => {
      element.classList.remove("consent-lens-highlight-active");
    });

    highlightedElements.forEach((element, index) => {
      element.dataset.matchIndex = String(index);
    });

    if (!highlightedElements.length) {
      activeMatchIndex = -1;
      renderToolbar();
      return;
    }

    updateActiveMatch(0, { scrollIntoView: false, focus: false });
    renderToolbar();
  }

  function isTypingTarget(target) {
    if (!target) {
      return false;
    }

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return true;
    }

    return Boolean(target.closest("[contenteditable='true'], input, textarea, select"));
  }

  function isExtensionMutationTarget(node) {
    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return Boolean(node.parentElement?.closest(".consent-lens-toolbar, .consent-lens-toolbar-toggle, .consent-lens-tooltip"));
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return Boolean(node.closest(".consent-lens-toolbar, .consent-lens-toolbar-toggle, .consent-lens-tooltip"));
    }

    return false;
  }

  function bindKeyboardNavigation() {
    if (globalThis.__consentLensKeyboardBound) {
      return;
    }

    document.addEventListener("keydown", (event) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.altKey && event.shiftKey && event.key === "ArrowRight") {
        event.preventDefault();
        updateActiveMatch(activeMatchIndex + 1, { scrollIntoView: true, focus: true });
        renderToolbar();
      }

      if (event.altKey && event.shiftKey && event.key === "ArrowLeft") {
        event.preventDefault();
        updateActiveMatch(activeMatchIndex - 1, { scrollIntoView: true, focus: true });
        renderToolbar();
      }
    });

    globalThis.__consentLensKeyboardBound = true;
  }

  async function scanPage() {
    isApplyingHighlights = true;

    try {
      const settings = await getSettings();
      const patterns = buildPatterns(buildRuntimeDictionary(settings));
      clearHighlights();

      if (!settings.enabled) {
        pageState = {
          counts: { total: 0, high: 0, medium: 0, low: 0 },
          categories: {}
        };
        allHighlightedElements = [];
        await savePageState(pageState);
        renderToolbar();
        return;
      }

      const roots = collectScanRoots();
      const allMatches = [];
      const seenNodes = new Set();

      roots.forEach((root) => {
        collectTextNodes(root).forEach((node) => {
          if (seenNodes.has(node)) {
            return;
          }

          seenNodes.add(node);
          const matches = findMatches(node.nodeValue || "", patterns, settings);
          if (!matches.length) {
            return;
          }

          allMatches.push(...matches);
          highlightMatches(node, matches, settings.showTooltips);
        });
      });

      if (!allMatches.length && roots[0] !== document.body) {
        collectTextNodes(document.body).forEach((node) => {
          if (seenNodes.has(node)) {
            return;
          }

          const matches = findMatches(node.nodeValue || "", patterns, settings);
          if (!matches.length) {
            return;
          }

          allMatches.push(...matches);
          highlightMatches(node, matches, settings.showTooltips);
        });
      }

      pageState = buildPageState(allMatches);
      allHighlightedElements = Array.from(document.querySelectorAll(".consent-lens-highlight"));
      initializeCategoryFilters();
      showToolbar();
      rebuildNavigationState();
      await savePageState(pageState);
    } finally {
      isApplyingHighlights = false;
    }
  }

  function scheduleRescan() {
    window.clearTimeout(scheduleRescan.timerId);
    scheduleRescan.timerId = window.setTimeout(() => {
      scanPage();
    }, 300);
  }

  function startObserver() {
    if (!document.body) {
      return;
    }

    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
      if (isApplyingHighlights) {
        return;
      }

      const hasRelevantChange = mutations.some((mutation) => {
        if (isExtensionMutationTarget(mutation.target)) {
          return false;
        }

        const movedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
        if (movedNodes.length && movedNodes.every((node) => isExtensionMutationTarget(node))) {
          return false;
        }

        return mutation.type === "childList" || mutation.type === "characterData";
      });

      if (hasRelevantChange) {
        scheduleRescan();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "PING_CONSENT_LENS") {
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === "RESCAN_PAGE") {
      scanPage().then(() => sendResponse({ ok: true }));
      return true;
    }

    if (message?.type === "GET_NAVIGATION_STATE") {
      sendResponse(getNavigationState());
      return false;
    }

    if (message?.type === "NAVIGATE_MATCH") {
      const offset = message.direction === "previous" ? -1 : 1;
      const response = updateActiveMatch(activeMatchIndex + offset, { scrollIntoView: true, focus: true });
      renderToolbar();
      sendResponse(response);
      return true;
    }

    return false;
  });

  if (!globalThis.__consentLensInitialized) {
    globalThis.__consentLensInitialized = true;
    attachTooltipListeners();
    bindKeyboardNavigation();
    scanPage();
    startObserver();
  }
})();
