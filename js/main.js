// Mobil menü
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mainNav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// Footer yılı
document.getElementById('year').textContent = new Date().getFullYear();

// Hero: katlar arasında gidip gelen asansör animasyonu
(() => {
  const cabin = document.querySelector('.cabin');
  const shaft = document.querySelector('.shaft');
  const floorNum = document.getElementById('floorNum');
  if (!cabin || getComputedStyle(shaft.parentElement).display === 'none') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const floors = 4;            // kuyu 400px, kat başı 100px
  const floorH = 100;
  let current = 1;

  const goTo = floor => {
    const top = (floors - floor) * floorH + 2;
    cabin.classList.remove('open');
    setTimeout(() => {
      shaft.style.setProperty('--pos', top + 'px');
      shaft.style.setProperty('--cable', top + 'px');
      // kat göstergesini yolculuk boyunca güncelle
      const step = floor > current ? 1 : -1;
      let f = current;
      const tick = setInterval(() => {
        if (f === floor) return clearInterval(tick);
        f += step;
        floorNum.textContent = f;
      }, 2200 / Math.max(1, Math.abs(floor - current)));
      current = floor;
      setTimeout(() => cabin.classList.add('open'), 2300);
    }, 800);
  };

  setTimeout(() => cabin.classList.add('open'), 600);
  setInterval(() => {
    let next;
    do { next = 1 + Math.floor(Math.random() * floors); } while (next === current);
    goTo(next);
  }, 5500);
})();

// Sayaç animasyonu
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1400;
    const frame = now => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('tr-TR') + (p === 1 && target >= 20 && target !== 100 ? '+' : '');
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    countObserver.unobserve(el);
  });
}, { threshold: .5 });
counters.forEach(c => countObserver.observe(c));

// Kaydırınca beliren öğeler
const revealTargets = document.querySelectorAll('.card, .product, .steps li, .about-text, .about-panel, .contact-info, .contact-form, .section-head');
revealTargets.forEach(el => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .15 });
revealTargets.forEach(el => revealObserver.observe(el));

// İletişim formu (şimdilik sadece doğrulama — sunucuya gönderim daha sonra bağlanacak)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  note.className = 'form-note';
  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    const empty = !input.value.trim();
    input.classList.toggle('invalid', empty);
    if (empty) valid = false;
  });
  const email = form.email;
  if (email.value && !email.checkValidity()) { email.classList.add('invalid'); valid = false; }

  if (!valid) {
    note.textContent = 'Lütfen işaretli alanları kontrol edin.';
    note.classList.add('err');
    return;
  }
  note.textContent = 'Teşekkürler! Talebiniz alındı, en kısa sürede size dönüş yapacağız.';
  note.classList.add('ok');
  form.reset();
});
