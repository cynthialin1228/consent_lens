(() => {
  const { SEVERITY_STYLES } = globalThis.ConsentLensConstants;

  function clearHighlights() {
    document.querySelectorAll(".consent-lens-highlight").forEach((element) => {
      const parent = element.parentNode;
      if (!parent) {
        return;
      }

      parent.replaceChild(document.createTextNode(element.textContent || ""), element);
      parent.normalize();
    });
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
      mark.className = `consent-lens-highlight ${SEVERITY_STYLES[match.entry.severity]}`;
      mark.textContent = source.slice(match.start, match.end);
      mark.dataset.termId = match.entry.id;
      mark.dataset.category = match.entry.category;
      mark.dataset.severity = match.entry.severity;
      mark.dataset.explanation = match.entry.explanation;

      if (showTooltips) {
        mark.setAttribute("tabindex", "0");
        mark.setAttribute("aria-label", `${mark.textContent}. ${match.entry.explanation}`);
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
