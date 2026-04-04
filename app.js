/* ─── GOLD DUST PARTICLE SYSTEM ─── */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const PARTICLE_COUNT = 110;

  const GOLD_COLORS  = ['#f5c842','#ffd700','#ffe066','#f0b429','#ffeaa0'];
  const BLUE_COLORS  = ['#00d4ff','#40e0ff','#00b4ff','#80f0ff'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    const isGold = Math.random() < 0.68;
    const colors = isGold ? GOLD_COLORS : BLUE_COLORS;
    return {
      x:      rand(0, W),
      y:      rand(0, H),
      r:      rand(0.4, isGold ? 2.2 : 1.4),
      color:  colors[Math.floor(Math.random() * colors.length)],
      alpha:  rand(0.15, 0.75),
      vx:     rand(-0.18, 0.18),
      vy:     rand(-0.32, -0.08),
      pulse:  rand(0, Math.PI * 2),
      pulseSpeed: rand(0.008, 0.022),
      twinkle: rand(0.6, 1),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
      if (p.y < -4) { p.y = H + 4; p.x = rand(0, W); }

      const breathe = 0.5 + 0.5 * Math.sin(p.pulse);
      const alpha   = p.alpha * (0.4 + 0.6 * breathe);
      const glow    = p.r * (2.5 + 2 * breathe);

      // Outer glow
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow * 3);
      grad.addColorStop(0, p.color + Math.round(alpha * 80).toString(16).padStart(2,'0'));
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, glow * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
})();


/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* ─── MOBILE NAV ─── */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navMobile.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  });
});


/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const idx    = btn.dataset.faq;
    const answer = document.getElementById(`faq-${idx}`);
    const isOpen = answer.classList.contains('open');

    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('active'));

    if (!isOpen) {
      answer.classList.add('open');
      btn.classList.add('active');
    }
  });
});


/* ─── SCROLL-IN ANIMATIONS ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.pack-card, .feature-card, .testimonial-card, .pricing-card').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});


/* ─── NEON CURSOR TRAIL (subtle) ─── */
let trail = [];
const MAX_TRAIL = 10;

document.addEventListener('mousemove', e => {
  trail.push({ x: e.clientX, y: e.clientY, t: Date.now() });
  if (trail.length > MAX_TRAIL) trail.shift();
}, { passive: true });
