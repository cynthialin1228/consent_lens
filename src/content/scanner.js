(() => {
  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
          regex: new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "gi"),
          entry
        });
      });
    });

    return sortPatternsByLength(patterns);
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
        matches.push({
          start: found.index,
          end: found.index + found[0].length,
          matchedText: found[0],
          entry: pattern.entry
        });
      }
    });

    matches.sort((a, b) => {
      if (a.start !== b.start) {
        return a.start - b.start;
      }

      return b.end - a.end;
    });

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
    if (!parent) {
      return true;
    }

    const skipSelector = [
      "script",
      "style",
      "textarea",
      "input",
      "select",
      "option",
      "pre",
      "code",
      "[contenteditable='true']",
      ".consent-lens-highlight",
      ".consent-lens-toolbar",
      ".consent-lens-toolbar-toggle",
      ".consent-lens-tooltip"
    ].join(",");

    if (parent.closest(skipSelector)) {
      return true;
    }

    const value = node.nodeValue;
    if (!value || !value.trim()) {
      return true;
    }

    const style = window.getComputedStyle(parent);
    return style.visibility === "hidden" || style.display === "none";
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

  globalThis.ConsentLensScanner = {
    buildPatterns,
    findMatches,
    collectTextNodes
  };
})();
