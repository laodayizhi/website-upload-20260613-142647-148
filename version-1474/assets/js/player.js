(function () {
  function initVideoPlayer(source) {
    var video = document.querySelector('[data-player-video]');
    var poster = document.querySelector('[data-player-poster]');
    var button = document.querySelector('[data-player-button]');
    var attached = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function begin() {
      if (attached) {
        video.play().catch(function () {});
        return;
      }

      attached = true;
      video.setAttribute('controls', 'controls');

      if (poster) {
        poster.classList.add('is-hidden');
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        return;
      }

      video.src = source;
      video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener('click', begin);
    }

    if (poster) {
      poster.addEventListener('click', begin);
    }

    video.addEventListener('click', function () {
      if (!attached) {
        begin();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.initVideoPlayer = initVideoPlayer;
})();
