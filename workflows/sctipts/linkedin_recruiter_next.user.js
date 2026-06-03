// ==UserScript==
// @name         LinkedIn Recruiter Outreach Next
// @namespace    https://needlebit.dev/
// @version      0.3.0
// @description  Manual LinkedIn outreach panel: get next queued recruiter, copy draft, mark sent. Does not send messages automatically.
// @match        https://www.linkedin.com/*
// @match        https://*.linkedin.com/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// ==/UserScript==

(function () {
  "use strict";

  const API = "http://127.0.0.1:8765";
  const STYLE_ID = "li-recruiter-next-style";
  const PANEL_ID = "li-recruiter-next-panel";

  let currentContact = null;

  const css = `
    #${PANEL_ID} {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      width: 360px;
      max-width: calc(100vw - 32px);
      background: #101820;
      color: #f3f7fb;
      border: 1px solid #32475c;
      border-radius: 8px;
      box-shadow: 0 16px 40px rgba(0,0,0,.35);
      font: 13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 12px;
    }
    #${PANEL_ID} * { box-sizing: border-box; }
    #${PANEL_ID} .liro-title {
      font-weight: 700;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    #${PANEL_ID} .liro-contact {
      color: #d9e7f5;
      white-space: pre-wrap;
      max-height: 92px;
      overflow: auto;
      margin: 8px 0;
      border-top: 1px solid #26394c;
      border-bottom: 1px solid #26394c;
      padding: 8px 0;
    }
    #${PANEL_ID} .liro-api-status {
      border: 1px solid #26394c;
      background: #0b1118;
      color: #d9e7f5;
      border-radius: 6px;
      padding: 7px 8px;
      margin-bottom: 8px;
      font-weight: 650;
    }
    #${PANEL_ID} textarea {
      width: 100%;
      height: 160px;
      resize: vertical;
      border-radius: 6px;
      border: 1px solid #425b73;
      background: #0b1118;
      color: #f3f7fb;
      padding: 8px;
      font: 12px/1.35 ui-monospace, SFMono-Regular, Consolas, monospace;
    }
    #${PANEL_ID} .liro-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    #${PANEL_ID} button {
      border: 1px solid #4a6682;
      background: #182838;
      color: #eef6ff;
      border-radius: 6px;
      padding: 7px 9px;
      cursor: pointer;
      font-weight: 650;
    }
    #${PANEL_ID} button:hover { background: #22384e; }
    #${PANEL_ID} button[data-main="true"] {
      background: #0a66c2;
      border-color: #0a66c2;
    }
    #${PANEL_ID} button[data-danger="true"] {
      background: #5a2630;
      border-color: #8a3b48;
    }
    #${PANEL_ID} .liro-status {
      color: #9fb4c8;
      margin-top: 8px;
      min-height: 18px;
    }
    #${PANEL_ID}.collapsed {
      width: auto;
    }
    #${PANEL_ID}.collapsed .liro-body {
      display: none;
    }
  `;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function setStatus(text) {
    const node = document.querySelector(`#${PANEL_ID} .liro-status`);
    if (node) node.textContent = text || "";
  }

  function api(path, options = {}) {
    const url = `${API}${path}`;
    const method = options.method || "GET";
    const body = options.body || undefined;

    async function fetchApi() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body,
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }
        return data;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") {
        fetchApi().then(resolve, reject);
        return;
      }
      GM_xmlhttpRequest({
        method,
        url,
        headers: { "Content-Type": "application/json" },
        data: body,
        timeout: 7000,
        onload: (response) => {
          let data = {};
          try {
            data = JSON.parse(response.responseText || "{}");
          } catch (error) {
            reject(new Error(`Invalid JSON from local server: ${error.message}`));
            return;
          }
          if (response.status < 200 || response.status >= 300 || !data.ok) {
            reject(new Error(data.error || `HTTP ${response.status}`));
            return;
          }
          resolve(data);
        },
        onerror: () => {
          fetchApi().then(resolve, () => reject(new Error("Local server request failed")));
        },
        ontimeout: () => {
          fetchApi().then(resolve, () => reject(new Error("Local server request timed out")));
        },
      });
    });
  }

  function copyText(text) {
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(text, "text");
      return Promise.resolve();
    }
    return navigator.clipboard.writeText(text);
  }

  function setApiStatus(text, available = null) {
    const node = document.querySelector(`#${PANEL_ID} .liro-api-status`);
    if (!node) return;
    node.textContent = text;
    if (available === true) {
      node.style.borderColor = "#266b45";
      node.style.color = "#c7f2d4";
    } else if (available === false) {
      node.style.borderColor = "#8a3b48";
      node.style.color = "#ffd0d6";
    } else {
      node.style.borderColor = "#425b73";
      node.style.color = "#d9e7f5";
    }
  }

  function renderContact(contact) {
    currentContact = contact;
    const info = [
      `[${contact.id}] ${contact.full_name || ""}`,
      contact.position || "",
      contact.company || "",
      contact.profile_url || "",
    ].filter(Boolean).join("\n");
    document.querySelector(`#${PANEL_ID} .liro-contact`).textContent = info || "No contact loaded";
    document.querySelector(`#${PANEL_ID} textarea`).value = contact.message || "";
  }

  async function loadNext() {
    setStatus("Loading next queued contact...");
    const data = await api("/next");
    renderContact(data.contact);
    await copyText(data.contact.message || "");
    setStatus("Loaded and copied. Open the message box manually, paste, send, then press Mark sent.");
    if (data.contact.profile_url) {
      window.location.href = data.contact.profile_url;
    }
  }

  async function copyCurrent() {
    const text = document.querySelector(`#${PANEL_ID} textarea`).value;
    await copyText(text);
    setStatus("Message copied.");
  }

  async function mark(status) {
    if (!currentContact?.id) {
      setStatus("No loaded contact.");
      return;
    }
    await api("/mark", {
      method: "POST",
      body: JSON.stringify({
        id: currentContact.id,
        status,
        notes: status === "sent" ? "Marked from LinkedIn userscript after manual send" : "Marked from LinkedIn userscript",
      }),
    });
    setStatus(`Marked ${currentContact.full_name} as ${status}.`);
    await refreshStats();
  }

  async function markSentAndNext() {
    await mark("sent");
    await loadNext();
  }

  async function refreshStats() {
    setApiStatus("Checking API...", null);
    const data = await api("/stats");
    const stats = data.stats || {};
    const queued = stats.queued || 0;
    const opened = stats.opened || 0;
    const total = stats.recruiting_contacts || 0;
    setApiStatus(`API available. Contacts to outreach: ${queued} remain / ${total} all.`, true);
    setStatus(`queued=${queued}, opened=${opened}, sent=${stats.sent || 0}, replied=${stats.replied || 0}, skipped=${stats.skipped_non_recruiting || 0}`);
  }

  function buildPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="liro-title">
        <span>Recruiter Outreach</span>
        <button type="button" data-action="toggle">_</button>
      </div>
      <div class="liro-body">
        <div class="liro-api-status">Checking API...</div>
        <div class="liro-contact">No contact loaded</div>
        <textarea spellcheck="false" placeholder="Message draft will appear here"></textarea>
        <div class="liro-row">
          <button type="button" data-action="next" data-main="true">Next</button>
          <button type="button" data-action="copy">Copy</button>
          <button type="button" data-action="sent">Mark sent</button>
          <button type="button" data-action="sent-next" data-main="true">Sent + Next</button>
          <button type="button" data-action="skip">Skip</button>
          <button type="button" data-action="stats">Stats</button>
        </div>
        <div class="liro-status"></div>
      </div>
    `;
    document.body.appendChild(panel);
    setApiStatus("Checking API...", null);
    panel.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      try {
        if (action === "toggle") panel.classList.toggle("collapsed");
        if (action === "next") await loadNext();
        if (action === "copy") await copyCurrent();
        if (action === "sent") await mark("sent");
        if (action === "sent-next") await markSentAndNext();
        if (action === "skip") await mark("opened");
        if (action === "stats") await refreshStats();
      } catch (error) {
        if (error.message === "no_queued_contacts") {
          setStatus("No queued contacts. Import LinkedIn Connections CSV first, or check that recruiter contacts were matched.");
        } else {
          setStatus(`Error: ${error.message}. Is local server running?`);
        }
      }
    });
    refreshStats().catch((error) => {
      setApiStatus("API unavailable. Start local server on 127.0.0.1:8765.", false);
      setStatus(`Server not ready: ${error.message}`);
    });

    setTimeout(() => {
      const node = document.querySelector(`#${PANEL_ID} .liro-api-status`);
      if (node?.textContent === "Checking API...") {
        setApiStatus("API check is still pending. Click Stats or reload this LinkedIn tab.", false);
      }
    }, 9000);
  }

  injectStyle();
  buildPanel();
})();
