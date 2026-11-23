
/* =========================================================
   OSSP-TOM WEBSITE
   MAIN JAVASCRIPT
   UI-ONLY VERSION
   NO SERVER / NO FETCH
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       SETTINGS
    ====================================================== */

    const MOBILE_BREAKPOINT = 800;
    const SLIDER_INTERVAL = 6000;


    /* =====================================================
       DATE AND TIME
    ====================================================== */

    const currentDay = document.getElementById("currentDay");
    const currentDate = document.getElementById("currentDate");
    const currentTime = document.getElementById("currentTime");

    function updateDateTime() {

        const now = new Date();

        if (currentDay) {
            currentDay.textContent = new Intl.DateTimeFormat("en-US", {
                weekday: "long"
            }).format(now);
        }

        if (currentDate) {
            currentDate.textContent = new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            }).format(now);
        }

        if (currentTime) {
            currentTime.textContent = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }).format(now);
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);


    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const navMenu = document.getElementById("navMenu");
    const mobileMenuButton = document.getElementById("mobileMenuButton");

    function openMobileMenu() {

        if (!navMenu) return;

        navMenu.classList.add("open");
        navMenu.setAttribute("aria-hidden", "false");

        if (mobileMenuButton) {
            mobileMenuButton.classList.add("open");
            mobileMenuButton.setAttribute("aria-expanded", "true");
            mobileMenuButton.setAttribute("aria-label", "Close navigation");
        }
    }

    function closeMobileMenu() {

        if (!navMenu) return;

        navMenu.classList.remove("open");
        navMenu.setAttribute("aria-hidden", "true");

        if (mobileMenuButton) {
            mobileMenuButton.classList.remove("open");
            mobileMenuButton.setAttribute("aria-expanded", "false");
            mobileMenuButton.setAttribute("aria-label", "Open navigation");
        }
    }

    if (mobileMenuButton) {

        mobileMenuButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (navMenu && navMenu.classList.contains("open")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }


    /* =====================================================
       DROPDOWN MENUS
    ====================================================== */

    const dropdowns = document.querySelectorAll(".nav-item.dropdown");

    function closeAllDropdowns() {

        dropdowns.forEach(function (dropdown) {

            dropdown.classList.remove("open");

            const button = dropdown.querySelector(".dropdown-button");

            if (button) {
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    dropdowns.forEach(function (dropdown) {

        const button = dropdown.querySelector(".dropdown-button");

        if (!button) return;

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isOpen = dropdown.classList.contains("open");

            closeAllDropdowns();

            if (!isOpen) {
                dropdown.classList.add("open");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });


    /* =====================================================
       NORMAL HTML PAGE NAVIGATION
       NO FETCH / NO DYNAMIC HTML LOADING
    ====================================================== */

    const PAGE_LINKS = {
        home: "index.html",
        councilors: "pages/councilors.html",
        "order-business": "pages/order-business.html",
        committee: "pages/committee.html",
        about: "pages/about.html",
        legislative: "pages/legislative.html",
        ordinances: "pages/ordinances.html",
        resolutions: "pages/resolutions.html",
        ctc: "pages/ctc.html",
        document: "pages/document.html",
        tracking: "pages/tracking.html",
        services: "pages/services.html",
        news: "pages/announcements.html",
        announcements: "pages/announcements.html",
        directory: "pages/directory.html",
        faqs: "pages/faqs.html",
        feedback: "pages/feedback.html",
        privacy: "pages/privacy.html",
        accessibility: "pages/accessibility.html",
        contact: "pages/contact.html"
    };

    document.addEventListener("click", function (event) {

        const link = event.target.closest("[data-page]");

        if (!link) return;

        if (link.classList.contains("dropdown-button")) return;

        const page = link.getAttribute("data-page");

        if (!page || !PAGE_LINKS[page]) return;

        event.preventDefault();

        window.location.href = PAGE_LINKS[page];

    });


    /* =====================================================
       HOME LOGO LINKS
    ====================================================== */

    document.addEventListener("click", function (event) {

        const homeLink = event.target.closest(".home-link");

        if (!homeLink) return;

        event.preventDefault();

        window.location.href = "index.html";

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ====================================================== */

    const currentFile = window.location.pathname.split("/").pop();

    const currentPage = currentFile.replace(".html", "");

    document.querySelectorAll("#navMenu [data-page]").forEach(function (link) {

        const page = link.getAttribute("data-page");

        const target = PAGE_LINKS[page];

        if (!target) return;

        const targetFile = target.split("/").pop();

        if (
            targetFile === currentFile ||
            (currentFile === "index.html" && page === "home")
        ) {
            link.classList.add("active");

            const parent = link.closest(".nav-item");

            if (parent) {
                parent.classList.add("active");
            }

            const dropdown = link.closest(".dropdown");

            if (dropdown) {
                dropdown.classList.add("active");
            }
        }
    });


    /* =====================================================
       CLOSE MENUS WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener("click", function (event) {

        if (!event.target.closest(".nav-item.dropdown")) {
            closeAllDropdowns();
        }

        if (
            navMenu &&
            mobileMenuButton &&
            !navMenu.contains(event.target) &&
            !mobileMenuButton.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeAllDropdowns();
            closeMobileMenu();
            closeChatbot();

        }
    });


    /* =====================================================
       BANNER SLIDER
    ====================================================== */

    const slides = Array.from(
        document.querySelectorAll(".banner-slide")
    );

    const prevButton = document.getElementById("prevBanner");
    const nextButton = document.getElementById("nextBanner");
    const dotsContainer = document.getElementById("sliderDots");
    const bannerSlider = document.getElementById("bannerSlider");

    let currentSlide = 0;
    let sliderTimer = null;

    function createSliderDots() {

        if (!dotsContainer || slides.length === 0) return;

        dotsContainer.innerHTML = "";

        slides.forEach(function (_, index) {

            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "slider-dot";
            dot.setAttribute("aria-label", "Go to banner " + (index + 1));

            dot.addEventListener("click", function () {
                showSlide(index);
                restartSlider();
            });

            dotsContainer.appendChild(dot);
        });
    }

    function updateSliderDots() {

        if (!dotsContainer) return;

        const dots = dotsContainer.querySelectorAll(".slider-dot");

        dots.forEach(function (dot, index) {

            dot.classList.toggle("active", index === currentSlide);

            dot.setAttribute(
                "aria-current",
                index === currentSlide ? "true" : "false"
            );
        });
    }

    function showSlide(index) {

        if (slides.length === 0) return;

        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        slides.forEach(function (slide, slideIndex) {

            slide.classList.toggle(
                "active",
                slideIndex === currentSlide
            );
        });

        updateSliderDots();
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    function stopSlider() {

        if (sliderTimer) {
            clearInterval(sliderTimer);
            sliderTimer = null;
        }
    }

    function startSlider() {

        if (slides.length <= 1) return;

        stopSlider();

        sliderTimer = setInterval(function () {
            nextSlide();
        }, SLIDER_INTERVAL);
    }

    function restartSlider() {
        stopSlider();
        startSlider();
    }

    createSliderDots();

    if (slides.length > 0) {
        showSlide(0);
        startSlider();
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            nextSlide();
            restartSlider();
        });
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            previousSlide();
            restartSlider();
        });
    }

    if (bannerSlider) {

        bannerSlider.addEventListener("mouseenter", stopSlider);
        bannerSlider.addEventListener("mouseleave", startSlider);
        bannerSlider.addEventListener("focusin", stopSlider);
        bannerSlider.addEventListener("focusout", startSlider);

    }

    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });

    document.addEventListener("keydown", function (event) {

        const activeElement = document.activeElement;

        const isTyping = activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.tagName === "SELECT"
            );

        if (isTyping) return;

        if (event.key === "ArrowRight") {
            nextSlide();
            restartSlider();
        }

        if (event.key === "ArrowLeft") {
            previousSlide();
            restartSlider();
        }
    });


    /* =====================================================
       LEGISLATIVE RECORD SEARCH
    ====================================================== */

    document.querySelectorAll(
        "#recordSearchForm, #legislativeSearchForm"
    ).forEach(function (form) {

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            const input = form.querySelector(
                'input[type="search"], input[type="text"]'
            );

            if (!input) return;

            const value = input.value.trim();

            if (!value) {
                alert("Please enter a search term.");
                input.focus();
                return;
            }

            alert(
                "Search interface only.\n\nYour search term:\n" + value
            );

        });
    });


    /* =====================================================
       REQUEST TRACKING
    ====================================================== */

    const trackingForm = document.getElementById("trackingForm");
    const trackingNumber = document.getElementById("trackingNumber");

    if (trackingForm && trackingNumber) {

        trackingForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const reference = trackingNumber.value.trim().toUpperCase();

            if (!reference) {
                alert("Please enter your request reference number.");
                trackingNumber.focus();
                return;
            }

            alert(
                "Request tracking UI only.\n\nReference number: " + reference
            );

        });
    }


    /* =====================================================
       FEEDBACK FORM
    ====================================================== */

    const feedbackForm = document.getElementById("feedbackForm");

    if (feedbackForm) {

        feedbackForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("feedbackName");
            const email = document.getElementById("feedbackEmail");
            const message = document.getElementById("feedbackMessage");

            if (!name || !name.value.trim()) {
                alert("Please enter your name.");
                if (name) name.focus();
                return;
            }

            if (!email || !email.value.trim()) {
                alert("Please enter your email address.");
                if (email) email.focus();
                return;
            }

            if (!message || !message.value.trim()) {
                alert("Please enter your feedback.");
                if (message) message.focus();
                return;
            }

            alert("Thank you for your feedback, " + name.value.trim() + "!");

            feedbackForm.reset();

        });
    }


    /* =====================================================
       LOGIN FORM
    ====================================================== */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const username = document.getElementById("username");
            const password = document.getElementById("password");

            if (!username || !username.value.trim()) {
                alert("Please enter your username.");
                if (username) username.focus();
                return;
            }

            if (!password || !password.value) {
                alert("Please enter your password.");
                if (password) password.focus();
                return;
            }

            alert("Login interface only. Authentication is not connected.");

        });
    }


    /* =====================================================
       ASK OSSP CHATBOT
    ====================================================== */

    const chatbotWidget = document.getElementById("chatbotWidget");
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotPanel = document.getElementById("chatbotPanel");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatbotForm = document.getElementById("chatbotForm");
    const chatbotInput = document.getElementById("chatbotInput");
    const chatbotMessages = document.getElementById("chatbotMessages");

    function openChatbot() {

        if (!chatbotWidget || !chatbotPanel) return;

        chatbotWidget.classList.add("open");
        chatbotPanel.classList.add("open");
        chatbotPanel.setAttribute("aria-hidden", "false");

        if (chatbotToggle) {
            chatbotToggle.setAttribute("aria-expanded", "true");
        }

        if (chatbotInput) {
            setTimeout(function () {
                chatbotInput.focus();
            }, 200);
        }
    }

    function closeChatbot() {

        if (!chatbotWidget || !chatbotPanel) return;

        chatbotWidget.classList.remove("open");
        chatbotPanel.classList.remove("open");
        chatbotPanel.setAttribute("aria-hidden", "true");

        if (chatbotToggle) {
            chatbotToggle.setAttribute("aria-expanded", "false");
        }
    }

    function toggleChatbot() {

        if (!chatbotPanel) return;

        if (chatbotPanel.classList.contains("open")) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }

    if (chatbotToggle) {
        chatbotToggle.addEventListener("click", toggleChatbot);
    }

    if (chatbotClose) {
        chatbotClose.addEventListener("click", closeChatbot);
    }

    function addChatMessage(message, sender) {

        if (!chatbotMessages) return;

        const messageElement = document.createElement("div");

        messageElement.classList.add(
            "chatbot-message",
            sender === "user"
                ? "chatbot-message-user"
                : "chatbot-message-bot"
        );

        messageElement.textContent = message;

        chatbotMessages.appendChild(messageElement);

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getChatbotResponse(message) {

        const text = message.toLowerCase().trim();

        if (
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("good morning") ||
            text.includes("good afternoon") ||
            text.includes("good evening")
        ) {
            return "Hello! Welcome to OSSP-TOM. How may we assist you today?";
        }

        if (
            text.includes("office") ||
            text.includes("address") ||
            text.includes("location")
        ) {
            return "The Office of the Secretary to the Sangguniang Panlungsod is part of the Quezon City Government. Please refer to the official OSSP contact information for office location and directions.";
        }

        if (text.includes("ordinance")) {
            return "You may visit the Legislative Records section to explore ordinances and related legislative documents.";
        }

        if (text.includes("resolution")) {
            return "You may visit the Legislative Records section to explore resolutions and related legislative documents.";
        }

        if (
            text.includes("certified true copy") ||
            text.includes("ctc")
        ) {
            return "You may visit Online Services and select Request Certified True Copy for information about this service.";
        }

        if (
            text.includes("tracking") ||
            text.includes("track request") ||
            text.includes("reference number")
        ) {
            return "You may use the Request Tracking section under Online Services to check your request.";
        }

        if (text.includes("announcement")) {
            return "Please visit the Announcements section for official notices, news, and public advisories.";
        }

        if (
            text.includes("directory") ||
            text.includes("personnel")
        ) {
            return "Please visit the Directory section for office and personnel information.";
        }

        if (
            text.includes("contact") ||
            text.includes("email") ||
            text.includes("phone")
        ) {
            return "For official inquiries, please visit the Directory or Contact section of the OSSP-TOM website.";
        }

        if (
            text.includes("thank you") ||
            text.includes("thanks")
        ) {
            return "You're welcome! Thank you for visiting OSSP-TOM.";
        }

        if (
            text.includes("help") ||
            text.includes("services")
        ) {
            return "I can help guide you through the website. You can ask about Legislative Records, Online Services, Announcements, Directory, and FAQs.";
        }

        return "Thank you for your message. For accurate assistance, please explore the relevant section of the OSSP-TOM website or contact the Office directly through its official channels.";
    }

    if (chatbotForm && chatbotInput) {

        chatbotForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message = chatbotInput.value.trim();

            if (!message) {
                chatbotInput.focus();
                return;
            }

            addChatMessage(message, "user");

            chatbotInput.value = "";

            setTimeout(function () {

                addChatMessage(
                    getChatbotResponse(message),
                    "bot"
                );

            }, 500);

        });
    }

    document.addEventListener("click", function (event) {

        if (
            chatbotWidget &&
            chatbotPanel &&
            chatbotPanel.classList.contains("open") &&
            !chatbotWidget.contains(event.target)
        ) {
            closeChatbot();
        }
    });


    /* =====================================================
       NAVIGATION SHADOW
    ====================================================== */

    const mainNavigation = document.querySelector(".main-navigation");

    function updateNavigationShadow() {

        if (!mainNavigation) return;

        mainNavigation.style.boxShadow =
            window.scrollY > 20
                ? "0 6px 20px rgba(0, 0, 0, 0.14)"
                : "0 3px 15px rgba(0, 0, 0, 0.08)";
    }

    window.addEventListener("scroll", updateNavigationShadow);

    updateNavigationShadow();


    /* =====================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > MOBILE_BREAKPOINT) {
            closeMobileMenu();
        }
    });


    /* =====================================================
       INITIALIZE WEBSITE
    ====================================================== */

    closeAllDropdowns();
    closeMobileMenu();
    closeChatbot();

    console.log("OSSP-TOM UI initialized.");
    console.log("Direct HTML navigation enabled.");
    console.log("No server or fetch required.");

});
