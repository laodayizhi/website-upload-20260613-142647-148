(function() {
    var header = document.querySelector("[data-header]");
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    function onScroll() {
        if (!header) {
            return;
        }
        if (window.scrollY > 18) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function() {
            mobileNav.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-hero]").forEach(function(hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function render(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function() {
                render(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function() {
                render(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                render(index + 1);
                restart();
            });
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener("click", function() {
                render(dotIndex);
                restart();
            });
        });

        render(0);
        restart();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function(scope) {
        var section = scope.closest("section") || document;
        var input = section.querySelector("[data-filter-input]") || document.querySelector("[data-filter-input]");
        var typeSelect = section.querySelector("[data-filter-type]");
        var regionSelect = section.querySelector("[data-filter-region]");
        var yearSelect = section.querySelector("[data-filter-year]");
        var emptyState = section.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

        function fillSelect(select, attribute) {
            if (!select) {
                return;
            }
            var values = cards.map(function(card) {
                return card.getAttribute(attribute) || "";
            }).filter(Boolean);
            values = Array.from(new Set(values)).sort(function(a, b) {
                if (/^\d+$/.test(a) && /^\d+$/.test(b)) {
                    return Number(b) - Number(a);
                }
                return a.localeCompare(b, "zh-Hans-CN");
            });
            values.forEach(function(value) {
                var option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        fillSelect(typeSelect, "data-type");
        fillSelect(regionSelect, "data-region");
        fillSelect(yearSelect, "data-year");

        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : "";
            var typeValue = typeSelect ? typeSelect.value : "";
            var regionValue = regionSelect ? regionSelect.value : "";
            var yearValue = yearSelect ? yearSelect.value : "";
            var shown = 0;

            cards.forEach(function(card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-year"),
                    card.textContent
                ].join(" ").toLowerCase();
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (typeValue && card.getAttribute("data-type") !== typeValue) {
                    matched = false;
                }
                if (regionValue && card.getAttribute("data-region") !== regionValue) {
                    matched = false;
                }
                if (yearValue && card.getAttribute("data-year") !== yearValue) {
                    matched = false;
                }

                card.style.display = matched ? "" : "none";
                if (matched) {
                    shown += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", shown === 0);
            }
        }

        [input, typeSelect, regionSelect, yearSelect].forEach(function(control) {
            if (control) {
                control.addEventListener("input", applyFilter);
                control.addEventListener("change", applyFilter);
            }
        });
    });
}());
