const STORAGE_KEY = "consentLensSettings";
const UI_STATE_KEY = "consentLensPageState";
const DEFAULT_SETTINGS = {
  enabled: true,
  showTooltips: true,
  highlightHigh: true,
  highlightMedium: true,
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
const CONTENT_SCRIPT_FILES = [
  "src/shared/constants.js",
  "src/shared/terms-dictionary.js",
  "src/shared/settings.js",
  "src/content/scanner.js",
  "src/content/highlighter.js",
  "src/content/tooltip.js",
  "src/content/content.js"
];
const CONTENT_CSS_FILES = [
  "src/content/content.css"
];

async function getSettings() {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  const saved = stored[STORAGE_KEY] || {};

  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    categories: {
      ...DEFAULT_SETTINGS.categories,
      ...(saved.categories || {})
    }
  };
}

async function saveSettings(settings) {
  await chrome.storage.sync.set({
    [STORAGE_KEY]: settings
  });
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  return tabs[0] || null;
}

async function ensureContentScript(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: "PING_CONSENT_LENS" });
    return true;
  } catch (error) {
    try {
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: CONTENT_CSS_FILES
      });
    } catch (cssError) {
      // Ignore duplicate CSS insertion failures and continue to script injection.
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      files: CONTENT_SCRIPT_FILES
    });

    await chrome.tabs.sendMessage(tabId, { type: "PING_CONSENT_LENS" });
    return true;
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  await saveSettings(settings);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "GET_SETTINGS") {
    getSettings().then((settings) => sendResponse({ settings }));
    return true;
  }

  if (message?.type === "SAVE_SETTINGS") {
    saveSettings(message.settings).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "SAVE_PAGE_STATE" && sender.tab?.id) {
    chrome.storage.session.set({
      [`${UI_STATE_KEY}:${sender.tab.id}`]: message.state
    }).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "GET_PAGE_STATE") {
    getActiveTab().then(async (tab) => {
      if (!tab?.id) {
        sendResponse({ state: null });
        return;
      }

      const result = await chrome.storage.session.get(`${UI_STATE_KEY}:${tab.id}`);
      sendResponse({ state: result[`${UI_STATE_KEY}:${tab.id}`] || null });
    });
    return true;
  }

  if (message?.type === "REQUEST_RESCAN") {
    getActiveTab().then(async (tab) => {
      if (!tab?.id) {
        sendResponse({
          ok: false,
          reason: "ConsentLens could not find the current browser tab."
        });
        return;
      }

      if (!tab.url || !/^https?:/i.test(tab.url)) {
        sendResponse({
          ok: false,
          reason: "ConsentLens works on normal http and https webpages."
        });
        return;
      }

      try {
        await ensureContentScript(tab.id);
        await chrome.tabs.sendMessage(tab.id, { type: "RESCAN_PAGE" });
        sendResponse({ ok: true });
      } catch (error) {
        const reason = error?.message || String(error);
        sendResponse({
          ok: false,
          reason: `ConsentLens could not access this page: ${reason}`
        });
      }
    });
    return true;
  }

  return false;
});
