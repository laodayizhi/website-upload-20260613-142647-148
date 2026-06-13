(function () {
  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function bindMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-nav]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function bindPosters() {
    document.querySelectorAll('img[data-poster]').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
      });
    });
  }

  function readCardText(card) {
    return normalize([
      card.getAttribute('data-title'),
      card.getAttribute('data-year'),
      card.getAttribute('data-region'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-tags')
    ].join(' '));
  }

  function bindPageFilters() {
    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var year = scope.querySelector('[data-year-filter]');
      var count = scope.querySelector('[data-filter-count]');
      var empty = scope.querySelector('[data-empty-filter]');
      var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .library-links a'));

      function update() {
        var keyword = normalize(input ? input.value : '');
        var selectedYear = year ? year.value : '';
        var visible = 0;

        items.forEach(function (item) {
          var text = readCardText(item);
          var itemYear = item.getAttribute('data-year') || '';
          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedYear = !selectedYear || itemYear === selectedYear;
          var matched = matchedKeyword && matchedYear;
          item.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部';
        }
        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }

      if (input) {
        input.addEventListener('input', update);
      }
      if (year) {
        year.addEventListener('change', update);
      }
      update();
    });
  }

  function movieCard(movie) {
    return [
      '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-year="' + escapeHtml(movie.year) + '" data-region="' + escapeHtml(movie.region) + '" data-genre="' + escapeHtml(movie.genre) + '" data-tags="' + escapeHtml((movie.tags || []).join(' ')) + '">',
      '  <a href="' + escapeHtml(movie.url) + '" class="movie-card-link">',
      '    <span class="poster-frame">',
      '      <span class="poster-backdrop">' + escapeHtml(movie.title) + '</span>',
      '      <img data-poster src="' + escapeHtml(movie.poster) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '      <span class="poster-shade"></span>',
      '      <span class="poster-play">▶</span>',
      '      <span class="badge badge-region">' + escapeHtml(movie.region) + '</span>',
      '      <span class="badge badge-year">' + escapeHtml(movie.year) + '</span>',
      '    </span>',
      '    <span class="movie-card-info">',
      '      <strong>' + escapeHtml(movie.title) + '</strong>',
      '      <small>' + escapeHtml(movie.genre) + '</small>',
      '      <em>' + escapeHtml(movie.oneLine || '') + '</em>',
      '    </span>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return (value || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function bindSearchPage() {
    var root = document.querySelector('[data-search-root]');
    if (!root || !window.MOVIE_INDEX) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var input = root.querySelector('[data-search-input]');
    var results = root.querySelector('[data-search-results]');
    var note = root.querySelector('[data-search-note]');
    var query = params.get('q') || '';

    if (input) {
      input.value = query;
    }

    function render(value) {
      var keyword = normalize(value);
      var matched = window.MOVIE_INDEX.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          (movie.tags || []).join(' '),
          movie.oneLine
        ].join(' '));
        return !keyword || text.indexOf(keyword) !== -1;
      }).slice(0, 120);

      if (note) {
        note.textContent = keyword ? '关键词“' + value + '”找到 ' + matched.length + ' 个结果' : '请输入关键词，或浏览推荐结果';
      }
      if (results) {
        results.innerHTML = matched.map(movieCard).join('');
        bindPosters();
      }
    }

    render(query);
    if (input) {
      input.addEventListener('input', function () {
        render(input.value);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindMenu();
    bindPosters();
    bindPageFilters();
    bindSearchPage();
  });
})();
