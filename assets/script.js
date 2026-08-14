(() => {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function initMobileMenu() {
        const button = document.getElementById("site-menu-button");
        const menu = document.getElementById("site-mobile-menu");

        if (!button || !menu) return;

        const setMenu = (open) => {
            button.classList.toggle("is-open", open);
            menu.classList.toggle("is-open", open);
            button.setAttribute("aria-expanded", String(open));
            button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        };

        button.addEventListener("click", () => {
            setMenu(button.getAttribute("aria-expanded") !== "true");
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenu(false));
        });

        document.addEventListener("click", (event) => {
            if (!menu.classList.contains("is-open")) return;
            if (menu.contains(event.target) || button.contains(event.target)) return;
            setMenu(false);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") setMenu(false);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1050) setMenu(false);
        });
    }

    function initCarousel() {
        const track = document.getElementById("carousel-track");
        const dotsContainer = document.getElementById("carousel-dots");
        const carousel = document.querySelector(".cadet-carousel");

        if (!track || !dotsContainer || !carousel) return;

        const photos = [...track.querySelectorAll("img")];
        if (!photos.length) return;

        let currentPhoto = 0;
        let autoplayTimer = null;

        const dots = photos.map((photo, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Show cadet photo ${index + 1}`);
            dot.addEventListener("click", () => {
                currentPhoto = index;
                updateCarousel();
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
            return dot;
        });

        function updateCarousel() {
            track.style.transform = `translateX(-${currentPhoto * 100}%)`;
            dots.forEach((dot, index) => {
                const active = index === currentPhoto;
                dot.classList.toggle("active", active);
                dot.setAttribute("aria-current", active ? "true" : "false");
            });
        }

        function changePhoto(direction) {
            currentPhoto = (currentPhoto + direction + photos.length) % photos.length;
            updateCarousel();
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                window.clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function startAutoplay() {
            if (reducedMotion || photos.length < 2 || document.hidden) return;
            stopAutoplay();
            autoplayTimer = window.setInterval(() => changePhoto(1), 5500);
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        window.changePhoto = (direction) => {
            changePhoto(direction);
            restartAutoplay();
        };

        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);
        carousel.addEventListener("focusin", stopAutoplay);
        carousel.addEventListener("focusout", startAutoplay);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) stopAutoplay();
            else startAutoplay();
        });

        updateCarousel();
        startAutoplay();
    }

    function initCounters() {
        const counters = [...document.querySelectorAll(".counter[data-target]")];
        if (!counters.length) return;

        const completeCounter = (counter) => {
            counter.textContent = counter.dataset.target || "0";
        };

        if (reducedMotion || !("IntersectionObserver" in window)) {
            counters.forEach(completeCounter);
            return;
        }

        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const target = Number(counter.dataset.target || 0);
                const duration = 900;
                const start = performance.now();

                const tick = (time) => {
                    const progress = Math.min((time - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = String(Math.round(target * eased));

                    if (progress < 1) requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
                instance.unobserve(counter);
            });
        }, { threshold: 0.35 });

        counters.forEach((counter) => observer.observe(counter));
    }

    function initTimeline() {
        const items = [...document.querySelectorAll(".timeline-item")];
        if (!items.length) return;

        if (reducedMotion || !("IntersectionObserver" in window)) {
            items.forEach((item) => item.classList.add("show"));
            return;
        }

        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("show");
                instance.unobserve(entry.target);
            });
        }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

        items.forEach((item) => observer.observe(item));
    }

    function initAchievements() {
        document.querySelectorAll(".achievement-toggle").forEach((button) => {
            button.addEventListener("click", () => {
                const card = button.closest(".achievement-card");
                const info = button.nextElementSibling;
                const arrow = button.querySelector("span");
                const opening = button.getAttribute("aria-expanded") !== "true";

                button.setAttribute("aria-expanded", String(opening));
                card?.classList.toggle("active", opening);

                if (info) {
                    info.style.maxHeight = opening ? `${info.scrollHeight}px` : "0px";
                }

                if (arrow) arrow.textContent = opening ? "▲" : "▼";
            });
        });
    }

    function initCaseStudy() {
        const dialog = document.getElementById("ukroc-case-study");
        const openButton = document.getElementById("open-ukroc-case-study");
        const closeButton = document.getElementById("close-ukroc-case-study");

        if (!dialog || !openButton || !closeButton) return;

        const openDialog = () => {
            if (typeof dialog.showModal === "function") {
                dialog.showModal();
                document.body.classList.add("dialog-open");
                closeButton.focus();
            }
        };

        const closeDialog = () => {
            if (dialog.open) dialog.close();
        };

        openButton.addEventListener("click", openDialog);
        closeButton.addEventListener("click", closeDialog);

        dialog.addEventListener("click", (event) => {
            const rect = dialog.getBoundingClientRect();
            const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom;
            if (!inside) closeDialog();
        });

        dialog.addEventListener("close", () => {
            document.body.classList.remove("dialog-open");
            openButton.focus();
        });
    }

    function initActiveNavigation() {
        const ids = ["about", "experience", "cadets", "achievements", "projects", "education", "references", "contact"];
        const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
        const links = [...document.querySelectorAll('.site-desktop-links a[href^="#"], .site-mobile-menu a[href^="#"]')];

        if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

        const setActive = (id) => {
            links.forEach((link) => {
                const active = link.getAttribute("href") === `#${id}`;
                link.classList.toggle("active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        };

        const visible = new Map();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => visible.set(entry.target.id, entry.intersectionRatio));

            const current = [...visible.entries()]
                .filter(([, ratio]) => ratio > 0)
                .sort((a, b) => b[1] - a[1])[0];

            if (current) setActive(current[0]);
        }, {
            rootMargin: "-18% 0px -58% 0px",
            threshold: [0.05, 0.2, 0.45, 0.7]
        });

        sections.forEach((section) => observer.observe(section));
    }

    document.addEventListener("DOMContentLoaded", () => {
        initMobileMenu();
        initCarousel();
        initCounters();
        initTimeline();
        initAchievements();
        initCaseStudy();
        initActiveNavigation();
    });
})();
