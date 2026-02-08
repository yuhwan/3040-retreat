/* ============================================
   3040 부부 세미나 MT — Main JS
   ============================================ */

(function () {
  'use strict';

  // --- Navigation ---
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.nav-menu-btn');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');

  function openMenu() {
    menuBtn?.classList.add('active');
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuBtn?.classList.remove('active');
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', function () {
    if (drawer?.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay?.addEventListener('click', closeMenu);

  // Close on link click
  document.querySelectorAll('.nav-drawer-links a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Nav scroll shadow
  function onScroll() {
    if (window.scrollY > 8) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mark active nav link ---
  var currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-drawer-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Checklist persistence ---
  var CHECKLIST_KEY = '3040mt_checklist';

  function getCheckedItems() {
    try {
      return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveCheckedItems(items) {
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }

  function initChecklist() {
    var items = document.querySelectorAll('.checklist-item');
    if (!items.length) return;

    var checked = getCheckedItems();

    items.forEach(function (item) {
      var id = item.dataset.id;
      if (id && checked[id]) {
        item.classList.add('checked');
      }

      item.addEventListener('click', function () {
        var checked = getCheckedItems();
        var id = item.dataset.id;
        if (!id) return;

        item.classList.toggle('checked');

        if (item.classList.contains('checked')) {
          checked[id] = true;
        } else {
          delete checked[id];
        }

        saveCheckedItems(checked);
        updateChecklistCounts();
      });
    });

    updateChecklistCounts();
  }

  function updateChecklistCounts() {
    // Overall counter
    var total = document.querySelectorAll('.checklist-item').length;
    var done = document.querySelectorAll('.checklist-item.checked').length;
    var counter = document.querySelector('.checklist-counter');
    if (counter) {
      counter.textContent = done + ' / ' + total + ' 완료';
    }

    // Per-group counters
    document.querySelectorAll('.checklist-group').forEach(function (group) {
      var groupTotal = group.querySelectorAll('.checklist-item').length;
      var groupDone = group.querySelectorAll('.checklist-item.checked').length;
      var groupCounter = group.querySelector('.checklist-group-count');
      if (groupCounter) {
        groupCounter.textContent = groupDone + '/' + groupTotal;
      }
    });
  }

  initChecklist();

})();
