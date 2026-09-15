// ==UserScript==
// @name         HH.ru Dark Theme + Vacancy Copy
// @namespace    https://needlebit.dev/
// @version      0.1.1
// @description  Early dark theme for hh.ru vacancy pages plus a copy button that exports clean vacancy details.
// @match        https://hh.ru/vacancy/*
// @match        https://*.hh.ru/vacancy/*
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  const STYLE_ID = "hh-dark-copy-theme";
  const BUTTON_CLASS = "hh-dark-copy-button";
  const BUTTON_ATTR = "data-hh-copy-button";

  const THEME_CSS = `
    :root {
      color-scheme: dark !important;
      --hh-bg: #0b1016 !important;
      --hh-bg-elevated: #111823 !important;
      --hh-bg-soft: #17212d !important;
      --hh-border: #263445 !important;
      --hh-border-strong: #33465d !important;
      --hh-text: #e7edf5 !important;
      --hh-text-soft: #b6c3d1 !important;
      --hh-link: #7dc4ff !important;
      --hh-accent: #ff5b57 !important;
      --hh-accent-hover: #ff7470 !important;
      --hh-success: #32d296 !important;
      --hh-shadow: 0 10px 35px rgba(0, 0, 0, 0.35) !important;
    }

    html, body {
      background: var(--hh-bg) !important;
      color: var(--hh-text) !important;
    }

    html {
      background-color: var(--hh-bg) !important;
    }

    body {
      background-color: var(--hh-bg) !important;
      background-image: none !important;
      min-height: 100vh !important;
    }

    html, body, #HH-React-Root, #HH-React-Root > div, #HH-React-Root > div > div,
    .app, .application, .page, .page-content, .bloko-columns-wrapper, .bloko-column_container,
    .supernova-wrapper, .supernova-footer-wrapper, .footer-wrapper {
      background: var(--hh-bg) !important;
    }

    body, div, section, article, aside, main, header, footer, nav, form,
    .bloko-columns-wrapper, .bloko-column, .row-content, .vacancy-description,
    .vacancy-section, .vacancy-company, .vacancy-actions, .vacancy-title,
    .magritte-card___bhGKz_8-5-3, .magritte-grid-row___3Zugo_3-0-3,
    [data-qa="lux-container"], [data-qa="HH-VacancyResponsePopup"], #HH-React-Root,
    .supernova-footer-wrapper, .supernova-footer, .footer-counters {
      background-color: transparent !important;
      color: var(--hh-text) !important;
    }

    body, .supernova-navi-wrapper, .supernova-navi, .supernova-footer,
    .magritte-card___bhGKz_8-5-3, .vacancy-description-list-item, .bloko-modal,
    .bloko-drop, .magritte-popover___7uDuu_2-1-15, .magritte-dropdown___RrRRe_2-1-15,
    [class*="card"], [class*="Card"], [class*="panel"], [class*="wrapper"],
    [class*="footer"], [class*="Footer"], [class*="columns"], [class*="grid"] {
      background-color: var(--hh-bg) !important;
      background-image: none !important;
      border-color: var(--hh-border) !important;
    }

    .supernova-navi-wrapper,
    .supernova-navi,
    .magritte-card___bhGKz_8-5-3,
    .bloko-modal,
    .bloko-drop,
    .vacancy-company,
    [data-qa="vacancy-company__details"],
    [data-qa="cookies-policy-informer"] {
      background: var(--hh-bg-elevated) !important;
      box-shadow: var(--hh-shadow) !important;
      border-color: var(--hh-border) !important;
    }

    h1, h2, h3, h4, h5, h6,
    p, span, li, dt, dd, strong, b,
    .bloko-header-1, .bloko-header-2, .bloko-header-3, .bloko-header-section-1,
    .bloko-text, .magritte-text___pbpft_5-2-0, .magritte-text___gMq2l_8-0-3 {
      color: var(--hh-text) !important;
    }

    .magritte-text_style-secondary___1IU11_5-2-0,
    .bloko-text_tertiary,
    [class*="secondary"],
    [class*="subtitle"],
    [class*="caption"] {
      color: var(--hh-text-soft) !important;
    }

    a, .bloko-link, .magritte-link___b4rEM_7-1-18 {
      color: var(--hh-link) !important;
    }

    svg, path {
      color: inherit !important;
    }

    .bloko-button, .magritte-button___Pubhr_7-2-2, button {
      border-color: var(--hh-border-strong) !important;
    }

    .magritte-button___Pubhr_7-2-2,
    .bloko-button,
    button {
      color: var(--hh-text) !important;
      border-radius: 10px !important;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, box-shadow 120ms ease !important;
    }

    .magritte-button___Pubhr_7-2-2 .magritte-button-view___53Slm_7-2-2,
    .bloko-button {
      border-radius: 10px !important;
      min-height: 40px !important;
      transition: inherit !important;
    }

    .magritte-button___Pubhr_7-2-2 .magritte-button__content___BXYU0_7-2-2 {
      min-height: 40px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .magritte-button_mode-secondary___xYz4-_7-2-2,
    .magritte-button_mode-tertiary___ZMpad_7-2-2,
    .magritte-button_style-neutral___I5qS5_7-2-2,
    .bloko-button_kind-secondary,
    .bloko-button_kind-tertiary,
    .bloko-button_kind-primary-secondary {
      background: var(--hh-bg-soft) !important;
      color: var(--hh-text) !important;
      border-color: var(--hh-border-strong) !important;
    }

    .magritte-button_mode-secondary___xYz4-_7-2-2 .magritte-button-view___53Slm_7-2-2,
    .magritte-button_mode-tertiary___ZMpad_7-2-2 .magritte-button-view___53Slm_7-2-2,
    .magritte-button_style-neutral___I5qS5_7-2-2 .magritte-button-view___53Slm_7-2-2,
    .bloko-button_kind-secondary,
    .bloko-button_kind-tertiary {
      background: var(--hh-bg-soft) !important;
      color: var(--hh-text) !important;
      border-color: var(--hh-border-strong) !important;
    }

    .magritte-button_mode-secondary___xYz4-_7-2-2:hover,
    .magritte-button_mode-tertiary___ZMpad_7-2-2:hover,
    .magritte-button_style-neutral___I5qS5_7-2-2:hover,
    .bloko-button_kind-secondary:hover,
    .bloko-button_kind-tertiary:hover,
    .bloko-button_kind-primary-secondary:hover {
      background: #203043 !important;
      color: var(--hh-text) !important;
      border-color: #466281 !important;
    }

    .magritte-button___Pubhr_7-2-2:active,
    .bloko-button:active,
    button:active,
    .magritte-button___Pubhr_7-2-2[aria-pressed="true"] {
      transform: translateY(1px) !important;
    }

    .magritte-button_mode-secondary___xYz4-_7-2-2:hover .magritte-button-view___53Slm_7-2-2,
    .magritte-button_mode-tertiary___ZMpad_7-2-2:hover .magritte-button-view___53Slm_7-2-2,
    .magritte-button_style-neutral___I5qS5_7-2-2:hover .magritte-button-view___53Slm_7-2-2 {
      background: #203043 !important;
      color: var(--hh-text) !important;
      border-color: #466281 !important;
    }

    .magritte-button_mode-primary___wU8PN_7-2-2,
    .bloko-button_kind-primary,
    [data-qa="vacancy-response-link-top"] {
      background: var(--hh-accent) !important;
      border-color: var(--hh-accent) !important;
      color: #fff !important;
    }

    .magritte-button_mode-primary___wU8PN_7-2-2 .magritte-button-view___53Slm_7-2-2,
    [data-qa="vacancy-response-link-top"] .magritte-button-view___53Slm_7-2-2 {
      background: var(--hh-accent) !important;
      color: #fff !important;
      border-color: var(--hh-accent) !important;
    }

    .magritte-button_mode-primary___wU8PN_7-2-2:hover,
    .bloko-button_kind-primary:hover,
    [data-qa="vacancy-response-link-top"]:hover {
      background: var(--hh-accent-hover) !important;
      border-color: var(--hh-accent-hover) !important;
      color: #fff !important;
    }

    .magritte-button_mode-primary___wU8PN_7-2-2:hover .magritte-button-view___53Slm_7-2-2,
    [data-qa="vacancy-response-link-top"]:hover .magritte-button-view___53Slm_7-2-2 {
      background: var(--hh-accent-hover) !important;
      color: #fff !important;
      border-color: var(--hh-accent-hover) !important;
    }

    .magritte-button__label___zplmt_7-2-2,
    .magritte-text___tkzIl_7-1-18,
    .bloko-button span,
    button span {
      color: inherit !important;
    }

    .magritte-button__content___BXYU0_7-2-2,
    .magritte-button__label___zplmt_7-2-2,
    .magritte-button__icon___912gw_7-2-2,
    .magritte-icon___rRr4Q_14-2-1 {
      color: inherit !important;
      fill: currentColor !important;
    }

    input, textarea, select, [contenteditable="true"] {
      background: var(--hh-bg-soft) !important;
      color: var(--hh-text) !important;
      border-color: var(--hh-border-strong) !important;
    }

    .bloko-tag, .magritte-tag___WdGxk_5-3-0, .vacancy-skill-list-item--PumrWcVEn0Syd8vd {
      background: var(--hh-bg-soft) !important;
      border-color: var(--hh-border-strong) !important;
      color: var(--hh-text) !important;
    }

    .bloko-divider, hr, [class*="separator"], [class*="divider"] {
      border-color: var(--hh-border) !important;
      background-color: var(--hh-border) !important;
    }

    body::before,
    body::after,
    html::before,
    html::after {
      background: transparent !important;
    }

    .${BUTTON_CLASS} {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 40px !important;
      padding: 0 16px !important;
      margin-left: 12px !important;
      border-radius: 10px !important;
      border: 1px solid var(--hh-border-strong) !important;
      background: var(--hh-bg-soft) !important;
      color: var(--hh-text) !important;
      font: 600 14px/1.1 system-ui, sans-serif !important;
      cursor: pointer !important;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease !important;
      box-shadow: var(--hh-shadow) !important;
      white-space: nowrap !important;
      flex: 0 0 auto !important;
      position: relative !important;
      z-index: 3 !important;
    }

    .${BUTTON_CLASS}:active {
      transform: translateY(1px) !important;
    }

    .${BUTTON_CLASS}:hover {
      background: #203043 !important;
      border-color: #466281 !important;
    }

    .${BUTTON_CLASS}[data-state="success"] {
      color: #06120d !important;
      background: var(--hh-success) !important;
      border-color: var(--hh-success) !important;
    }

    .hh-dark-copy-row {
      display: flex !important;
      align-items: stretch !important;
      gap: 12px !important;
      width: 100% !important;
    }

    .hh-dark-copy-row > [data-qa="vacancy-response-link-top"] {
      flex: 1 1 auto !important;
      min-width: 0 !important;
    }

    .hh-dark-copy-row > .${BUTTON_CLASS} {
      margin-left: 0 !important;
    }

    .hh-dark-copy-watchers {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
      width: 100% !important;
    }

    .hh-dark-copy-watchers > .noprint,
    .hh-dark-copy-watchers > p,
    .hh-dark-copy-watchers > div:first-child {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      margin: 0 !important;
    }
  `;

  function applyPrepaintTheme() {
    const root = document.documentElement;
    if (!root) {
      return;
    }

    root.style.backgroundColor = "#0b1016";
    root.style.colorScheme = "dark";

    if (document.body) {
      document.body.style.backgroundColor = "#0b1016";
      document.body.style.color = "#e7edf5";
      document.body.style.backgroundImage = "none";
    }
  }

  function injectTheme() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    if (typeof GM_addStyle === "function") {
      GM_addStyle(THEME_CSS);
      const style = Array.from(document.querySelectorAll("style")).find((node) => node.textContent === THEME_CSS);
      if (style) {
        style.id = STYLE_ID;
      }
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = THEME_CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function textOf(selector, root = document) {
    const node = root.querySelector(selector);
    return normalizeText(node ? node.textContent : "");
  }

  function textAfterLabel(selector, label, root = document) {
    const value = textOf(selector, root);
    if (!value) {
      return "";
    }

    const normalizedLabel = normalizeText(label).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return normalizeText(value.replace(new RegExp(`^${normalizedLabel}\\s*:?\\s*`, "i"), ""));
  }

  function normalizeText(value) {
    return (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function linesFromNode(node, depth = 0) {
    if (!node) {
      return [];
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = normalizeText(node.textContent);
      return text ? [text] : [];
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return [];
    }

    const tag = node.tagName.toLowerCase();
    if (["script", "style", "noscript", "svg", "button"].includes(tag)) {
      return [];
    }

    if (tag === "br") {
      return [""];
    }

    if (tag === "ul" || tag === "ol") {
      return Array.from(node.children)
        .filter((child) => child.tagName && child.tagName.toLowerCase() === "li")
        .flatMap((child) => linesFromNode(child, depth + 1));
    }

    if (tag === "li") {
      const content = normalizeText(linesFromChildren(node, depth + 1).join(" "));
      return content ? [`${"  ".repeat(Math.max(0, depth - 1))}- ${content}`] : [];
    }

    if (/^h[1-6]$/.test(tag)) {
      const content = normalizeText(linesFromChildren(node, depth).join(" "));
      return content ? [content.toUpperCase(), ""] : [];
    }

    if (tag === "p") {
      const content = normalizeText(linesFromChildren(node, depth).join(" "));
      return content ? [content, ""] : [];
    }

    if (tag === "div" || tag === "section" || tag === "article") {
      const parts = linesFromChildren(node, depth);
      if (node.closest("[data-qa='vacancy-description']") === node && parts.length) {
        return [...parts, ""];
      }
      return parts;
    }

    return linesFromChildren(node, depth);
  }

  function linesFromChildren(node, depth = 0) {
    return Array.from(node.childNodes).flatMap((child) => linesFromNode(child, depth));
  }

  function descriptionToText(root) {
    const lines = linesFromNode(root)
      .map((line) => normalizeText(line))
      .filter((line, index, arr) => line || (arr[index - 1] && arr[index + 1]));
    const merged = [];

    for (const line of lines) {
      const previous = merged[merged.length - 1] || "";
      const isHeading = line && line === line.toUpperCase() && !line.startsWith("- ");
      const previousIsList = previous.startsWith("- ");

      if (isHeading && merged.length && previous) {
        merged.push("");
      }

      if (line.startsWith("- ") && previousIsList) {
        merged.push(line);
        continue;
      }

      if (!line && previous === "") {
        continue;
      }

      merged.push(line);
    }

    return normalizeText(merged.join("\n"));
  }

  function extractLdJson() {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));

    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent || "{}");
        if (data && data["@type"] === "JobPosting") {
          return data;
        }
      } catch (error) {
        // ignore malformed JSON blocks
      }
    }

    return null;
  }

  function collectVacancyData() {
    const ld = extractLdJson();
    const descriptionRoot = document.querySelector('[data-qa="vacancy-description"]');
    const skillNodes = Array.from(document.querySelectorAll('[data-qa="skills-element"]'));

    const title = textOf('[data-qa="vacancy-title"]') || normalizeText(ld?.title || "");
    const company = textOf('[data-qa="vacancy-company-name"]') || normalizeText(ld?.hiringOrganization?.name || "");
    const salary = textOf('[data-qa="vacancy-salary"]');
    const experience = textOf('[data-qa="vacancy-experience"]');
    const employment = textOf('[data-qa="common-employment-text"]');
    const hiringFormats = textAfterLabel('[data-qa="vacancy-hiring-formats"]', "Оформление");
    const schedule = textAfterLabel('[data-qa="work-schedule-by-days-text"]', "График");
    const workHours = textAfterLabel('[data-qa="working-hours-text"]', "Рабочие часы");
    const workplace = textAfterLabel('[data-qa="work-place-text"]', "Формат работы");
    const vacancyLocation = normalizeText(
      ld?.jobLocation?.address?.addressLocality ||
      ld?.jobLocation?.address?.addressRegion ||
      ""
    );
    const applicantLocation = normalizeText(ld?.applicantLocationRequirements?.name || "");
    const skills = skillNodes
      .map((node) => normalizeText(node.textContent))
      .filter(Boolean);
    const description = descriptionRoot ? descriptionToText(descriptionRoot) : normalizeText(ld?.description || "");

    return {
      title,
      company,
      salary,
      experience,
      employment,
      hiringFormats,
      schedule,
      workHours,
      workplace,
      location: vacancyLocation,
      applicantLocation,
      skills,
      description,
      url: window.location?.href || document.location?.href || "",
    };
  }

  function buildClipboardText(data) {
    const lines = [
      "## Job",
      "### Title",
      data.title || "-",
      "### Company",
      data.company || "-",
      "### URL",
      data.url || "-",
      "",
      "## Job Details",
    ];

    const details = [
      ["Salary", data.salary],
      ["Experience", data.experience],
      ["Employment", data.employment],
      ["Contract Type", data.hiringFormats],
      ["Schedule", data.schedule],
      ["Working Hours", data.workHours],
      ["Workplace", data.workplace],
      ["Location", data.location],
      ["Candidate Geography", data.applicantLocation],
    ];

    for (const [label, value] of details) {
      if (!value) {
        continue;
      }
      lines.push(`### ${label}`);
      lines.push(value);
    }

    if (data.skills.length) {
      lines.push("", "## Skills");
      for (const skill of data.skills) {
        lines.push(`- ${skill}`);
      }
    }

    if (data.description) {
      lines.push("", "## Job Description", data.description);
    }

    return normalizeText(lines.join("\n"));
  }

  async function copyToClipboard(text) {
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(text, "text");
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function setButtonState(button, label, state = "") {
    button.textContent = label;
    if (state) {
      button.setAttribute("data-state", state);
    } else {
      button.removeAttribute("data-state");
    }
  }

  async function handleCopy(button) {
    try {
      const text = buildClipboardText(collectVacancyData());
      await copyToClipboard(text);
      setButtonState(button, "Скопировано", "success");
      setTimeout(() => setButtonState(button, "Скопировать"), 1600);
    } catch (error) {
      console.error("Failed to copy vacancy:", error);
      setButtonState(button, "Ошибка");
      setTimeout(() => setButtonState(button, "Скопировать"), 1800);
    }
  }

  function createCopyButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.setAttribute(BUTTON_ATTR, "true");
    button.textContent = "Скопировать";
    button.addEventListener("click", () => {
      void handleCopy(button);
    });
    return button;
  }

  function mountButtons() {
    const existingButtons = document.querySelectorAll(`[${BUTTON_ATTR}="true"]`);
    if (existingButtons.length) {
      return;
    }

    const watchersText = Array.from(document.querySelectorAll(".noprint p, .noprint"))
      .find((node) => /Сейчас эту вакансию/i.test(node.textContent || ""));

    if (watchersText) {
      const anchor = watchersText.closest(".noprint") || watchersText;
      const parent = anchor.parentElement;

      if (parent) {
        const row = document.createElement("div");
        row.className = "hh-dark-copy-watchers";
        parent.insertBefore(row, anchor);
        row.appendChild(anchor);
        row.appendChild(createCopyButton());
        return;
      }
    }

    const responseButton = document.querySelector('[data-qa="vacancy-response-link-top"]');
    if (!responseButton) {
      return;
    }

    const parent = responseButton.parentElement;
    if (!parent) {
      return;
    }

    let row = parent.querySelector(".hh-dark-copy-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "hh-dark-copy-row";
      parent.insertBefore(row, responseButton);
      row.appendChild(responseButton);
    }

    row.appendChild(createCopyButton());
  }

  applyPrepaintTheme();
  injectTheme();

  const observer = new MutationObserver(() => {
    applyPrepaintTheme();
    injectTheme();
    mountButtons();
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applyPrepaintTheme();
      mountButtons();
    }, { once: true });
  } else {
    applyPrepaintTheme();
    mountButtons();
  }
})();
