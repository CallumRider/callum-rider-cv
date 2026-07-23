/* ==================================================
   CALLUM RIDER PORTFOLIO
   Main JavaScript
================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    initialiseCarousel(prefersReducedMotion);
    initialiseCounters(prefersReducedMotion);
    initialiseTimeline(prefersReducedMotion);
    initialiseMobileMenu();
    initialiseUkrocCaseStudy();
    initialiseAchievementAccordions();
});


/* ==================================================
   CADET PHOTO CAROUSEL
================================================== */

function initialiseCarousel(prefersReducedMotion) {
    const carousel = document.querySelector(".cadet-carousel");
    const track = document.getElementById("carousel-track");
    const dotsContainer = document.getElementById("carousel-dots");

    if (!carousel || !track || !dotsContainer) {
        return;
    }

    const photos = Array.from(track.querySelectorAll("img"));
    const totalPhotos = photos.length;

    if (totalPhotos === 0) {
        return;
    }

    let currentPhoto = 0;
    let timerId = null;
    let touchStartX = 0;

    dotsContainer.replaceChildren();
    carousel.setAttribute("tabindex", "0");

    const dots = photos.map((photo, index) => {
        const dot = document.createElement("span");

        dot.setAttribute("role", "button");
        dot.setAttribute("tabindex", "0");
        dot.setAttribute("aria-label", `Show cadet photo ${index + 1}`);
        dot.setAttribute("aria-current", index === 0 ? "true" : "false");

        if (index === 0) {
            dot.classList.add("active");
        }

        const selectPhoto = () => {
            currentPhoto = index;
            updateCarousel();
            restartTimer();
        };

        dot.addEventListener("click", selectPhoto);

        dot.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectPhoto();
            }
        });

        dotsContainer.appendChild(dot);
        return dot;
    });

    function updateCarousel() {
        track.style.transform = `translateX(-${currentPhoto * 100}%)`;

        dots.forEach((dot, index) => {
            const isCurrent = index === currentPhoto;

            dot.classList.toggle("active", isCurrent);
            dot.setAttribute("aria-current", String(isCurrent));
        });
    }

    function changePhoto(direction) {
        currentPhoto =
            (currentPhoto + direction + totalPhotos) % totalPhotos;

        updateCarousel();
        restartTimer();
    }

    function stopTimer() {
        if (timerId !== null) {
            window.clearInterval(timerId);
            timerId = null;
        }
    }

    function startTimer() {
        if (prefersReducedMotion || totalPhotos < 2 || timerId !== null) {
            return;
        }

        timerId = window.setInterval(() => {
            currentPhoto = (currentPhoto + 1) % totalPhotos;
            updateCarousel();
        }, 5000);
    }

    function restartTimer() {
        stopTimer();
        startTimer();
    }

    window.changePhoto = changePhoto;

    carousel.addEventListener("mouseenter", stopTimer);
    carousel.addEventListener("mouseleave", startTimer);
    carousel.addEventListener("focusin", stopTimer);
    carousel.addEventListener("focusout", startTimer);

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            changePhoto(-1);
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            changePhoto(1);
        }
    });

    carousel.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.changedTouches[0].clientX;
        },
        { passive: true }
    );

    carousel.addEventListener(
        "touchend",
        (event) => {
            const touchEndX = event.changedTouches[0].clientX;
            const distance = touchStartX - touchEndX;

            if (Math.abs(distance) < 45) {
                return;
            }

            changePhoto(distance > 0 ? 1 : -1);
        },
        { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    updateCarousel();
    startTimer();
}


/* ==================================================
   STATISTICS COUNTERS
================================================== */

function initialiseCounters(prefersReducedMotion) {
    const counters = document.querySelectorAll(".counter");

    if (counters.length === 0) {
        return;
    }

    function setFinalValue(counter) {
        const target = Number(counter.dataset.target);

        if (Number.isFinite(target)) {
            counter.textContent = `${target}+`;
        }
    }

    function animateCounter(counter) {
        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target)) {
            return;
        }

        if (prefersReducedMotion) {
            setFinalValue(counter);
            return;
        }

        const duration = 1200;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const value = Math.ceil(target * easedProgress);

            counter.textContent = `${Math.min(value, target)}+`;

            if (progress < 1) {
                window.requestAnimationFrame(update);
            }
        }

        window.requestAnimationFrame(update);
    }

    if (!("IntersectionObserver" in window)) {
        counters.forEach(setFinalValue);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.45
        }
    );

    counters.forEach((counter) => observer.observe(counter));
}


