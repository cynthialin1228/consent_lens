(() => {
  let tooltipElement;

  function ensureTooltip() {
    if (tooltipElement) return tooltipElement;

    tooltipElement = document.createElement("div");
    tooltipElement.className = "consent-lens-tooltip";
    tooltipElement.hidden = true;
    // pointer-events: none set in CSS so tooltip never blocks mouse events
    document.documentElement.appendChild(tooltipElement);
    return tooltipElement;
  }

  function positionTooltip(target, tooltip) {
    // Show briefly off-screen to measure dimensions before placing
    tooltip.style.visibility = "hidden";
    tooltip.style.top = "0px";
    tooltip.style.left = "0px";
    tooltip.hidden = false;

    const rect = target.getBoundingClientRect();
    const tipW = tooltip.offsetWidth;
    const tipH = tooltip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const gap = 8;

    // Preferred: below the term
    let top = scrollY + rect.bottom + gap;
    let left = scrollX + rect.left;

    // Clamp right edge
    if (rect.left + tipW > vw) {
      left = scrollX + vw - tipW - gap;
    }

    // Clamp left edge
    if (left < scrollX + gap) {
      left = scrollX + gap;
    }

    // If tooltip would overflow bottom of viewport, flip above the term
    if (rect.bottom + gap + tipH > vh) {
      top = scrollY + rect.top - tipH - gap;
    }

    // Final safety: never go above the page top
    if (top < scrollY) {
      top = scrollY + gap;
    }

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
    tooltip.style.visibility = "";
  }

  function hideTooltip() {
    if (tooltipElement) tooltipElement.hidden = true;
  }

  function attachTooltipListeners() {
    const tooltip = ensureTooltip();

    document.addEventListener("mouseover", (event) => {
      const target = event.target.closest(".consent-lens-highlight");
      if (!target) {
        hideTooltip();
        return;
      }
      tooltip.textContent = target.dataset.explanation || "";
      positionTooltip(target, tooltip);
    });

    document.addEventListener("focusin", (event) => {
      const target = event.target.closest(".consent-lens-highlight");
      if (!target) return;
      tooltip.textContent = target.dataset.explanation || "";
      positionTooltip(target, tooltip);
    });

    document.addEventListener("mouseout", (event) => {
      if (event.target.closest(".consent-lens-highlight")) {
        hideTooltip();
      }
    });

    document.addEventListener("focusout", (event) => {
      if (event.target.closest(".consent-lens-highlight")) {
        hideTooltip();
      }
    });

    // Hide tooltip when the user scrolls or resizes — it would otherwise
    // float at the wrong position until the next mouseover event.
    window.addEventListener("scroll", hideTooltip, { passive: true });
    window.addEventListener("resize", hideTooltip, { passive: true });
  }

  globalThis.ConsentLensTooltip = {
    attachTooltipListeners
  };
})();
