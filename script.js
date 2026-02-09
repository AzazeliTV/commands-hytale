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

      var searchInput = document.querySelector('.search-input');
      if (searchInput) {
        var label = target === 'admin' ? 'Admin-Befehle' : target === 'hytale' ? 'Hytale-Befehle' : 'Spieler-Befehle';
        searchInput.placeholder = label + ' durchsuchen...';
        searchInput.value = '';
        filterCommands('');
      }
    });
  });

  // Search
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
        if (query) category.classList.remove('collapsed');
      } else {
        category.classList.add('hidden');
      }
    });

    if (noResults) {
      noResults.style.display = anyVisible ? 'none' : 'block';
    }
  }

  // Category collapse/expand
  document.querySelectorAll('.category-header').forEach(function (header) {
    header.addEventListener('click', function () {
      header.closest('.category').classList.toggle('collapsed');
    });
  });

  // Expand all / Collapse all
  var expandBtn = document.getElementById('expand-all');
  var collapseBtn = document.getElementById('collapse-all');

  if (expandBtn) {
    expandBtn.addEventListener('click', function () {
      var activeTab = document.querySelector('.tab-content.active');
      if (!activeTab) return;
      activeTab.querySelectorAll('.category').forEach(function (c) {
        c.classList.remove('collapsed');
      });
    });
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', function () {
      var activeTab = document.querySelector('.tab-content.active');
      if (!activeTab) return;
      activeTab.querySelectorAll('.category').forEach(function (c) {
        c.classList.add('collapsed');
      });
    });
  }

  // ===== CLICK TO COPY =====
  var toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = 'Kopiert!';
  document.body.appendChild(toast);
  var toastTimer = null;

  function showToast(text) {
    toast.textContent = text + ' kopiert!';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 1500);
  }

  document.querySelectorAll('.command-name').forEach(function (el) {
    // Add copy icon
    var icon = document.createElement('i');
    icon.className = 'fa-regular fa-copy copy-icon';
    el.appendChild(icon);

    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var text = el.textContent.replace(/\s*$/, '').trim();
      // Remove the copy icon text from the copied string
      var iconEl = el.querySelector('.copy-icon');
      if (iconEl) {
        text = text.replace(iconEl.textContent, '').trim();
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast(text);
        });
      } else {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(text);
      }
    });
  });

  // ===== FLASHLIGHT HOVER EFFECT =====
  var isMobile = window.matchMedia('(hover: none)').matches;
  if (!isMobile) {
    document.querySelectorAll('.command-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }
});
