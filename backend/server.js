// backend/server.js (Node.js/Express)
const express = require('express');
const app = express();

// חשוב: שיהיה אותו פורט כמו ב-manifest.json
const PORT = 3000;

app.use(express.json());

// -------- In-memory settings (simplified for this task) --------
let userSettings = {
  negativeKeywords: ['jobs', 'resume', 'careers'],
  searchEngine: 'google' // default engine
};

const ALLOWED_ENGINES = ['google', 'bing', 'duckduckgo'];

const ENGINE_BASE_URLS = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q='
};

// -------- Settings API for the extension UI (GET/POST) --------

// This route is for the extension UI (load settings)
app.get('/api/settings', (req, res) => {
  try {
    return res.status(200).json(userSettings);
  } catch (err) {
    console.error('GET /api/settings error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// This route is for the extension functionality for updating the userSettings.
app.post('/api/settings', (req, res) => {
  try {
    const { negativeKeywords, searchEngine } = req.body || {};

    // Validate negativeKeywords, if provided
    if (negativeKeywords !== undefined && !Array.isArray(negativeKeywords)) {
      return res
        .status(400)
        .json({ error: 'negativeKeywords must be an array of strings' });
    }

    // Validate searchEngine, if provided
    if (searchEngine !== undefined && !ALLOWED_ENGINES.includes(searchEngine)) {
      return res
        .status(400)
        .json({ error: 'Unsupported search engine' });
    }

    // Merge settings safely
    if (Array.isArray(negativeKeywords)) {
      userSettings.negativeKeywords = negativeKeywords;
    }

    if (typeof searchEngine === 'string') {
      userSettings.searchEngine = searchEngine;
    }

    console.log('Settings updated:', userSettings);
    return res.status(200).json({ status: 'ok', settings: userSettings });
  } catch (err) {
    console.error('POST /api/settings error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// -------- Search route (called from the browser as default search provider) --------

app.get('/search', (req, res) => {
  try {
    const originalQuery = req.query.q;

    // Requirement 2A: handle missing input with correct status code
    if (typeof originalQuery !== 'string' || originalQuery.trim() === '') {
      return res
        .status(400)
        .json({ error: 'Missing or empty "q" query parameter' });
    }

    const query = originalQuery.trim();

    // Requirement 3.1: remove any negative keywords from the query
    const negative = Array.isArray(userSettings.negativeKeywords)
      ? userSettings.negativeKeywords
      : [];

    const negativeSet = new Set(
      negative.map((word) => word.toLowerCase())
    );

    const filteredTokens = query
      .split(/\s+/)
      .filter((token) => !negativeSet.has(token.toLowerCase()));

    const processedQuery = filteredTokens.join(' ');

    // If everything was removed, fall back to original query
    const finalQuery = processedQuery || query;

    // Requirement 3.2: choose search engine based on userSettings
    const engine = ALLOWED_ENGINES.includes(userSettings.searchEngine)
      ? userSettings.searchEngine
      : 'google';

    const baseUrl = ENGINE_BASE_URLS[engine];
    const finalUrl = baseUrl + encodeURIComponent(finalQuery);

    console.log(`Redirecting query '${originalQuery}' -> [${engine}] ${finalUrl}`);

    // Requirement 3.3: HTTP 302 Redirect with processed query
    return res.redirect(302, finalUrl);
  } catch (err) {
    console.error('GET /search error:', err);
    // Requirement 2A: catch all errors and respond with 500
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js Backend listening on http://localhost:${PORT}`);
});
