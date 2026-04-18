(() => {
  // Escapes special regex characters in a string.
  // Written without the $& backreference to avoid a known tool corruption issue.
  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, function (char) {
      return "\\" + char;
    });
  }

  function sortPatternsByLength(patterns) {
    return [...patterns].sort((a, b) => b.text.length - a.text.length);
  }

  function buildPatterns(dictionary) {
    const patterns = [];

    dictionary.forEach((entry) => {
      const phrases = [entry.phrase, ...(entry.variants || [])];
      phrases.forEach((phrase) => {
        patterns.push({
          text: phrase,
          regex: new RegExp("\\b" + escapeRegExp(phrase) + "\\b", "gi"),
          entry
        });
      });
    });

    return sortPatternsByLength(patterns);
  }

  function hasRequiredContext(text, match, entry) {
    if (!entry.requiresContextAny?.length) {
      return true;
    }

    const start = Math.max(0, match.start - 150);
    const end = Math.min(text.length, match.end + 150);
    const snippet = text.slice(start, end).toLowerCase();

    return entry.requiresContextAny.some((keyword) => snippet.includes(keyword.toLowerCase()));
  }

  function findMatches(text, patterns, settings) {
    const matches = [];

    patterns.forEach((pattern) => {
      const { category, severity } = pattern.entry;
      if (!settings.categories[category]) {
        return;
      }

      if (
        (severity === "high" && !settings.highlightHigh) ||
        (severity === "medium" && !settings.highlightMedium) ||
        (severity === "low" && !settings.highlightLow)
      ) {
        return;
      }

      pattern.regex.lastIndex = 0;
      let found;

      while ((found = pattern.regex.exec(text)) !== null) {
        const match = {
          start: found.index,
          end: found.index + found[0].length,
          matchedText: found[0],
          entry: pattern.entry
        };

        if (!hasRequiredContext(text, match, pattern.entry)) {
          continue;
        }

        matches.push(match);
      }
    });

    // Sort by position, longest match wins on ties
    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return b.end - a.end;
    });

    // Remove overlapping matches — keep the first (longest) at each position
    const filtered = [];
    let lastEnd = -1;

    matches.forEach((match) => {
      if (match.start >= lastEnd) {
        filtered.push(match);
        lastEnd = match.end;
      }
    });

    return filtered;
  }

  function isSkippableNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;

    // Skip extension's own elements and non-content elements
    const skipSelector = [
      "script",
      "style",
      "textarea",
      "input",
      "select",
      "option",
      "pre",
      "code",
      "noscript",
      "[contenteditable='true']",
      ".consent-lens-highlight",
      ".consent-lens-toolbar",
      ".consent-lens-toolbar-toggle",
      ".consent-lens-tooltip"
    ].join(",");

    if (parent.closest(skipSelector)) return true;

    const value = node.nodeValue;
    if (!value || !value.trim()) return true;

    // getComputedStyle is expensive — only call it when the node passes all
    // cheaper checks above. Also check opacity so invisible elements are skipped.
    const style = window.getComputedStyle(parent);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
      return true;
    }

    return false;
  }

  function collectTextNodes(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let current;

    while ((current = walker.nextNode())) {
      if (!isSkippableNode(current)) {
        textNodes.push(current);
      }
    }

    return textNodes;
  }

  function collectScanRoots() {
    const selector = [
      "dialog",
      "[role='dialog']",
      "[aria-modal='true']",
      "main",
      "article",
      "section",
      "aside",
      "form",
      ".modal",
      ".popup",
      ".cookie",
      ".consent",
      ".privacy",
      ".terms"
    ].join(",");

    // Use textContent instead of innerText — textContent does not trigger
    // layout reflow, making this significantly faster on large pages.
    const cuePattern = /(privacy|terms|consent|cookies|cookie|policy|agreement|personal information|data sharing|tracking|subscription|arbitration)/i;
    const candidates = Array.from(document.querySelectorAll(selector)).filter(
      (element) => cuePattern.test(element.textContent || "")
    );

    if (!candidates.length) {
      return [document.body];
    }

    return candidates.slice(0, 12);
  }

  globalThis.ConsentLensScanner = {
    buildPatterns,
    findMatches,
    collectTextNodes,
    collectScanRoots
  };
})();
