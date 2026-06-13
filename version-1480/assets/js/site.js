(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var thumbs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-thumb]'));
        var current = 0;
        var timer = null;

        function setHero(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('active', itemIndex === current);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('active', itemIndex === current);
            });
            thumbs.forEach(function (thumb, itemIndex) {
                thumb.classList.toggle('active', itemIndex === current);
            });
        }

        function startHero() {
            stopHero();
            timer = window.setInterval(function () {
                setHero(current + 1);
            }, 5200);
        }

        function stopHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                setHero(Number(dot.getAttribute('data-hero-dot')) || 0);
                startHero();
            });
        });

        thumbs.forEach(function (thumb) {
            thumb.addEventListener('mouseenter', function () {
                setHero(Number(thumb.getAttribute('data-hero-thumb')) || 0);
                stopHero();
            });
            thumb.addEventListener('mouseleave', startHero);
        });

        startHero();
    }

    var filterInput = document.querySelector('.filter-input');
    var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    function applyFilter(value) {
        var keyword = (value || '').trim().toLowerCase();
        var visible = 0;
        filterCards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var match = !keyword || text.indexOf(keyword) !== -1;
            card.hidden = !match;
            if (match) {
                visible += 1;
            }
        });
        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (query) {
            filterInput.value = query;
        }
        applyFilter(filterInput.value);
        filterInput.addEventListener('input', function () {
            applyFilter(filterInput.value);
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-search-form]')).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    });
})();
