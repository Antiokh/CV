// ==UserScript==
// @name         LinkedIn People Search Page Export
// @namespace    https://needlebit.dev/
// @version      0.3.0
// @description  Exports currently visible LinkedIn people-search result cards to CSV, then advances one page after the user clicks export. Does not send messages.
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

  function cleanProfileUrl(linkOrHref) {
    const link = typeof linkOrHref === "string" ? linkOrHref : linkOrHref?.href;
    try {
      const url = new URL(link);
      if (!url.pathname.startsWith("/in/")) return "";
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch {
      return (link || "").split("?")[0];
    }
  }

  function isProfileHref(href) {
    try {
      return new URL(href, location.href).pathname.startsWith("/in/");
    } catch {
      return false;
    }
  }

  function profileUrlFromCard(card) {
    const link = [...card.querySelectorAll('a[href*="/in/"]')]
      .find((a) => isProfileHref(a.href));
    return cleanProfileUrl(link);
  }

  function candidateCards() {
    const root = document.querySelector("main") || document.querySelector('section[aria-label="Primary content"]') || document.body;
    const cards = [
      ...root.querySelectorAll('[role="listitem"], .reusable-search__result-container, .entity-result'),
    ].filter((card) => card.querySelector('a[href*="/in/"]'));

    if (cards.length) return cards;

    const byAncestor = new Map();
    for (const link of root.querySelectorAll('a[href*="/in/"]')) {
      if (!isProfileHref(link.href)) continue;
      let node = link;
      for (let i = 0; i < 8 && node?.parentElement; i += 1) {
        node = node.parentElement;
        if (normalizeText(node.textContent || "").length > 120) break;
      }
      if (node) byAncestor.set(node, node);
    }
    return [...byAncestor.values()];
  }

  function cleanNameText(text) {
    return normalizeText(text)
      .replace(/\s*•\s*1st\b/i, "")
      .replace(/\bVerified\b/gi, "")
      .replace(/\bMessage\b/gi, "")
      .trim();
  }

  function nameFromCard(card, profileUrl) {
    const sameProfileLinks = [...card.querySelectorAll('a[href*="/in/"]')]
      .filter((a) => cleanProfileUrl(a) === profileUrl);

    const linkTexts = sameProfileLinks
      .map((a) => cleanNameText(a.textContent || ""))
      .filter((text) => text && text.length <= 90 && !/followers|connections|search results/i.test(text));

    if (linkTexts.length) {
      return linkTexts.sort((a, b) => a.length - b.length)[0];
    }

    const imageAlt = cleanNameText(card.querySelector("img[alt]")?.getAttribute("alt") || "");
    if (imageAlt) return imageAlt;

    const labelledName = cleanNameText(card.querySelector("[aria-labelledby]")?.textContent || "");
    if (labelledName && labelledName.length <= 90) return labelledName;

    return "";
  }

  function textLinesFromCard(card) {
    const ignored = /^(message|follow|connect|previous|next|are these results helpful|\d+|page \d+)$/i;
    const lines = normalizeText(card.textContent || "")
      .split(/(?=Product |Senior |Software |Head |HR |Recruiter |Talent |Belgrade|Serbia|Novi Sad|Remote)|\n/)
      .map((line) => normalizeText(line))
      .filter(Boolean)
      .filter((line) => !ignored.test(line))
      .filter((line) => !/mutual connections|followers|send a message|shared connections/i.test(line));

    return [...new Set(lines)];
  }

  function profileTextFacts(card, fullName) {
    const facts = [];
    const textNodes = [
      ...card.querySelectorAll("p, span, div"),
    ];

    for (const node of textNodes) {
      const text = normalizeText(node.textContent || "");
      if (!text || text.length > 180) continue;
      if (text === fullName || text.includes("• 1st")) continue;
      if (/^(Message|Verified|Follow|Connect)$/i.test(text)) continue;
      if (/mutual connections|followers|send a message|are these results helpful/i.test(text)) continue;
      if (!facts.includes(text)) facts.push(text);
    }

    if (facts.length) return facts;
    return textLinesFromCard(card).filter((line) => line !== fullName);
  }

  function headlineFromCard(card, fullName) {
    const selectors = [
      ".entity-result__primary-subtitle",
      ".entity-result__summary",
      ".reusable-search-simple-insight",
    ];
    for (const selector of selectors) {
      const text = normalizeText(card.querySelector(selector)?.textContent || "");
      if (text) return text;
    }

    const facts = profileTextFacts(card, fullName);
    return facts.find((line) => !looksLikeLocation(line)) || "";
  }

  function looksLikeLocation(text) {
    return /\b(serbia|belgrade|beograd|novi sad|vojvodina|remote|hybrid|russia|moscow|saint petersburg|european union|united states|united kingdom)\b/i.test(text);
  }

  function locationFromCard(card, fullName) {
    const oldLinkedInLocation = normalizeText(card.querySelector(".entity-result__secondary-subtitle")?.textContent || "");
    if (oldLinkedInLocation) return oldLinkedInLocation;

    const facts = profileTextFacts(card, fullName);
    return facts.find(looksLikeLocation) || "";
  }

  function currentPageNumber() {
    const active = document.querySelector('[aria-current="page"], [aria-current="true"]');
    return normalizeText(active?.textContent || "");
  }

  function findNextButton() {
    const selectors = [
      '[data-testid="pagination-controls-next-button-visible"]',
      'button[aria-label="Next"]',
      'button[aria-label*="Next"]',
    ];
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && !button.disabled && button.getAttribute("aria-disabled") !== "true") return button;
    }
    return [...document.querySelectorAll("button")]
      .find((button) => normalizeText(button.textContent || "") === "Next" && !button.disabled);
  }

  function extractCards() {
    const cards = candidateCards();
    const seen = new Set();
    const rows = [];

    for (const card of cards) {
      const profile_url = profileUrlFromCard(card);
      const full_name = nameFromCard(card, profile_url);
      if (!profile_url && !full_name) continue;
      const key = profile_url || full_name;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        exported_at: new Date().toISOString(),
        search_page: currentPageNumber(),
        full_name,
        profile_url,
        headline: headlineFromCard(card, full_name),
        location: locationFromCard(card, full_name),
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
      const profileLinks = document.querySelectorAll('main a[href*="/in/"], section[aria-label="Primary content"] a[href*="/in/"]').length;
      setStatus(`No visible people-search result cards found.\nProfile links seen in page body: ${profileLinks}.\nScroll a bit, wait for LinkedIn to finish loading, or send me a fresh HTML anchor sample.`);
      return;
    }
    const csv = toCsv(rows);
    await copyText(csv);
    const filename = downloadCsv(csv, rows);
    const nextButton = findNextButton();
    if (nextButton) {
      setStatus(`Exported ${rows.length} visible rows.\nCopied CSV to clipboard.\nDownloaded: ${filename}\nClicking LinkedIn Next...`);
      setTimeout(() => nextButton.click(), 350);
    } else {
      setStatus(`Exported ${rows.length} visible rows.\nCopied CSV to clipboard.\nDownloaded: ${filename}\nLinkedIn Next button was not found.`);
    }
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
