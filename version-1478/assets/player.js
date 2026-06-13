(function () {
    function initMoviePlayer(videoId, overlayId, videoUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var hlsInstance = null;

        if (!video || !overlay || !videoUrl) {
            return;
        }

        function bindSource() {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (!video.getAttribute("src")) {
                    video.setAttribute("src", videoUrl);
                }
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!hlsInstance) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(videoUrl);
                    hlsInstance.attachMedia(video);
                }
                return;
            }

            if (!video.getAttribute("src")) {
                video.setAttribute("src", videoUrl);
            }
        }

        function playVideo() {
            overlay.classList.add("is-hidden");
            bindSource();
            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    overlay.classList.remove("is-hidden");
                });
            }
        }

        overlay.addEventListener("click", playVideo);

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener("play", function () {
            overlay.classList.add("is-hidden");
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
