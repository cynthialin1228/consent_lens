(() => {
  const dictionary = globalThis.ConsentLensDictionary;
  const { getSettings } = globalThis.ConsentLensSettings;
  const { buildPatterns, findMatches, collectTextNodes } = globalThis.ConsentLensScanner;
  const { clearHighlights, highlightMatches } = globalThis.ConsentLensHighlighter;
  const { attachTooltipListeners } = globalThis.ConsentLensTooltip;

  const patterns = buildPatterns(dictionary);
  let observer;
  let isApplyingHighlights = false;
  let highlightedElements = [];
  let activeMatchIndex = -1;

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

  function rebuildNavigationState() {
    highlightedElements = Array.from(document.querySelectorAll(".consent-lens-highlight"));
    highlightedElements.forEach((element, index) => {
      element.dataset.matchIndex = String(index);
      element.classList.remove("consent-lens-highlight-active");
    });

    if (!highlightedElements.length) {
      activeMatchIndex = -1;
      return;
    }

    updateActiveMatch(0, { scrollIntoView: false, focus: false });
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

  function isTypingTarget(target) {
    if (!target) {
      return false;
    }

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return true;
    }

    return Boolean(target.closest("[contenteditable='true'], input, textarea, select"));
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
      }

      if (event.altKey && event.shiftKey && event.key === "ArrowLeft") {
        event.preventDefault();
        updateActiveMatch(activeMatchIndex - 1, { scrollIntoView: true, focus: true });
      }
    });

    globalThis.__consentLensKeyboardBound = true;
  }

  async function scanPage() {
    isApplyingHighlights = true;

    try {
      const settings = await getSettings();
      clearHighlights();

      if (!settings.enabled) {
        await savePageState({
          counts: { total: 0, high: 0, medium: 0, low: 0 },
          categories: {}
        });
        return;
      }

      const textNodes = collectTextNodes();
      const allMatches = [];

      textNodes.forEach((node) => {
        const matches = findMatches(node.nodeValue || "", patterns, settings);
        if (!matches.length) {
          return;
        }

        allMatches.push(...matches);
        highlightMatches(node, matches, settings.showTooltips);
      });

      rebuildNavigationState();
      await savePageState(buildPageState(allMatches));
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
      sendResponse(updateActiveMatch(activeMatchIndex + offset, { scrollIntoView: true, focus: true }));
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
