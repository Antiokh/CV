// ==UserScript==
// @name         LinkedIn Vacancy Copy
// @namespace    https://needlebit.dev/
// @version      0.1.3
// @description  Adds a copy button on LinkedIn job pages and exports vacancy details.
// @match        https://www.linkedin.com/jobs/view/*
// @match        https://*.linkedin.com/jobs/view/*
// @match        https://www.linkedin.com/jobs/collections/*
// @match        https://*.linkedin.com/jobs/collections/*
// @run-at       document-idle
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ATTR = "data-li-job-copy-button";
  const BUTTON_CLASS = "li-job-copy-button";
  const STYLE_ID = "li-job-copy-style";

  const BUTTON_CSS = `
    .${BUTTON_CLASS} {
      appearance: none !important;
      border: 1px solid #3d4f68 !important;
      background: #132338 !important;
      color: #eaf2ff !important;
      border-radius: 999px !important;
      min-height: 40px !important;
      padding: 0 16px !important;
      font: 600 14px/1 system-ui, sans-serif !important;
      cursor: pointer !important;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease !important;
      margin-left: 10px !important;
      white-space: nowrap !important;
      position: fixed !important;
      top: 16px !important;
      left: 16px !important;
      z-index: 2147483647 !important;
      margin: 0 !important;
    }

    .${BUTTON_CLASS}:hover {
      background: #1b3556 !important;
      border-color: #5f7da3 !important;
    }

    .${BUTTON_CLASS}[data-state="success"] {
      background: #28a76f !important;
      border-color: #28a76f !important;
      color: #061a11 !important;
    }
  `;

  function normalizeText(value) {
    return (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = BUTTON_CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function textOf(selectors, root = document) {
    for (const selector of selectors) {
      const node = root.querySelector(selector);
      const text = normalizeText(node?.textContent || "");
      if (text) {
        return text;
      }
    }
    return "";
  }

  function firstNode(selectors, root = document) {
    for (const selector of selectors) {
      const node = root.querySelector(selector);
      if (node) {
        return node;
      }
    }
    return null;
  }

  function extractLdJson() {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent || "{}");
        if (data?.["@type"] === "JobPosting") {
          return data;
        }
      } catch (_error) {
        // ignore malformed blocks
      }
    }
    return null;
  }

  function collectCriteria() {
    const out = {};
    const items = Array.from(document.querySelectorAll(".description__job-criteria-list li"));
    for (const item of items) {
      const label = normalizeText(item.querySelector("h3")?.textContent || "");
      const value = normalizeText(item.querySelector("span")?.textContent || "");
      if (label && value) {
        out[label] = value;
      }
    }
    return out;
  }

  function collectTopPills(root) {
    return Array.from(root.querySelectorAll([
      '.job-details-fit-level-preferences button',
      '.job-details-fit-level-preferences .tvm__text',
      'a[href*="/jobs/view/"] span',
      'a[href*="/jobs/collections/"] span'
    ].join(", ")))
      .map((node) => normalizeText(node.textContent || ""))
      .filter(Boolean);
  }

  function parseEmploymentFromPills(pills) {
    const hit = pills.find((x) => /(full[- ]?time|part[- ]?time|contract|internship|temporary)/i.test(x));
    return hit || "";
  }

  function parseWorkplaceFromPills(pills) {
    const hit = pills.find((x) => /\b(remote|hybrid|on-site|onsite)\b/i.test(x));
    return hit || "";
  }

  function collectCompanyDetails() {
    const companyRoot = firstNode([
      '[data-sdui-component*="aboutTheCompanyForJobDetails"]',
      ".jobs-company",
    ]);
    if (!companyRoot) {
      return {
        followers: "",
        companyFacts: "",
        companyAbout: "",
      };
    }

    const followers = textOf([
      ".artdeco-entity-lockup__subtitle",
      ".jobs-company .artdeco-entity-lockup__subtitle",
      'a[href*="/company/"] p span',
      'a[href*="/company/"] + button + div p span',
    ], companyRoot);

    const factsText = normalizeText(
      Array.from(companyRoot.querySelectorAll("p span, .jobs-company__inline-information, .t-14.mt5"))
        .map((n) => normalizeText(n.textContent || ""))
        .filter((t) => t && !/^•$/.test(t))
        .filter((t) => /employees|followers|on linkedin|services|consulting|industry|human resources|it/i.test(t))
        .join(" · ")
    );

    const companyAbout = normalizeText(
      firstNode([
        ".jobs-company__company-description",
        ".inline-show-more-text--is-collapsed",
        '[data-testid="expandable-text-box"]',
        "p",
      ], companyRoot)?.innerText || ""
    );

    return {
      followers,
      companyFacts: factsText,
      companyAbout,
    };
  }

  function getPrimaryJobRoot() {
    const manageBanner = document.querySelector('div[componentkey^="JobDetails_ManageJobBanner"]');
    if (manageBanner?.nextElementSibling) {
      return manageBanner.nextElementSibling;
    }
    return document;
  }

  function collectVacancyData() {
    const ld = extractLdJson();
    const jobRoot = getPrimaryJobRoot();
    const criteria = collectCriteria();
    const topPills = collectTopPills(jobRoot);
    const companyDetails = collectCompanyDetails();

    const title = textOf([
      ".job-details-jobs-unified-top-card__job-title h1",
      'div[componentkey^="JobDetails_ManageJobBanner"] + div p',
      ".top-card-layout__title",
      "h1",
    ], jobRoot) || normalizeText(ld?.title || "");

    const company = textOf([
      ".job-details-jobs-unified-top-card__company-name a",
      'a[aria-label^="Company,"]',
      'div[componentkey^="JobDetails_ManageJobBanner"] + div a[href*="/company/"]',
      ".job-details-jobs-unified-top-card__company-name",
      ".topcard__org-name-link",
      ".topcard__flavor-row a",
    ], jobRoot) || normalizeText(ld?.hiringOrganization?.name || "");

    const topMeta = textOf([
      ".job-details-jobs-unified-top-card__tertiary-description-container",
      'div[componentkey^="JobDetails_ManageJobBanner"] + div p',
    ], jobRoot);
    const metaParts = topMeta ? topMeta.split("·").map((x) => normalizeText(x)).filter(Boolean) : [];

    const location = textOf([
      ".job-details-jobs-unified-top-card__tertiary-description-container .tvm__text",
      ".job-details-jobs-unified-top-card__primary-description-container .tvm__text",
      ".topcard__flavor--bullet",
      ".topcard__flavor--metadata",
    ], jobRoot) || metaParts[0] || normalizeText(ld?.jobLocation?.address?.addressLocality || ld?.jobLocation?.address?.addressRegion || "");

    const posted = textOf([
      ".job-details-jobs-unified-top-card__tertiary-description-container .tvm__text:nth-of-type(3)",
      ".job-details-jobs-unified-top-card__tertiary-description-container .tvm__text",
      ".posted-time-ago__text",
    ], jobRoot) || (metaParts.length > 1 ? metaParts[1] : "");

    const locationNormalized = location.split("·")[0] ? normalizeText(location.split("·")[0]) : location;
    const topMetaLocation = metaParts.length ? normalizeText(metaParts[0]) : "";
    const finalLocation = locationNormalized || topMetaLocation;

    const description = normalizeText(
      firstNode([
        ".jobs-description-content .jobs-box__html-content",
        ".jobs-description-content__text--stretch",
        '[data-sdui-component*="aboutTheJob"] [data-testid="expandable-text-box"]',
        '[data-sdui-component*="aboutTheJob"]',
        ".show-more-less-html__markup",
        ".jobs-description-content__text",
      ])?.innerText ||
      ld?.description ||
      ""
    );

    return {
      title,
      company,
      location: finalLocation,
      posted,
      seniority: criteria["Seniority level"] || "",
      employmentType: criteria["Employment type"] || parseEmploymentFromPills(topPills) || normalizeText(ld?.employmentType || ""),
      workplace: parseWorkplaceFromPills(topPills),
      jobFunction: criteria["Job function"] || "",
      industries: criteria["Industries"] || "",
      companyFollowers: companyDetails.followers,
      companyFacts: companyDetails.companyFacts,
      companyAbout: companyDetails.companyAbout,
      description,
      url: window.location?.href || "",
    };
  }

  function buildClipboardText(data) {
    const lines = [
      "## Job",
      `### Title`,
      data.title || "-",
      `### Company`,
      data.company || "-",
      `### URL`,
      data.url || "-",
      "",
      "## Job Details",
    ];

    const details = [
      ["Location", data.location],
      ["Posted", data.posted],
      ["Workplace", data.workplace],
      ["Employment Type", data.employmentType],
      ["Seniority", data.seniority],
      ["Job Function", data.jobFunction],
      ["Industries", data.industries],
    ];

    for (const [label, value] of details) {
      if (!value) {
        continue;
      }
      lines.push(`### ${label}`);
      lines.push(value);
    }

    lines.push("", "", "## Company");

    if (data.companyFollowers) {
      lines.push("### Followers");
      lines.push(data.companyFollowers);
    }

    if (data.companyFacts) {
      lines.push("### Facts");
      lines.push(data.companyFacts);
    }

    if (data.companyAbout) {
      lines.push("### About");
      lines.push(data.companyAbout);
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

  async function expandAllMoreButtons() {
    const selectors = [
      ".inline-show-more-text__button",
      ".jobs-description .inline-show-more-text__button",
      ".jobs-company .inline-show-more-text__button",
      '[data-testid="expandable-text-button"]',
      'button[aria-label*="more" i]',
      'button[aria-label*="show more" i]',
      '[data-sdui-component*="aboutTheCompanyForJobDetails"] [data-testid="expandable-text-button"]',
    ];

    const clicked = new WeakSet();
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let pass = 0; pass < 12; pass += 1) {
      const buttons = Array.from(document.querySelectorAll(selectors.join(", ")))
        .filter((btn) => btn instanceof HTMLElement)
        .filter((btn) => !btn.disabled)
        .filter((btn) => {
          const text = normalizeText(btn.innerText || btn.textContent || "");
          const aria = normalizeText(btn.getAttribute("aria-label") || "");
          const inCompanyBlock = !!btn.closest('[data-sdui-component*="aboutTheCompanyForJobDetails"], .jobs-company');
          const inJobDescBlock = !!btn.closest(".jobs-description, [data-sdui-component*='aboutTheJob']");
          return inCompanyBlock || inJobDescBlock || /more|show more|\.\.\./i.test(`${text} ${aria}`);
        });

      let changed = false;
      for (const button of buttons) {
        if (clicked.has(button)) {
          continue;
        }
        button.click();
        // Some SDUI "more" controls are rendered with pointer-events tricks.
        button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        const innerClickable = button.querySelector('span[style*="pointer-events: auto"]');
        if (innerClickable instanceof HTMLElement) {
          innerClickable.click();
        }
        clicked.add(button);
        changed = true;
        await sleep(130);
      }

      if (!changed) {
        break;
      }
      await sleep(220);
    }
  }

  async function onCopy(button) {
    try {
      await expandAllMoreButtons();
      const text = buildClipboardText(collectVacancyData());
      await copyToClipboard(text);
      setButtonState(button, "Скопировано", "success");
      setTimeout(() => setButtonState(button, "Скопировать"), 1500);
    } catch (_error) {
      setButtonState(button, "Ошибка");
      setTimeout(() => setButtonState(button, "Скопировать"), 1700);
    }
  }

  function createButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.setAttribute(BUTTON_ATTR, "true");
    button.textContent = "Скопировать";
    button.addEventListener("click", () => {
      void onCopy(button);
    });
    return button;
  }

  function mountButton() {
    const isJobsPage = /linkedin\.com\/jobs\/(view|collections)\//i.test(window.location.href);
    if (!isJobsPage) {
      return;
    }

    if (document.querySelector(`[${BUTTON_ATTR}="true"]`)) {
      return;
    }

    const fallbackContainer = document.body || document.documentElement;
    const floating = createButton();
    fallbackContainer.appendChild(floating);
  }

  injectStyle();
  mountButton();

  const observer = new MutationObserver(() => {
    injectStyle();
    mountButton();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
