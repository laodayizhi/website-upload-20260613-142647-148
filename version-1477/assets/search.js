(function () {
    var form = document.querySelector('.search-panel');
    var input = document.querySelector('#searchInput');
    var results = document.querySelector('#searchResults');
    var params = new URLSearchParams(window.location.search);
    var current = params.get('q') || '';

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function card(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return '<article class="movie-card">' +
            '<a class="movie-poster" href="' + escapeHtml(movie.url) + '">' +
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="movie-play">▶</span>' +
            '</a>' +
            '<div class="movie-card-body">' +
            '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
            '<p class="movie-meta">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.year) + '</p>' +
            '<p class="movie-line">' + escapeHtml(movie.oneLine) + '</p>' +
            '<div class="tag-row">' + tags + '</div>' +
            '</div>' +
            '</article>';
    }

    function render(keyword) {
        var q = keyword.trim().toLowerCase();
        var data = typeof movieSearchData !== 'undefined' ? movieSearchData : [];
        var matched = data.filter(function (movie) {
            if (!q) {
                return true;
            }

            return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(' '), movie.oneLine].join(' ').toLowerCase().indexOf(q) !== -1;
        }).slice(0, 240);

        if (!results) {
            return;
        }

        if (!matched.length) {
            results.innerHTML = '<div class="empty-state">未找到相关影片，请尝试其他关键词。</div>';
            return;
        }

        results.innerHTML = matched.map(card).join('');
    }

    if (input) {
        input.value = current;
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var keyword = input ? input.value : '';
            var url = new URL(window.location.href);
            url.searchParams.set('q', keyword);
            window.history.replaceState(null, '', url.toString());
            render(keyword);
        });
    }

    render(current);
})();
