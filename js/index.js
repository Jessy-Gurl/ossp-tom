/* =========================================================
   OSSP-TOM WEBSITE
   MAIN JAVASCRIPT
   FULL UPDATED VERSION
   MATCHED TO CURRENT INDEX.HTML
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       SETTINGS
    ====================================================== */

    const MOBILE_BREAKPOINT = 800;
    const SLIDER_INTERVAL = 6000;


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const body =
        document.body;

    const navMenu =
        document.getElementById("navMenu");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mainNavigation =
        document.querySelector(".main-navigation");

    const pageSections =
        Array.from(
            document.querySelectorAll(".page-section")
        );

    const dropdowns =
        Array.from(
            document.querySelectorAll(
                ".nav-item.dropdown"
            )
        );


    /* =====================================================
       DATE AND TIME
    ====================================================== */

    const currentDay =
        document.getElementById("currentDay");

    const currentDate =
        document.getElementById("currentDate");

    const currentTime =
        document.getElementById("currentTime");


    function updateDateTime() {

        const now = new Date();


        if (currentDay) {

            currentDay.textContent =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        weekday: "long"
                    }
                ).format(now);

        }


        if (currentDate) {

            currentDate.textContent =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                ).format(now);

        }


        if (currentTime) {

            currentTime.textContent =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    }
                ).format(now);

        }

    }


    updateDateTime();

    setInterval(
        updateDateTime,
        1000
    );


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    function openMobileMenu() {

        if (!navMenu) {
            return;
        }


        navMenu.classList.add("open");

        navMenu.setAttribute(
            "aria-hidden",
            "false"
        );


        if (mobileMenuButton) {

            mobileMenuButton.classList.add(
                "open"
            );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Close navigation"
            );

        }

    }


    function closeMobileMenu() {

        if (!navMenu) {
            return;
        }


        navMenu.classList.remove("open");

        navMenu.setAttribute(
            "aria-hidden",
            "true"
        );


        if (mobileMenuButton) {

            mobileMenuButton.classList.remove(
                "open"
            );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );

        }

    }


    function toggleMobileMenu() {

        if (!navMenu) {
            return;
        }


        if (
            navMenu.classList.contains("open")
        ) {

            closeMobileMenu();

        }
        else {

            openMobileMenu();

        }

    }


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                toggleMobileMenu();

            }
        );

    }


    /* =====================================================
       DROPDOWNS
    ====================================================== */

    function closeAllDropdowns() {

        dropdowns.forEach(
            function (dropdown) {

                dropdown.classList.remove(
                    "open"
                );


                const button =
                    dropdown.querySelector(
                        ".dropdown-button"
                    );


                if (button) {

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    function toggleDropdown(dropdown) {

        if (!dropdown) {
            return;
        }


        const currentlyOpen =
            dropdown.classList.contains(
                "open"
            );


        closeAllDropdowns();


        if (!currentlyOpen) {

            dropdown.classList.add(
                "open"
            );


            const button =
                dropdown.querySelector(
                    ".dropdown-button"
                );


            if (button) {

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }

    }


    dropdowns.forEach(
        function (dropdown) {

            const button =
                dropdown.querySelector(
                    ".dropdown-button"
                );


            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleDropdown(
                        dropdown
                    );

                }
            );

        }
    );


    /* =====================================================
       ACTIVE NAVIGATION
    ====================================================== */

    function clearActiveNavigation() {

        document
            .querySelectorAll(
                "#navMenu .nav-item"
            )
            .forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


        document
            .querySelectorAll(
                "#navMenu .nav-link"
            )
            .forEach(
                function (link) {

                    link.classList.remove(
                        "active"
                    );

                }
            );


        document
            .querySelectorAll(
                "#navMenu .login-button"
            )
            .forEach(
                function (link) {

                    link.classList.remove(
                        "active"
                    );

                }
            );

    }


    function setActiveNavigation(page) {

        clearActiveNavigation();


        if (!page) {
            return;
        }


        const matchingLinks =
            document.querySelectorAll(
                '#navMenu [data-page="' +
                page +
                '"]'
            );


        matchingLinks.forEach(
            function (link) {

                link.classList.add(
                    "active"
                );


                const parentItem =
                    link.closest(
                        ".nav-item"
                    );


                if (parentItem) {

                    parentItem.classList.add(
                        "active"
                    );

                }


                const parentDropdown =
                    link.closest(
                        ".dropdown"
                    );


                if (parentDropdown) {

                    parentDropdown.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       PAGE VISIBILITY
       
       IMPORTANT:
       This explicitly controls display.
       It does NOT depend on CSS alone.
    ====================================================== */

    function hideAllPages() {

        pageSections.forEach(
            function (section) {

                section.classList.remove(
                    "active-page"
                );


                section.setAttribute(
                    "aria-hidden",
                    "true"
                );


                section.style.display =
                    "none";

                section.style.visibility =
                    "hidden";

                section.style.opacity =
                    "0";

            }
        );

    }


    function showPage(page, updateHistory = true) {

        if (!page) {
            page = "home";
        }


        const targetPage =
            document.getElementById(
                "page-" + page
            );


        /*
            If the requested page does not exist,
            automatically return to Home.
        */

        if (!targetPage) {

            console.warn(
                "OSSP-TOM: Page not found:",
                "page-" + page
            );


            page = "home";


            const homePage =
                document.getElementById(
                    "page-home"
                );


            if (!homePage) {

                console.error(
                    "OSSP-TOM: page-home does not exist."
                );

                return;

            }

        }


        const finalTarget =
            document.getElementById(
                "page-" + page
            );


        if (!finalTarget) {
            return;
        }


        /*
            Hide all sections.
        */

        hideAllPages();


        /*
            Show selected section.
            
            We explicitly set display here so
            the page works even if the CSS does
            not contain .active-page.
        */

        finalTarget.classList.add(
            "active-page"
        );


        finalTarget.setAttribute(
            "aria-hidden",
            "false"
        );


        finalTarget.style.display =
            "block";

        finalTarget.style.visibility =
            "visible";

        finalTarget.style.opacity =
            "1";


        /*
            Update navigation.
        */

        setActiveNavigation(
            page
        );


        /*
            Close menus.
        */

        closeAllDropdowns();

        closeMobileMenu();


        /*
            Scroll to top.
        */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        /*
            Update URL.
        */

        if (updateHistory) {

            const newHash =
                page === "home"
                    ? "#"
                    : "#" + page;


            try {

                history.pushState(
                    {
                        page: page
                    },
                    "",
                    newHash
                );

            }
            catch (error) {

                console.warn(
                    "OSSP-TOM: Unable to update URL.",
                    error
                );

            }

        }

    }


    /* =====================================================
       GET PAGE FROM HASH
    ====================================================== */

    function getPageFromHash() {

        let hash =
            window.location.hash;


        if (!hash) {

            return "home";

        }


        hash =
            hash
                .replace(
                    /^#/,
                    ""
                )
                .trim();


        if (!hash) {

            return "home";

        }


        /*
            Only accept a page that actually
            exists in the HTML.
        */

        const target =
            document.getElementById(
                "page-" + hash
            );


        if (target) {

            return hash;

        }


        return "home";

    }


    /* =====================================================
       NAVIGATION LINKS
    ====================================================== */

    const allPageLinks =
        document.querySelectorAll(
            "[data-page]"
        );


    allPageLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const page =
                        link.getAttribute(
                            "data-page"
                        );


                    if (!page) {
                        return;
                    }


                    showPage(
                        page,
                        true
                    );

                }
            );

        }
    );


    /* =====================================================
       HOME LOGO LINKS
    ====================================================== */

    const homeLinks =
        document.querySelectorAll(
            ".home-link"
        );


    homeLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showPage(
                        "home",
                        true
                    );

                }
            );

        }
    );


    /* =====================================================
       CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const dropdown =
                event.target.closest(
                    ".nav-item.dropdown"
                );


            if (!dropdown) {

                closeAllDropdowns();

            }

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !navMenu ||
                !mobileMenuButton
            ) {

                return;

            }


            const insideMenu =
                navMenu.contains(
                    event.target
                );


            const insideButton =
                mobileMenuButton.contains(
                    event.target
                );


            if (
                !insideMenu &&
                !insideButton
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeAllDropdowns();

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       BROWSER BACK / FORWARD
    ====================================================== */

    window.addEventListener(
        "popstate",
        function () {

            const page =
                getPageFromHash();


            showPage(
                page,
                false
            );

        }
    );


    window.addEventListener(
        "hashchange",
        function () {

            const page =
                getPageFromHash();


            showPage(
                page,
                false
            );

        }
    );


    /* =====================================================
       BANNER SLIDER
    ====================================================== */

    const slides =
        Array.from(
            document.querySelectorAll(
                ".banner-slide"
            )
        );


    const prevButton =
        document.getElementById(
            "prevBanner"
        );


    const nextButton =
        document.getElementById(
            "nextBanner"
        );


    const dotsContainer =
        document.getElementById(
            "sliderDots"
        );


    const bannerSlider =
        document.getElementById(
            "bannerSlider"
        );


    let currentSlide = 0;

    let sliderTimer = null;


    function createSliderDots() {

        if (
            !dotsContainer ||
            slides.length === 0
        ) {

            return;

        }


        dotsContainer.innerHTML =
            "";


        slides.forEach(
            function (_, index) {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type =
                    "button";


                dot.className =
                    "slider-dot";


                dot.setAttribute(
                    "aria-label",
                    "Go to banner " +
                    (index + 1)
                );


                dot.addEventListener(
                    "click",
                    function () {

                        showSlide(
                            index
                        );


                        restartSlider();

                    }
                );


                dotsContainer.appendChild(
                    dot
                );

            }
        );

    }


    function updateSliderDots() {

        if (!dotsContainer) {
            return;
        }


        const dots =
            dotsContainer.querySelectorAll(
                ".slider-dot"
            );


        dots.forEach(
            function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === currentSlide
                );

            }
        );

    }


    function showSlide(index) {

        if (
            slides.length === 0
        ) {

            return;

        }


        if (
            index >=
            slides.length
        ) {

            currentSlide = 0;

        }
        else if (
            index < 0
        ) {

            currentSlide =
                slides.length - 1;

        }
        else {

            currentSlide =
                index;

        }


        slides.forEach(
            function (
                slide,
                slideIndex
            ) {

                slide.classList.toggle(
                    "active",
                    slideIndex ===
                    currentSlide
                );

            }
        );


        updateSliderDots();

    }


    function nextSlide() {

        showSlide(
            currentSlide + 1
        );

    }


    function previousSlide() {

        showSlide(
            currentSlide - 1
        );

    }


    function startSlider() {

        if (
            slides.length <= 1
        ) {

            return;

        }


        stopSlider();


        sliderTimer =
            setInterval(
                function () {

                    nextSlide();

                },
                SLIDER_INTERVAL
            );

    }


    function stopSlider() {

        if (sliderTimer) {

            clearInterval(
                sliderTimer
            );

            sliderTimer =
                null;

        }

    }


    function restartSlider() {

        stopSlider();

        startSlider();

    }


    createSliderDots();


    if (
        slides.length > 0
    ) {

        showSlide(0);

        startSlider();

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                nextSlide();

                restartSlider();

            }
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                previousSlide();

                restartSlider();

            }
        );

    }


    if (bannerSlider) {

        bannerSlider.addEventListener(
            "mouseenter",
            stopSlider
        );


        bannerSlider.addEventListener(
            "mouseleave",
            startSlider
        );


        bannerSlider.addEventListener(
            "focusin",
            stopSlider
        );


        bannerSlider.addEventListener(
            "focusout",
            startSlider
        );

    }


    /* =====================================================
       KEYBOARD BANNER CONTROL
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            const activeElement =
                document.activeElement;


            const isTyping =
                activeElement &&
                (
                    activeElement.tagName ===
                        "INPUT" ||
                    activeElement.tagName ===
                        "TEXTAREA" ||
                    activeElement.tagName ===
                        "SELECT"
                );


            if (isTyping) {
                return;
            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                nextSlide();

                restartSlider();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                previousSlide();

                restartSlider();

            }

        }
    );


    /* =====================================================
       LEGISLATIVE SEARCH
    ====================================================== */

    const recordSearchForm =
        document.getElementById(
            "recordSearchForm"
        );


    const recordSearch =
        document.getElementById(
            "recordSearch"
        );


    function performSearch(
        input,
        message
    ) {

        if (!input) {
            return;
        }


        const value =
            input.value.trim();


        if (!value) {

            alert(
                "Please enter a search term."
            );


            input.focus();

            return;

        }


        alert(
            message +
            "\n\n" +
            value
        );

    }


    if (
        recordSearchForm &&
        recordSearch
    ) {

        recordSearchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                performSearch(
                    recordSearch,
                    "Searching legislative records for:"
                );

            }
        );

    }


    /* =====================================================
       LEGISLATIVE PAGE SEARCH
    ====================================================== */

    const legislativeSearchForm =
        document.getElementById(
            "legislativeSearchForm"
        );


    const legislativeSearch =
        document.getElementById(
            "legislativeSearch"
        );


    if (
        legislativeSearchForm &&
        legislativeSearch
    ) {

        legislativeSearchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                performSearch(
                    legislativeSearch,
                    "Searching legislative records for:"
                );

            }
        );

    }


    /* =====================================================
       ORDINANCES
    ====================================================== */

    const ordinancesPage =
        document.getElementById(
            "page-ordinances"
        );


    if (ordinancesPage) {

        const form =
            ordinancesPage.querySelector(
                "form"
            );


        const input =
            ordinancesPage.querySelector(
                'input[type="search"], input[type="text"]'
            );


        if (
            form &&
            input
        ) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    performSearch(
                        input,
                        "Searching ordinances for:"
                    );

                }
            );

        }

    }


    /* =====================================================
       RESOLUTIONS
    ====================================================== */

    const resolutionsPage =
        document.getElementById(
            "page-resolutions"
        );


    if (resolutionsPage) {

        const form =
            resolutionsPage.querySelector(
                "form"
            );


        const input =
            resolutionsPage.querySelector(
                'input[type="search"], input[type="text"]'
            );


        if (
            form &&
            input
        ) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    performSearch(
                        input,
                        "Searching resolutions for:"
                    );

                }
            );

        }

    }


    /* =====================================================
       REQUEST TRACKING
    ====================================================== */

    const trackingForm =
        document.getElementById(
            "trackingForm"
        );


    const trackingNumber =
        document.getElementById(
            "trackingNumber"
        );


    if (
        trackingForm &&
        trackingNumber
    ) {

        trackingForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const reference =
                    trackingNumber.value
                        .trim()
                        .toUpperCase();


                if (!reference) {

                    alert(
                        "Please enter your request reference number."
                    );


                    trackingNumber.focus();

                    return;

                }


                alert(
                    "Checking request status for:\n\n" +
                    reference
                );

            }
        );

    }


    /* =====================================================
       FEEDBACK FORM
    ====================================================== */

    const feedbackForm =
        document.getElementById(
            "feedbackForm"
        );


    const feedbackName =
        document.getElementById(
            "feedbackName"
        );


    const feedbackEmail =
        document.getElementById(
            "feedbackEmail"
        );


    const feedbackMessage =
        document.getElementById(
            "feedbackMessage"
        );


    if (feedbackForm) {

        feedbackForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    feedbackName
                        ? feedbackName.value.trim()
                        : "";


                const email =
                    feedbackEmail
                        ? feedbackEmail.value.trim()
                        : "";


                const message =
                    feedbackMessage
                        ? feedbackMessage.value.trim()
                        : "";


                if (!name) {

                    alert(
                        "Please enter your name."
                    );


                    if (feedbackName) {
                        feedbackName.focus();
                    }


                    return;

                }


                if (!email) {

                    alert(
                        "Please enter your email address."
                    );


                    if (feedbackEmail) {
                        feedbackEmail.focus();
                    }


                    return;

                }


                if (!message) {

                    alert(
                        "Please enter your feedback."
                    );


                    if (feedbackMessage) {
                        feedbackMessage.focus();
                    }


                    return;

                }


                alert(
                    "Thank you for your feedback, " +
                    name +
                    "!"
                );


                feedbackForm.reset();

            }
        );

    }


    /* =====================================================
       LOGIN
    ====================================================== */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const username =
        document.getElementById(
            "username"
        );


    const password =
        document.getElementById(
            "password"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const usernameValue =
                    username
                        ? username.value.trim()
                        : "";


                const passwordValue =
                    password
                        ? password.value
                        : "";


                if (!usernameValue) {

                    alert(
                        "Please enter your username."
                    );


                    if (username) {
                        username.focus();
                    }


                    return;

                }


                if (!passwordValue) {

                    alert(
                        "Please enter your password."
                    );


                    if (password) {
                        password.focus();
                    }


                    return;

                }


                alert(
                    "Login functionality is ready to be connected to the OSSP-TOM authentication system."
                );

            }
        );

    }


    /* =====================================================
       RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth >
                MOBILE_BREAKPOINT
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       NAVIGATION SHADOW
    ====================================================== */

    function updateNavigationShadow() {

        if (!mainNavigation) {
            return;
        }


        if (
            window.scrollY > 20
        ) {

            mainNavigation.style.boxShadow =
                "0 6px 20px rgba(0, 0, 0, 0.14)";

        }
        else {

            mainNavigation.style.boxShadow =
                "0 3px 15px rgba(0, 0, 0, 0.08)";

        }

    }


    window.addEventListener(
        "scroll",
        updateNavigationShadow
    );


    updateNavigationShadow();


    /* =====================================================
       INITIALIZE PAGE
       
       IMPORTANT:
       Do this LAST after all event listeners
       have been registered.
    ====================================================== */

    const initialPage =
        getPageFromHash();


    showPage(
        initialPage,
        false
    );


    /* =====================================================
       INITIAL ARIA STATES
    ====================================================== */

    if (navMenu) {

        navMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    dropdowns.forEach(
        function (dropdown) {

            const button =
                dropdown.querySelector(
                    ".dropdown-button"
                );


            if (button) {

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       CONSOLE DEBUG
    ====================================================== */

    console.log(
        "=========================================="
    );

    console.log(
        "OSSP-TOM WEBSITE"
    );

    console.log(
        "JavaScript initialized successfully."
    );

    console.log(
        "Available pages:",
        pageSections.map(
            function (section) {
                return section.id;
            }
        )
    );

    console.log(
        "=========================================="
    );

});