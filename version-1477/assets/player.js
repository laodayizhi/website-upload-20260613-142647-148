(function () {
    function startMoviePlayer(source) {
        var video = document.getElementById('movieVideo');
        var cover = document.querySelector('.player-cover');
        var hls = null;

        if (!video || !source) {
            return;
        }

        function attachSource() {
            if (video.getAttribute('data-ready') === '1') {
                return;
            }

            video.setAttribute('data-ready', '1');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hls.loadSource(source);
                hls.attachMedia(video);
                return;
            }

            video.src = source;
        }

        function play() {
            attachSource();

            if (cover) {
                cover.classList.add('is-hidden');
            }

            video.controls = true;

            var attempt = video.play();

            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.startMoviePlayer = startMoviePlayer;
})();
