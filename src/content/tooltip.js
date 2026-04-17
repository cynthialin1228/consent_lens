(() => {
  let tooltipElement;

  function ensureTooltip() {
    if (tooltipElement) {
      return tooltipElement;
    }

    tooltipElement = document.createElement("div");
    tooltipElement.className = "consent-lens-tooltip";
    tooltipElement.hidden = true;
    document.documentElement.appendChild(tooltipElement);
    return tooltipElement;
  }

  function positionTooltip(target, tooltip) {
    const rect = target.getBoundingClientRect();
    tooltip.style.top = `${window.scrollY + rect.bottom + 8}px`;
    tooltip.style.left = `${window.scrollX + rect.left}px`;
  }

  function attachTooltipListeners() {
    const tooltip = ensureTooltip();

    document.addEventListener("mouseover", (event) => {
      const target = event.target.closest(".consent-lens-highlight");
      if (!target) {
        tooltip.hidden = true;
        return;
      }

      tooltip.textContent = target.dataset.explanation || "";
      positionTooltip(target, tooltip);
      tooltip.hidden = false;
    });

    document.addEventListener("focusin", (event) => {
      const target = event.target.closest(".consent-lens-highlight");
      if (!target) {
        return;
      }

      tooltip.textContent = target.dataset.explanation || "";
      positionTooltip(target, tooltip);
      tooltip.hidden = false;
    });

    document.addEventListener("mouseout", (event) => {
      if (event.target.closest(".consent-lens-highlight")) {
        tooltip.hidden = true;
      }
    });

    document.addEventListener("focusout", (event) => {
      if (event.target.closest(".consent-lens-highlight")) {
        tooltip.hidden = true;
      }
    });
  }

  globalThis.ConsentLensTooltip = {
    attachTooltipListeners
  };
})();
