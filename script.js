// Minimal JS for mobile nav toggle and small helpers
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const btn = document.getElementById('navToggle');
  const year = document.getElementById('year');

  // set current year
  if (year) year.textContent = new Date().getFullYear();

  // Toggle mobile navigation
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('show');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Smooth in-page scroll for links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close nav on mobile after clicking
        if (nav.classList.contains('show')) nav.classList.remove('show');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
