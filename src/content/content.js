(() => {
  const dictionary = globalThis.ConsentLensDictionary;
  const { getSettings } = globalThis.ConsentLensSettings;
  const { buildPatterns, findMatches, collectTextNodes } = globalThis.ConsentLensScanner;
  const { clearHighlights, highlightMatches } = globalThis.ConsentLensHighlighter;
  const { attachTooltipListeners } = globalThis.ConsentLensTooltip;

  const patterns = buildPatterns(dictionary);
  let observer;
  let isApplyingHighlights = false;

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

    return false;
  });

  if (!globalThis.__consentLensInitialized) {
    globalThis.__consentLensInitialized = true;
    attachTooltipListeners();
    scanPage();
    startObserver();
  }
})();
