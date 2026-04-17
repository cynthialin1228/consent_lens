(() => {
  const {
    DEFAULT_SETTINGS: CONSENT_LENS_DEFAULT_SETTINGS,
    STORAGE_KEY: CONSENT_LENS_STORAGE_KEY
  } = globalThis.ConsentLensConstants;

  async function getSettings() {
    const stored = await chrome.storage.sync.get(CONSENT_LENS_STORAGE_KEY);
    const saved = stored[CONSENT_LENS_STORAGE_KEY] || {};

    return {
      ...CONSENT_LENS_DEFAULT_SETTINGS,
      ...saved,
      categories: {
        ...CONSENT_LENS_DEFAULT_SETTINGS.categories,
        ...(saved.categories || {})
      }
    };
  }

  async function saveSettings(settings) {
    await chrome.storage.sync.set({
      [CONSENT_LENS_STORAGE_KEY]: settings
    });
  }

  globalThis.ConsentLensSettings = {
    getSettings,
    saveSettings
  };
})();
