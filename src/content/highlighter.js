(() => {
  const { SEVERITY_STYLES } = globalThis.ConsentLensConstants;

  function clearHighlights() {
    // Collect all parents that need normalizing before we start mutating,
    // so we can batch the normalize() calls after all replacements are done.
    const parentsToNormalize = new Set();

    document.querySelectorAll(".consent-lens-highlight").forEach((element) => {
      const parent = element.parentNode;
      if (!parent) return;

      parent.replaceChild(document.createTextNode(element.textContent || ""), element);
      parentsToNormalize.add(parent);
    });

    // Normalize once per parent after all spans are removed — avoids repeated
    // reflows that happen when normalize() is called inside the forEach loop.
    parentsToNormalize.forEach((parent) => parent.normalize());
  }

  function highlightMatches(textNode, matches, showTooltips) {
    const fragment = document.createDocumentFragment();
    const source = textNode.nodeValue || "";
    let cursor = 0;

    matches.forEach((match) => {
      if (match.start > cursor) {
        fragment.appendChild(document.createTextNode(source.slice(cursor, match.start)));
      }

      const mark = document.createElement("span");
      mark.className = "consent-lens-highlight " + (SEVERITY_STYLES[match.entry.severity] || "");
      mark.textContent = source.slice(match.start, match.end);
      mark.dataset.termId = match.entry.id;
      mark.dataset.category = match.entry.category;
      mark.dataset.severity = match.entry.severity;
      // Store explanation as textContent-safe data attribute — never injected
      // as HTML, so no XSS risk here.
      mark.dataset.explanation = match.entry.explanation;

      if (showTooltips) {
        mark.setAttribute("tabindex", "0");
        mark.setAttribute("aria-label", mark.textContent + ". " + match.entry.explanation);
      }

      fragment.appendChild(mark);
      cursor = match.end;
    });

    if (cursor < source.length) {
      fragment.appendChild(document.createTextNode(source.slice(cursor)));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  }

  globalThis.ConsentLensHighlighter = {
    clearHighlights,
    highlightMatches
  };
})();
