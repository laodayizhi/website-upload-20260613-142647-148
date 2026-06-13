(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-target-slide]"));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === current);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var index = Number(dot.getAttribute("data-target-slide") || "0");
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterInput = document.querySelector(".page-filter");
    var yearFilter = document.querySelector(".year-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function applyFilter() {
        if (!cards.length) {
            return;
        }

        var keyword = normalize(filterInput ? filterInput.value : "");
        var year = normalize(yearFilter ? yearFilter.value : "");

        cards.forEach(function (card) {
            var text = normalize(card.textContent + " " + Array.prototype.map.call(card.attributes, function (attr) {
                return attr.value;
            }).join(" "));
            var yearValue = normalize(card.getAttribute("data-year"));
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchYear = !year || yearValue === year;

            card.classList.toggle("is-hidden", !(matchKeyword && matchYear));
        });
    }

    if (filterInput) {
        filterInput.addEventListener("input", applyFilter);
    }

    if (yearFilter) {
        yearFilter.addEventListener("change", applyFilter);
    }

    var searchParams = new URLSearchParams(window.location.search);
    var query = searchParams.get("q");
    var globalSearchInput = document.getElementById("globalSearchInput");

    if (query && globalSearchInput) {
        globalSearchInput.value = query;
        applyFilter();
    }
})();
