(function () {
    var root = document.documentElement;
    var btn = document.getElementById('theme-toggle');
    var saved = localStorage.getItem('turno-de-replica-theme');
    var initial = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(initial);

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      localStorage.setItem('turno-de-replica-theme', next);
    });

    function apply(theme) {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        btn.textContent = '☀️';
        btn.title = 'Cambiar a modo día';
        btn.setAttribute('aria-pressed', 'true');
      } else {
        root.removeAttribute('data-theme');
        btn.textContent = '🌙';
        btn.title = 'Cambiar a modo noche';
        btn.setAttribute('aria-pressed', 'false');
      }
    }
  })();
