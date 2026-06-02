// ==UserScript==
// @name         LinkedIn People Search Page Export
// @namespace    https://needlebit.dev/
// @version      0.1.0
// @description  Exports currently visible LinkedIn people-search result cards to CSV. Does not auto-paginate or send messages.
// @match        https://www.linkedin.com/search/results/people/*
// @match        https://*.linkedin.com/search/results/people/*
// @run-at       document-idle
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "li-people-export-button";
  const STATUS_ID = "li-people-export-status";
  const STYLE_ID = "li-people-export-style";

  const css = `
    #${BUTTON_ID} {
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 2147483647;
      border: 1px solid #4a6682;
      background: #0a66c2;
      color: #fff;
      border-radius: 8px;
      padding: 10px 14px;
      font: 700 14px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
    }
    #${BUTTON_ID}:hover { background: #004182; }
    #${STATUS_ID} {
      position: fixed;
      left: 16px;
      bottom: 56px;
      z-index: 2147483647;
      max-width: 420px;
      background: #101820;
      color: #f3f7fb;
      border: 1px solid #32475c;
      border-radius: 8px;
      padding: 8px 10px;
      font: 12px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      white-space: pre-wrap;
      display: none;
    }
  `;

  function normalizeText(value) {
    return (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function setStatus(text) {
    const node = document.getElementById(STATUS_ID);
    if (!node) return;
    node.textContent = text;
    node.style.display = text ? "block" : "none";
  }

  function profileUrlFromCard(card) {
    const link = [...card.querySelectorAll('a[href*="/in/"]')]
      .map((a) => a.href)
      .find((href) => href && !href.includes("/search/results/"));
    if (!link) return "";
    try {
      const url = new URL(link);
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch {
      return link.split("?")[0];
    }
  }

  function nameFromCard(card) {
    const candidates = [
      card.querySelector('span[aria-hidden="true"]'),
      card.querySelector(".entity-result__title-text a span[aria-hidden='true']"),
      card.querySelector(".entity-result__title-text a"),
    ];
    for (const node of candidates) {
      const text = normalizeText(node?.textContent || "");
      if (text && !/view profile/i.test(text)) return text;
    }
    return "";
  }

  function headlineFromCard(card) {
    const selectors = [
      ".entity-result__primary-subtitle",
      ".entity-result__summary",
      ".reusable-search-simple-insight",
    ];
    const parts = [];
    for (const selector of selectors) {
      const text = normalizeText(card.querySelector(selector)?.textContent || "");
      if (text && !parts.includes(text)) parts.push(text);
    }
    return parts.join(" | ");
  }

  function locationFromCard(card) {
    return normalizeText(card.querySelector(".entity-result__secondary-subtitle")?.textContent || "");
  }

  function currentPageNumber() {
    const active = document.querySelector('[aria-current="page"]');
    return normalizeText(active?.textContent || "");
  }

  function extractCards() {
    const cards = [
      ...document.querySelectorAll(".reusable-search__result-container, .entity-result"),
    ];
    const seen = new Set();
    const rows = [];

    for (const card of cards) {
      const profile_url = profileUrlFromCard(card);
      const full_name = nameFromCard(card);
      if (!profile_url && !full_name) continue;
      const key = profile_url || full_name;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        exported_at: new Date().toISOString(),
        search_page: currentPageNumber(),
        full_name,
        profile_url,
        headline: headlineFromCard(card),
        location: locationFromCard(card),
        raw_text: normalizeText(card.textContent || ""),
      });
    }
    return rows;
  }

  function toCsv(rows) {
    const headers = [
      "exported_at",
      "search_page",
      "full_name",
      "profile_url",
      "headline",
      "location",
      "raw_text",
    ];
    return [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
    ].join("\n");
  }

  function downloadCsv(csv, rows) {
    const page = currentPageNumber() || "unknown";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `linkedin_people_search_page_${page}_${rows.length}_${stamp}.csv`;
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return filename;
  }

  function copyText(text) {
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(text, "text");
      return Promise.resolve();
    }
    return navigator.clipboard.writeText(text);
  }

  async function exportCurrentPage() {
    const rows = extractCards();
    if (!rows.length) {
      setStatus("No visible people-search result cards found. Scroll a bit or wait for LinkedIn to finish loading.");
      return;
    }
    const csv = toCsv(rows);
    await copyText(csv);
    const filename = downloadCsv(csv, rows);
    setStatus(`Exported ${rows.length} visible rows.\nCopied CSV to clipboard.\nDownloaded: ${filename}\nManually click LinkedIn Next, then export again.`);
  }

  function buildButton() {
    if (document.getElementById(BUTTON_ID)) return;
    const status = document.createElement("div");
    status.id = STATUS_ID;
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "Export visible people";
    button.addEventListener("click", () => {
      exportCurrentPage().catch((error) => setStatus(`Export failed: ${error.message}`));
    });
    document.body.appendChild(status);
    document.body.appendChild(button);
  }

  injectStyle();
  buildButton();
})();
