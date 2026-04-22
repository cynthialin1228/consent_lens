(() => {
  const {
    DEFAULT_SETTINGS: CONSENT_LENS_DEFAULT_SETTINGS,
    STORAGE_KEY: CONSENT_LENS_STORAGE_KEY
  } = globalThis.ConsentLensConstants;

  // chrome.storage calls throw "Extension context invalidated" when the
  // extension is reloaded while the content script is still running on a tab.
  // We catch that specific error and return gracefully so callers don't get
  // unhandled promise rejections.

  function isContextError(err) {
    return err?.message?.includes("Extension context invalidated");
  }

  async function getSettings() {
    try {
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
    } catch (err) {
      if (isContextError(err)) {
        // Return defaults silently — the content script will shut itself down
        // via its own contextValid guard after this returns.
        return { ...CONSENT_LENS_DEFAULT_SETTINGS };
      }
      throw err;
    }
  }

  async function saveSettings(settings) {
    try {
      await chrome.storage.sync.set({ [CONSENT_LENS_STORAGE_KEY]: settings });
    } catch (err) {
      if (isContextError(err)) return;
      throw err;
    }
  }

  globalThis.ConsentLensSettings = {
    getSettings,
    saveSettings
  };
})();
