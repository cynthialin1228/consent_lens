const STORAGE_KEY = "consentLensSettings";
const UI_STATE_KEY = "consentLensPageState";
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

// ─── Settings ──────────────────────────────────────────────────────────────

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
  await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
}

// ─── Tab helpers ───────────────────────────────────────────────────────────

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tabs[0] || null;
}

async function ensureContentScript(tabId) {
  // First try pinging — if the content script is already running, we're done.
  try {
    await chrome.tabs.sendMessage(tabId, { type: "PING_CONSENT_LENS" });
    return true;
  } catch {
    // Not running yet — inject it.
  }

  // Inject CSS first (failures are non-fatal — duplicate injection is fine).
  try {
    await chrome.scripting.insertCSS({ target: { tabId }, files: CONTENT_CSS_FILES });
  } catch {
    // Ignore — CSS may already be injected.
  }

  // Inject scripts.
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: CONTENT_SCRIPT_FILES });
  } catch (err) {
    throw new Error("Could not inject content script: " + (err?.message || String(err)));
  }

  // Confirm the script is now responding.
  try {
    await chrome.tabs.sendMessage(tabId, { type: "PING_CONSENT_LENS" });
    return true;
  } catch (err) {
    throw new Error("Content script injected but not responding: " + (err?.message || String(err)));
  }
}

async function relayToActiveTab(payload) {
  const tab = await getActiveTab();

  if (!tab?.id) {
    return { ok: false, reason: "ConsentLens could not find the current browser tab." };
  }

  if (!tab.url || !/^https?:/i.test(tab.url)) {
    return { ok: false, reason: "ConsentLens works on normal http and https webpages." };
  }

  try {
    await ensureContentScript(tab.id);
    const response = await chrome.tabs.sendMessage(tab.id, payload);
    return response || { ok: true };
  } catch (error) {
    return { ok: false, reason: "ConsentLens could not access this page: " + (error?.message || String(error)) };
  }
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async (details) => {
  const settings = await getSettings();
  await saveSettings(settings);

  if (details.reason === "install") {
    // Clear first-run flag so the welcome banner shows exactly once.
    await chrome.storage.sync.remove(FIRST_RUN_KEY);
  }
});

// ─── Message router ────────────────────────────────────────────────────────

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
      [UI_STATE_KEY + ":" + sender.tab.id]: message.state
    }).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "GET_PAGE_STATE") {
    getActiveTab().then(async (tab) => {
      if (!tab?.id) {
        sendResponse({ state: null });
        return;
      }
      const key = UI_STATE_KEY + ":" + tab.id;
      const result = await chrome.storage.session.get(key);
      sendResponse({ state: result[key] || null });
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
    relayToActiveTab({ type: "NAVIGATE_MATCH", direction: message.direction }).then(sendResponse);
    return true;
  }

  return false;
});
