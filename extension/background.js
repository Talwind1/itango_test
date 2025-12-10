// background.js (Chrome Extension Service Worker)

const API_ENDPOINT = 'http://localhost/api';
const SECRET_TOKEN = 'j2b3h4g5d_DO_NOT_COMMIT_TOKEN_HACKER_ALERT';

// -----------------------------------------------------------------------
// 1. The extension has been installed\updated.
// -----------------------------------------------------------------------
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        console.log("The extension has been installed successfully...");
        
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        console.log(`The extension has been update from version: ${details.previousVersion}.`);
    }
});

// -----------------------------------------------------------------------
// 2. Startup of the service worker.
// -----------------------------------------------------------------------
chrome.runtime.onStartup.addListener(() => {
    console.log("Service worker started...");
});

setInterval(() => {
    console.log("Service worker is live...")
}, 10000);