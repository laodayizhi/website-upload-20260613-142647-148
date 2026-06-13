import { H as Hls } from './hls-vendor-dru42stk.js';

function setupPlayer(container) {
  var video = container.querySelector('video');
  var startButton = container.querySelector('[data-play-button]');
  if (!video) {
    return;
  }

  var playUrl = video.getAttribute('data-play');
  var hlsInstance = null;

  if (playUrl && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });
    hlsInstance.loadSource(playUrl);
    hlsInstance.attachMedia(video);
    hlsInstance.on(Hls.Events.ERROR, function (event, data) {
      if (!data || !data.fatal) {
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hlsInstance.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hlsInstance.recoverMediaError();
      } else {
        hlsInstance.destroy();
      }
    });
  } else if (playUrl && video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = playUrl;
  }

  if (startButton) {
    startButton.addEventListener('click', function () {
      video.play().catch(function () {});
      startButton.classList.add('is-hidden');
    });
  }

  video.addEventListener('play', function () {
    if (startButton) {
      startButton.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

document.querySelectorAll('[data-player]').forEach(setupPlayer);
