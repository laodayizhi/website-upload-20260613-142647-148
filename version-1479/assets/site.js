(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".hero-tab"));
    if (!slides.length || !tabs.length) {
      return;
    }
    var activeIndex = 0;
    var timer = null;
    function show(index) {
      activeIndex = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      tabs.forEach(function (tab, tabIndex) {
        tab.classList.toggle("is-active", tabIndex === index);
      });
    }
    function next() {
      show((activeIndex + 1) % slides.length);
    }
    function start() {
      stop();
      timer = window.setInterval(next, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        show(index);
        start();
      });
    });
    var hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }
    start();
  }

  function setupFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    inputs.forEach(function (input) {
      var targetSelector = input.getAttribute("data-filter-input");
      var root = targetSelector ? document.querySelector(targetSelector) : document;
      var cards = root ? Array.prototype.slice.call(root.querySelectorAll("[data-filter-card]")) : [];
      var empty = document.querySelector("[data-filter-empty]");
      input.addEventListener("input", function () {
        var keyword = input.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var text = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-meta") || "")).toLowerCase();
          var match = !keyword || text.indexOf(keyword) !== -1;
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildSearchCard(item) {
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="' + escapeHtml(item.url) + '" aria-label="' + escapeHtml(item.title) + '">',
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="rank-badge">' + escapeHtml(item.year) + '</span>',
      '<span class="play-mark">▶</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<h2><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h2>',
      '<p class="movie-meta">' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + ' · ' + escapeHtml(item.year) + '</p>',
      '<p class="movie-line">' + escapeHtml(item.oneLine) + '</p>',
      '<div class="tag-row"><span>' + escapeHtml(item.genre) + '</span><span>' + escapeHtml(item.category) + '</span></div>',
      '</div>',
      '</article>'
    ].join("");
  }

  function setupSearchPage() {
    var container = document.querySelector("[data-search-results]");
    var title = document.querySelector("[data-search-title]");
    if (!container || !window.SEARCH_ITEMS) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var items = window.SEARCH_ITEMS;
    if (query) {
      var lower = query.toLowerCase();
      items = items.filter(function (item) {
        return [item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine, item.category]
          .join(" ")
          .toLowerCase()
          .indexOf(lower) !== -1;
      });
    } else {
      items = items.slice(0, 36);
    }
    if (title) {
      title.textContent = query ? "搜索：" + query : "热门影视推荐";
    }
    if (!items.length) {
      container.innerHTML = '<div class="search-empty">暂无匹配影片</div>';
      return;
    }
    container.innerHTML = items.slice(0, 120).map(buildSearchCard).join("");
  }

  window.initMoviePlayer = function (playbackUrl) {
    onReady(function () {
      var video = document.querySelector("[data-player-video]");
      var overlay = document.querySelector("[data-player-overlay]");
      if (!video || !playbackUrl) {
        return;
      }
      var attached = false;
      function attachUrl() {
        if (attached) {
          return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = playbackUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(playbackUrl);
          hls.attachMedia(video);
        } else {
          video.src = playbackUrl;
        }
      }
      function play() {
        attachUrl();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }
      if (overlay) {
        overlay.addEventListener("click", play);
      }
      video.addEventListener("click", function () {
        if (!attached || video.paused) {
          play();
        }
      });
    });
  };

  if (window.__PLAYBACK_URL__) {
    window.initMoviePlayer(window.__PLAYBACK_URL__);
  }

  onReady(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
