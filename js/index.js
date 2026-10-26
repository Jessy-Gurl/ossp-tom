/* =========================================================
   OSSP-TOM WEBSITE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const navMenu =
        document.getElementById("navMenu");


    if (mobileMenuButton && navMenu) {

        mobileMenuButton.addEventListener(
            "click",
            function () {

                const isOpen =
                    navMenu.classList.toggle("open");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );

    }


    /* =====================================================
       ONLINE SERVICES DROPDOWN
    ====================================================== */

    const dropdown =
        document.querySelector(".dropdown");

    const dropdownButton =
        document.querySelector(".dropdown-button");


    if (dropdown && dropdownButton) {

        dropdownButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const isOpen =
                    dropdown.classList.toggle("open");

                dropdownButton.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );

    }


    /* =====================================================
       CLOSE DROPDOWN
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                dropdown &&
                !dropdown.contains(event.target)
            ) {

                dropdown.classList.remove("open");

                if (dropdownButton) {

                    dropdownButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU AFTER CLICK
    ====================================================== */

    const navLinks =
        document.querySelectorAll(
            ".nav-menu a"
        );


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (window.innerWidth <= 768) {

                    navMenu.classList.remove("open");

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    });



    /* =====================================================
       10-BANNER SLIDER
    ====================================================== */

    const slides =
        document.querySelectorAll(
            ".banner-slide"
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


    let currentSlide = 0;

    let sliderTimer;


    /* =====================================================
       CREATE DOTS
    ====================================================== */

    if (
        slides.length > 0 &&
        dotsContainer
    ) {

        slides.forEach(
            function (_, index) {

                const dot =
                    document.createElement(
                        "button"
                    );

                dot.type = "button";

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

                        showSlide(index);

                        restartSlider();

                    }
                );

                dotsContainer.appendChild(dot);

            }
        );

    }


    const dots =
        document.querySelectorAll(
            ".slider-dot"
        );


    /* =====================================================
       SHOW SLIDE
    ====================================================== */

    function showSlide(index) {

        if (slides.length === 0) {
            return;
        }


        if (index >= slides.length) {

            currentSlide = 0;

        }
        else if (index < 0) {

            currentSlide =
                slides.length - 1;

        }
        else {

            currentSlide = index;

        }


        slides.forEach(
            function (slide, slideIndex) {

                slide.classList.toggle(
                    "active",
                    slideIndex === currentSlide
                );

            }
        );


        dots.forEach(
            function (dot, dotIndex) {

                dot.classList.toggle(
                    "active",
                    dotIndex === currentSlide
                );

            }
        );

    }


    /* =====================================================
       NEXT
    ====================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                showSlide(
                    currentSlide + 1
                );

                restartSlider();

            }
        );

    }


    /* =====================================================
       PREVIOUS
    ====================================================== */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                showSlide(
                    currentSlide - 1
                );

                restartSlider();

            }
        );

    }


    /* =====================================================
       AUTO SLIDE
    ====================================================== */

    function startSlider() {

        sliderTimer =
            setInterval(
                function () {

                    showSlide(
                        currentSlide + 1
                    );

                },
                6000
            );

    }


    /* =====================================================
       RESTART SLIDER
    ====================================================== */

    function restartSlider() {

        clearInterval(
            sliderTimer
        );

        startSlider();

    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    if (slides.length > 0) {

        showSlide(0);

        startSlider();

    }



    /* =====================================================
       LEGISLATIVE RECORD SEARCH
    ====================================================== */

    const searchForm =
        document.getElementById(
            "recordSearchForm"
        );

    const searchInput =
        document.getElementById(
            "recordSearch"
        );


    if (searchForm && searchInput) {

        searchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const searchValue =
                    searchInput.value.trim();


                if (searchValue === "") {

                    alert(
                        "Please enter a title, number, keyword or year."
                    );

                    searchInput.focus();

                    return;

                }


                alert(
                    "Searching legislative records for: " +
                    searchValue
                );

            }
        );

    }



    /* =====================================================
       NAVIGATION SHADOW
    ====================================================== */

    const navigation =
        document.querySelector(
            ".main-navigation"
        );


    window.addEventListener(
        "scroll",
        function () {

            if (!navigation) {
                return;
            }


            if (window.scrollY > 20) {

                navigation.style.boxShadow =
                    "0 5px 20px rgba(0,0,0,0.12)";

            }
            else {

                navigation.style.boxShadow =
                    "0 3px 15px rgba(0,0,0,0.06)";

            }

        }
    );



    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {


                if (dropdown) {

                    dropdown.classList.remove(
                        "open"
                    );

                }


                if (dropdownButton) {

                    dropdownButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }


                if (
                    navMenu &&
                    window.innerWidth <= 768
                ) {

                    navMenu.classList.remove(
                        "open"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );

});