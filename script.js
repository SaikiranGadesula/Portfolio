const body = document.body;
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('saikiran-theme');
if (savedTheme) {
  body.dataset.theme = savedTheme;
  if (themeIcon) themeIcon.textContent = savedTheme === 'light' ? '☀' : '☾';
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
  body.dataset.theme = nextTheme;
  localStorage.setItem('saikiran-theme', nextTheme);
  if (themeIcon) themeIcon.textContent = nextTheme === 'light' ? '☀' : '☾';
});

mobileToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  });
});

const updateScrollUI = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const width = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (progress) progress.style.width = `${width}%`;
  header?.classList.toggle('scrolled', scrollTop > 18);
};

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const formatNumber = (value) => value.toLocaleString('en-US');

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = target >= 1000000 ? 1600 : 1150;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = formatNumber(Math.floor(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = formatNumber(target);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.42 });

document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('click', () => {
    const isActive = item.classList.toggle('active');
    item.setAttribute('aria-expanded', String(isActive));
    const icon = item.querySelector('strong');
    if (icon) icon.textContent = isActive ? '−' : '+';
  });
});

const tryLoadImage = (img, sources, index = 0) => {
  const fallback = img.nextElementSibling;
  if (!sources[index]) {
    fallback?.classList.add('show');
    img.removeAttribute('src');
    return;
  }

  const testImage = new Image();
  testImage.onload = () => {
    img.src = sources[index];
    img.classList.add('loaded');
    fallback?.classList.remove('show');
  };
  testImage.onerror = () => tryLoadImage(img, sources, index + 1);
  testImage.src = sources[index];
};

document.querySelectorAll('.profile-photo[data-photo-srcs]').forEach((img) => {
  const sources = img.dataset.photoSrcs.split(',').map((src) => src.trim()).filter(Boolean);
  tryLoadImage(img, sources);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    navMenu.classList.remove('open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }
});
