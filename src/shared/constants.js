(() => {
  const STORAGE_KEY = "consentLensSettings";
  const FIRST_RUN_KEY = "consentLensFirstRun";

  const DEFAULT_SETTINGS = {
    enabled: true,
    showTooltips: true,
    highlightHigh: true,
    highlightMedium: false,
    highlightLow: false,
    categories: {
      privacy: true,
      money: true,
      tracking: true,
      "data-sharing": true,
      "legal-rights": true,
      termination: true,
      biometrics: true
    }
  };

  const SEVERITY_STYLES = {
    high: "consent-lens-highlight-high",
    medium: "consent-lens-highlight-medium",
    low: "consent-lens-highlight-low"
  };

  const UI_STATE_KEY = "consentLensPageState";

  const CATEGORY_LABELS = {
    privacy: "Privacy",
    money: "Money",
    tracking: "Tracking",
    "data-sharing": "Data Sharing",
    "legal-rights": "Legal Rights",
    termination: "Termination",
    biometrics: "Biometrics"
  };

  globalThis.ConsentLensConstants = {
    STORAGE_KEY,
    FIRST_RUN_KEY,
    DEFAULT_SETTINGS,
    SEVERITY_STYLES,
    UI_STATE_KEY,
    CATEGORY_LABELS
  };
})();
