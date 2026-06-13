(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = Number(dot.getAttribute('data-hero-dot'));
        showSlide(target);
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5600);
  }

  var scope = document.querySelector('[data-search-scope]');
  var localSearch = document.querySelector('[data-local-search]');
  var advancedFilter = document.querySelector('[data-advanced-filter]');
  var filterStrip = document.querySelector('[data-filter-strip]');

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function readCardText(card) {
    return normalize([
      card.getAttribute('data-title'),
      card.getAttribute('data-year'),
      card.getAttribute('data-region'),
      card.getAttribute('data-type'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-tags'),
      card.textContent
    ].join(' '));
  }

  function applyFilters() {
    if (!scope) {
      return;
    }

    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-row'));
    var queryInput = localSearch ? localSearch.querySelector('input[type="search"]') : null;
    var query = normalize(queryInput ? queryInput.value : '');
    var categoryValue = '';
    var yearValue = '';
    var typeValue = '';

    if (advancedFilter) {
      var categorySelect = advancedFilter.querySelector('[data-filter-category]');
      var yearSelect = advancedFilter.querySelector('[data-filter-year-select]');
      var typeSelect = advancedFilter.querySelector('[data-filter-type]');
      categoryValue = normalize(categorySelect ? categorySelect.value : '');
      yearValue = normalize(yearSelect ? yearSelect.value : '');
      typeValue = normalize(typeSelect ? typeSelect.value : '');
    }

    cards.forEach(function (card) {
      var text = readCardText(card);
      var cardCategory = normalize(card.querySelector('.card-meta a') ? card.querySelector('.card-meta a').textContent : '');
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardType = normalize(card.getAttribute('data-type'));
      var matched = true;

      if (query && text.indexOf(query) === -1) {
        matched = false;
      }

      if (categoryValue && cardCategory !== categoryValue) {
        matched = false;
      }

      if (yearValue && cardYear !== yearValue) {
        matched = false;
      }

      if (typeValue && cardType !== typeValue) {
        matched = false;
      }

      card.classList.toggle('is-filter-hidden', !matched);
    });
  }

  if (localSearch) {
    localSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilters();
    });

    var searchInput = localSearch.querySelector('input[type="search"]');

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var preset = params.get('q');

      if (preset) {
        searchInput.value = preset;
      }

      searchInput.addEventListener('input', applyFilters);
      applyFilters();
    }
  }

  if (advancedFilter) {
    advancedFilter.addEventListener('change', applyFilters);
  }

  if (filterStrip && scope) {
    var buttons = Array.prototype.slice.call(filterStrip.querySelectorAll('[data-filter-year]'));
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter-year');
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });

        Array.prototype.slice.call(scope.querySelectorAll('.movie-card')).forEach(function (card) {
          var matched = value === 'all' || card.getAttribute('data-year') === value;
          card.classList.toggle('is-filter-hidden', !matched);
        });
      });
    });
  }
})();