/* ==================================================
   TIMELINE REVEAL
================================================== */

function initialiseTimeline(prefersReducedMotion) {
    const timelineItems = document.querySelectorAll(".timeline-item");

    if (timelineItems.length === 0) {
        return;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        timelineItems.forEach((item) => item.classList.add("show"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.2
        }
    );

    timelineItems.forEach((item) => observer.observe(item));
}


/* ==================================================
   RESPONSIVE MOBILE MENU
================================================== */

function initialiseMobileMenu() {
    const menuButton = document.getElementById("site-menu-button");
    const mobileMenu = document.getElementById("site-mobile-menu");

    if (!menuButton || !mobileMenu) {
        return;
    }

    function isMenuOpen() {
        return mobileMenu.classList.contains("is-open");
    }

    function setMenuState(open) {
        menuButton.classList.toggle("is-open", open);
        mobileMenu.classList.toggle("is-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute(
            "aria-label",
            open ? "Close navigation" : "Open navigation"
        );
    }

    function closeMobileMenu() {
        setMenuState(false);
    }

    menuButton.addEventListener("click", () => {
        setMenuState(!isMenuOpen());
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            isMenuOpen() &&
            !mobileMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isMenuOpen()) {
            closeMobileMenu();
            menuButton.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
            closeMobileMenu();
        }
    });
}


/* ==================================================
   UKROC CASE-STUDY DIALOG
================================================== */

function initialiseUkrocCaseStudy() {
    const dialog = document.getElementById("ukroc-case-study");
    const openButton = document.getElementById("open-ukroc-case-study");
    const closeButton = document.getElementById("close-ukroc-case-study");

    if (!dialog || !openButton || !closeButton) {
        return;
    }

    let previouslyFocusedElement = null;

    function openCaseStudy() {
        previouslyFocusedElement = document.activeElement;

        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }

        document.body.classList.add("dialog-open");
        closeButton.focus();
    }

    function closeCaseStudy() {
        if (typeof dialog.close === "function" && dialog.open) {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
            document.body.classList.remove("dialog-open");
        }

        if (
            previouslyFocusedElement &&
            typeof previouslyFocusedElement.focus === "function"
        ) {
            previouslyFocusedElement.focus();
        }
    }

    openButton.addEventListener("click", openCaseStudy);
    closeButton.addEventListener("click", closeCaseStudy);

    dialog.addEventListener("close", () => {
        document.body.classList.remove("dialog-open");
    });

    dialog.addEventListener("cancel", () => {
        document.body.classList.remove("dialog-open");
    });

    dialog.addEventListener("click", (event) => {
        const box = dialog.getBoundingClientRect();
        const clickedOutside =
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom;

        if (clickedOutside) {
            closeCaseStudy();
        }
    });
}


/* ==================================================
   ACHIEVEMENT ACCORDIONS
================================================== */

function initialiseAchievementAccordions() {
    const buttons = document.querySelectorAll(".achievement-toggle");

    if (buttons.length === 0) {
        return;
    }

    buttons.forEach((button, index) => {
        const card = button.closest(".achievement-card");
        const info = button.nextElementSibling;
        const arrow = button.querySelector("span");

        if (!card || !info || !arrow) {
            return;
        }

        if (!info.id) {
            info.id = `achievement-info-${index + 1}`;
        }

        button.setAttribute("aria-controls", info.id);
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", () => {
            const isOpen =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isOpen));
            card.classList.toggle("active", !isOpen);
            arrow.textContent = isOpen ? "▼" : "▲";
            info.style.maxHeight = isOpen
                ? null
                : `${info.scrollHeight}px`;
        });
    });

    window.addEventListener("resize", () => {
        buttons.forEach((button) => {
            if (button.getAttribute("aria-expanded") !== "true") {
                return;
            }

            const info = button.nextElementSibling;

            if (info) {
                info.style.maxHeight = `${info.scrollHeight}px`;
            }
        });
    });
}
