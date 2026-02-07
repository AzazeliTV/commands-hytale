document.addEventListener('DOMContentLoaded', function () {
  // Tab switching
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');

      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabContents.forEach(function (c) { c.classList.remove('active'); });

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');

      // Update search placeholder
      var searchInput = document.querySelector('.search-input');
      if (searchInput) {
        var label = target === 'admin' ? 'Admin-Befehle' : 'Spieler-Befehle';
        searchInput.placeholder = label + ' durchsuchen...';
        searchInput.value = '';
        filterCommands('');
      }
    });
  });

  // Search functionality
  var searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterCommands(searchInput.value.toLowerCase().trim());
    });
  }

  function filterCommands(query) {
    var activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;

    var categories = activeTab.querySelectorAll('.category');
    var noResults = activeTab.querySelector('.no-results');
    var anyVisible = false;

    categories.forEach(function (category) {
      var cards = category.querySelectorAll('.command-card');
      var categoryVisible = false;

      cards.forEach(function (card) {
        var name = (card.querySelector('.command-name').textContent || '').toLowerCase();
        var syntax = (card.querySelector('.command-syntax').textContent || '').toLowerCase();
        var desc = (card.querySelector('.command-desc').textContent || '').toLowerCase();
        var perm = card.querySelector('.command-perm');
        var permText = perm ? perm.textContent.toLowerCase() : '';

        var match = !query || name.indexOf(query) !== -1 || syntax.indexOf(query) !== -1 || desc.indexOf(query) !== -1 || permText.indexOf(query) !== -1;

        if (match) {
          card.classList.remove('hidden');
          categoryVisible = true;
        } else {
          card.classList.add('hidden');
        }
      });

      if (categoryVisible) {
        category.classList.remove('hidden');
        anyVisible = true;
      } else {
        category.classList.add('hidden');
      }
    });

    if (noResults) {
      noResults.style.display = anyVisible ? 'none' : 'block';
    }
  }
});
