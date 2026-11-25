
/* =========================================================
   OSSP-TOM HOME PAGE JAVASCRIPT
   File: js/home.js

   FEATURES:
   1. Legislative records search
   2. Empty search validation
   3. Search feedback
   4. Supports dynamically loaded home.html
   5. Event delegation to avoid duplicate listeners
   6. Checks all three homepage containers
   7. Ensures homepage sections remain visible
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const SEARCH_PAGE = "index.html?page=legislative";

    const HOME_SECTION_SELECTORS = [
        ".home-welcome-section",
        ".home-quick-section",
        ".home-achievements-section"
    ];

    /* =====================================================
       LEGISLATIVE RECORD SEARCH
    ===================================================== */

    document.addEventListener("submit", function (event) {
        const form = event.target;

        if (!form || form.id !== "recordSearchForm") {
            return;
        }

        event.preventDefault();

        const searchInput = document.getElementById("recordSearch");
        const feedback = document.getElementById("homeSearchFeedback");

        if (!searchInput) {
            console.error("OSSP-TOM: Search input not found.");
            return;
        }

        const searchValue = searchInput.value.trim();

        if (!searchValue) {
            if (feedback) {
                feedback.textContent =
                    "Please enter a title, number, keyword, or year.";
                feedback.classList.add("visible");
            }

            searchInput.focus();
            return;
        }

        if (feedback) {
            feedback.textContent = "Searching legislative records...";
            feedback.classList.add("visible");
        }

        const destination =
            SEARCH_PAGE + "&search=" + encodeURIComponent(searchValue);

        window.location.href = destination;
    });

    /* =====================================================
       CLEAR SEARCH FEEDBACK WHEN USER TYPES
    ===================================================== */

    document.addEventListener("input", function (event) {
        if (!event.target || event.target.id !== "recordSearch") {
            return;
        }

        const feedback = document.getElementById("homeSearchFeedback");

        if (feedback) {
            feedback.textContent = "";
            feedback.classList.remove("visible");
        }
    });

    /* =====================================================
       HOMEPAGE VISIBILITY
    ===================================================== */

    function ensureHomeSectionsVisible() {
        const homePage = document.getElementById("page-home");

        if (!homePage) {
            return;
        }

        const sections = HOME_SECTION_SELECTORS.map(function (selector) {
            return homePage.querySelector(selector);
        });

        const allSectionsExist = sections.every(Boolean);

        if (!allSectionsExist) {
            console.error(
                "OSSP-TOM: One or more homepage sections are missing.",
                {
                    welcome: !!sections[0],
                    quickAccess: !!sections[1],
                    achievements: !!sections[2]
                }
            );
            return;
        }

        /*
         * Keep the homepage as a normal document-flow element.
         * This allows the page to grow according to its content.
         */

        homePage.style.setProperty("display", "block", "important");
        homePage.style.setProperty("position", "relative", "important");
        homePage.style.setProperty("width", "100%", "important");
        homePage.style.setProperty("height", "auto", "important");
        homePage.style.setProperty("min-height", "0", "important");
        homePage.style.setProperty("max-height", "none", "important");
        homePage.style.setProperty("overflow", "visible", "important");

        sections.forEach(function (section, index) {
            section.style.setProperty("position", "relative", "important");
            section.style.setProperty("width", "100%", "important");
            section.style.setProperty("height", "auto", "important");
            section.style.setProperty("max-height", "none", "important");

            if (index !== 1) {
                section.style.setProperty("display", "block", "important");
                section.style.setProperty("overflow", "visible", "important");
            } else {
                section.style.setProperty("display", "flex", "important");
            }
        });

        console.log("OSSP-TOM Homepage initialized successfully.");
        console.log("Container 1 - Welcome: Visible");
        console.log("Container 2 - Quick Access: Visible");
        console.log("Container 3 - Achievements: Visible");
    }

    /* =====================================================
       HOMEPAGE INITIALIZATION
    ===================================================== */

    function initializeHomePage() {
        ensureHomeSectionsVisible();
    }

    /* =====================================================
       WATCH FOR DYNAMICALLY LOADED HOMEPAGE
    ===================================================== */

    function observeMainContent() {
        const mainContent = document.getElementById("mainContent");

        if (!mainContent) {
            return;
        }

        const observer = new MutationObserver(function () {
            if (document.getElementById("page-home")) {
                initializeHomePage();
            }
        });

        observer.observe(mainContent, {
            childList: true,
            subtree: true
        });

        initializeHomePage();
    }

    /* =====================================================
       INITIAL PAGE CHECK
    ===================================================== */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            observeMainContent,
            { once: true }
        );
    } else {
        observeMainContent();
    }

})();
