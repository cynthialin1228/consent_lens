const STORAGE_KEY = "consentLensSettings";
const UI_STATE_KEY = "consentLensPageState";
const DEFAULT_SETTINGS = {
  enabled: true,
  showTooltips: true,
  highlightHigh: true,
  highlightMedium: true,
  highlightLow: false,
  customTerms: [],
  categories: {
    privacy: true,
    money: true,
    tracking: true,
    "data-sharing": true,
    "legal-rights": true,
    termination: true,
    biometrics: true,
    custom: true
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

async function relayToActiveTab(payload) {
  const tab = await getActiveTab();

  if (!tab?.id) {
    return {
      ok: false,
      reason: "ConsentLens could not find the current browser tab."
    };
  }

  if (!tab.url || !/^https?:/i.test(tab.url)) {
    return {
      ok: false,
      reason: "ConsentLens works on normal http and https webpages."
    };
  }

  try {
    await ensureContentScript(tab.id);
    const response = await chrome.tabs.sendMessage(tab.id, payload);
    return response || { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: `ConsentLens could not access this page: ${error?.message || String(error)}`
    };
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
    relayToActiveTab({ type: "RESCAN_PAGE" }).then(sendResponse);
    return true;
  }

  if (message?.type === "GET_NAVIGATION_STATE") {
    relayToActiveTab({ type: "GET_NAVIGATION_STATE" }).then(sendResponse);
    return true;
  }

  if (message?.type === "NAVIGATE_MATCH") {
    relayToActiveTab({
      type: "NAVIGATE_MATCH",
      direction: message.direction
    }).then(sendResponse);
    return true;
  }

  return false;
});
