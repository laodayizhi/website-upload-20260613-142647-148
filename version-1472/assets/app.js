(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;
        var show = function (index) {
            if (!slides.length) return;
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        };
        var start = function () {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        };
        var restart = function () {
            if (timer) window.clearInterval(timer);
            start();
        };
        var next = hero.querySelector('[data-hero-next]');
        var prev = hero.querySelector('[data-hero-prev]');
        if (next) next.addEventListener('click', function () { show(current + 1); restart(); });
        if (prev) prev.addEventListener('click', function () { show(current - 1); restart(); });
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });
        start();
    }

    var searchForm = document.querySelector('[data-search-form]');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            var input = searchForm.querySelector('input[name="keyword"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    }

    var localForms = Array.prototype.slice.call(document.querySelectorAll('[data-local-search]'));
    localForms.forEach(function (form) {
        var input = form.querySelector('[data-search-input]');
        var list = document.querySelector('[data-card-list]');
        if (!input || !list) return;
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('keyword');
        if (initial) input.value = initial;
        var apply = function () {
            var value = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || '')).toLowerCase();
                card.classList.toggle('is-hidden', value && haystack.indexOf(value) === -1);
            });
        };
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apply();
        });
        input.addEventListener('input', apply);
        apply();
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play-button]');
        var url = box.getAttribute('data-video-url');
        var ready = false;
        var hlsInstance = null;
        if (!video || !url) return;
        var prepare = function () {
            if (ready) return;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
            } else {
                video.src = url;
            }
            ready = true;
        };
        var play = function () {
            prepare();
            box.classList.add('play-started');
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    box.classList.remove('play-started');
                });
            }
        };
        if (button) button.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (!ready || video.paused) play();
        });
        video.addEventListener('play', function () {
            box.classList.add('play-started');
        });
        window.addEventListener('pagehide', function () {
            if (hlsInstance) hlsInstance.destroy();
        });
    });
})();
