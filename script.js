(function () {
  var root = document.documentElement;
  var saved = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));

  var SUPPORTED = ["en", "de", "es"];
  var translations = {}; 

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "en";
    var dict = translations[lang] || {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    root.setAttribute("lang", lang);
    localStorage.setItem("lang", lang);

    document.querySelectorAll(".lang-switch__btn").forEach(function (b) {
      var active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function detectLang() {
    var savedLang = localStorage.getItem("lang");
    if (savedLang && SUPPORTED.indexOf(savedLang) !== -1) return savedLang;
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) !== -1 ? nav : "en";
  }

  function initI18n() {
    var current = detectLang();

    document.querySelectorAll(".lang-switch__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        applyLang(b.getAttribute("data-lang"));
      });
    });

    fetch("translations.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        translations = data;
        applyLang(current);
      })
      .catch(function () {
        applyLang(current);
      });
  }

  function init() {
    var btn = document.getElementById("themeToggle");
    if (btn) {
      var moonIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
      var sunIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
      var render = function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        btn.innerHTML = isDark ? sunIcon : moonIcon;
        var label = isDark ? "Switch to light mode" : "Switch to dark mode";
        btn.setAttribute("title", label);
        btn.setAttribute("aria-label", label);
      };
      render();
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        render();
      });
    }

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    initI18n();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
