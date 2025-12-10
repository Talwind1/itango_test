// extension/popup.js

const API_BASE = 'http://localhost:3000';

// DOM elements
const negativeKeywordsInput = document.getElementById('negative-keywords');
const saveButton = document.getElementById('save-settings-btn');
const searchTermInput = document.getElementById('search-term');
const searchButton = document.getElementById('direct-search-btn');
const statusMessage = document.getElementById('status-message');
const searchEngineSelect = document.getElementById('search-engine'); // מה-HTML החדש

function updateStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? 'red' : 'green';
}

// -------- Initial load of settings from backend --------
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
});

async function loadSettings() {
  try {
    updateStatus('Loading settings...');
    const res = await fetch(`${API_BASE}/api/settings`);
    if (!res.ok) {
      throw new Error(`Failed to load settings (${res.status})`);
    }

    const data = await res.json();

    if (Array.isArray(data.negativeKeywords)) {
      negativeKeywordsInput.value = data.negativeKeywords.join(', ');
    }

    if (typeof data.searchEngine === 'string') {
      searchEngineSelect.value = data.searchEngine;
    }

    updateStatus('');
  } catch (err) {
    console.error('loadSettings error:', err);
    updateStatus('Failed to load settings.', true);
  }
}

// ----------------------------------------------------
// 💡 Requirement 2B: Save Settings – async safety
// ----------------------------------------------------

let saveInFlight = false;

async function handleSaveClick() {
  if (saveInFlight) return; // הגנה כפולה מריצות מקבילות
  saveInFlight = true;

  // disable button while request is in-flight
  saveButton.disabled = true;
  updateStatus('Saving...');

  try {
    const raw = negativeKeywordsInput.value || '';
    const negativeKeywords = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const searchEngine = searchEngineSelect.value;

    const res = await fetch(`${API_BASE}/api/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ negativeKeywords, searchEngine })
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody.error || `Save failed (${res.status})`;
      throw new Error(msg);
    }

    updateStatus('Settings saved ✅');
  } catch (err) {
    console.error('saveSettings error:', err);
    updateStatus(`Error: ${err.message}`, true);
  } finally {
    // ALWAYS re-enable button after success or failure
    saveInFlight = false;
    saveButton.disabled = false;
  }
}

saveButton.addEventListener('click', () => {
  handleSaveClick();
});

// ----------------------------------------------------
// 💡 Direct Search (manual test via backend /search)
// ----------------------------------------------------
searchButton.addEventListener('click', () => {
  const searchTerm = searchTermInput.value.trim();
  if (!searchTerm) {
    updateStatus('Please enter a search term!', true);
    return;
  }

  const searchUrl = `${API_BASE}/search?q=${encodeURIComponent(searchTerm)}`;

  if (window.chrome && chrome.tabs && chrome.tabs.update) {
    // בתוך popup של extension – נעדכן את הטאב הפעיל
    chrome.tabs.update({ url: searchUrl });
    window.close();
  } else {
    // fallback לסביבה רגילה (לא חובה במשימה)
    window.location.href = searchUrl;
  }
});
