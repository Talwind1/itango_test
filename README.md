# 🚀 Technical Task: Query Rewriter — Architectural & Debugging Challenge

**Time Limit:** Maximum 3 hours

**Core Technologies:** Node.js, Express, Vanilla JavaScript, Chrome API, AI tools (Cursor/Claude Code is allowed).

**Goal:** You have received a codebase that is incomplete, contains operational issues, and has structural flaws. Your goal is to deliver a complete, stable, and secure Full-Stack Query Rewriter system by diagnosing and fixing all underlying problems.

---

## 🎯 Task Requirements: Deliverables

Your task is to ensure the system is fully functional according to the four requirements below.

### 1. Interception and Architectural Choice

The primary function of the system—intercepting the default search query—is **missing**.

* **Requirement:** **Determine** the best architectural mechanism available in the Chrome Extension API (Manifest V3) to intercept the user's default search query and redirect it to our custom backend `backend/server.js`.
* **Justification:** You must explain below why your chosen interception method is superior to others in terms of performance, permissions, or maintainability.

### 2. Operational Stability and Error Handling

The application must handle all client inputs and server processes.

* **Requirement A (Backend Stability):** The `GET /search` route in `backend/server.js` **should handle missing input** properly. Make sure you use the right status codes, and catch all errors.
* **Requirement B (FE Stability):** The "Save Settings" button logic in `extension/popup.js` **must be protected against asynchronous failures**. You must implement the necessary logic to manage the saving process, ensuring the button is disabled and properly re-enabled only after the network request is fully complete (success or failure).

### 3. Business Logic Implementation

* **Requirement:** Complete the core logic within the `backend/server.js` `/search` route. The system must:
    1.  **Remove** any keywords from the incoming query that are present in the `userSettings.negativeKeywords` list.
    2.  **Add** logic within the `backend/server.js` `/search` route, `extension/popup.html` and `extension/popup.js` that will give the user the ability to choose a search engine from a dropdown list.
    3.  Perform an **HTTP 302 Redirect** with the processed query.

---


1. I initiated package.json with npm, I installed express so app can run with command: 
node server.js

2. 

## 🗒️ Justification Section (Please complete below)

### Justification for Interception Architecture (Requirement 1)

[... Your reasoning goes here ...]

### A full decision tree - describe what were your dilemmas and explain your choices.

[... Your decision tree goes here ...]


cd backend
npm install
