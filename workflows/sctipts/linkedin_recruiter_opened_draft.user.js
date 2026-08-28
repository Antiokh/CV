// ==UserScript==
// @name         LinkedIn Recruiter Open Message
// @namespace    https://needlebit.dev/
// @version      0.2.1
// @description  Opens the LinkedIn Message dialog on LinkedIn profile pages.
// @match        https://www.linkedin.com/in/*
// @match        https://*.linkedin.com/in/*
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const MAX_WAIT_MS = 20000;
  const RETRY_MS = 150;
  const ROUTE_CHECK_MS = 300;

  let clicked = false;
  let timer = null;
  let observer = null;
  let startedAt = Date.now();
  let lastUrl = location.href;
  let routeWatcher = null;

  function normalizeText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function isLikelyMessageButton(button) {
    if (!button || button.disabled || button.getAttribute("aria-disabled") === "true") {
      return false;
    }
    const text = normalizeText(button.textContent);
    return /\bMessage\b|Сообщение|Написать/i.test(text);
  }

  function findProfileCardRoot() {
    return document.querySelector('[componentkey*="profile.card"]') || document;
  }

  function findMessageButton() {
    const root = findProfileCardRoot();
    const svgButtons = [...root.querySelectorAll("button svg#send-privately-medium")]
      .map((svg) => svg.closest("button"))
      .filter(Boolean);

    const textMatched = svgButtons.find(isLikelyMessageButton);
    if (textMatched) return textMatched;

    return svgButtons.find((button) => {
      return !button.disabled && button.getAttribute("aria-disabled") !== "true";
    }) || null;
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function tryClickMessage() {
    if (clicked) {
      stop();
      return;
    }

    const button = findMessageButton();
    if (button) {
      clicked = true;
      button.click();
      stop();
      return;
    }

    if (Date.now() - startedAt >= MAX_WAIT_MS) {
      stop();
    }
  }

  function start() {
    stop();
    if (!/\/in\//.test(location.pathname)) return;

    tryClickMessage();
    if (clicked || Date.now() - startedAt >= MAX_WAIT_MS) return;

    timer = setInterval(tryClickMessage, RETRY_MS);
    observer = new MutationObserver(tryClickMessage);
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }

  function resetForCurrentProfile() {
    clicked = false;
    startedAt = Date.now();
    start();
  }

  function startRouteWatcher() {
    if (routeWatcher) return;
    routeWatcher = setInterval(() => {
      if (location.href === lastUrl) return;
      lastUrl = location.href;
      if (/\/in\//.test(location.pathname)) {
        resetForCurrentProfile();
      } else {
        stop();
      }
    }, ROUTE_CHECK_MS);
  }

  startRouteWatcher();

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener("readystatechange", start, { once: true });
  }
})();
