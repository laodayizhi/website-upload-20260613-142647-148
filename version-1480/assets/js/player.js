(function () {
    var video = document.querySelector('[data-player]');

    if (!video) {
        return;
    }

    var overlay = document.querySelector('.play-overlay');
    var stream = video.getAttribute('data-stream');
    var loaded = false;
    var hls = null;

    function loadVideo() {
        if (loaded || !stream) {
            return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            video.hlsPlayer = hls;
            return;
        }

        video.src = stream;
    }

    function startPlayback() {
        loadVideo();

        if (overlay) {
            overlay.classList.add('is-hidden');
            overlay.hidden = true;
        }

        var playTask = video.play();

        if (playTask && typeof playTask.catch === 'function') {
            playTask.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
        if (!loaded) {
            startPlayback();
        }
    });

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('is-hidden');
            overlay.hidden = true;
        }
    });

    window.addEventListener('pagehide', function () {
        if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
        }
    });
})();
