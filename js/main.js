/* TEIVORA — main.js v3.0 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── SPLASH ── */
  const splash = document.getElementById('splash');
  if (splash) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => { splash.classList.add('out'); document.body.style.overflow = ''; }, 2700);
  }

  /* ── THEME ── */
  const html = document.documentElement;
  const saved = localStorage.getItem('tv-theme') || 'light';
  html.setAttribute('data-theme', saved);
  syncThemeIcons(saved);

  function syncThemeIcons(t) {
    document.querySelectorAll('.btn-theme').forEach(b => { b.textContent = t === 'dark' ? '☀️' : '🌙'; });
  }
  document.querySelectorAll('.btn-theme').forEach(b => {
    b.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('tv-theme', next);
      syncThemeIcons(next);
    });
  });

  /* ── SCROLL PROGRESS ── */
  const prog = document.getElementById('scroll-progress');
  /* ── NAVBAR ── */
  const navbar = document.querySelector('.navbar');
  /* ── BTT ── */
  const btt = document.getElementById('btt');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.width = (dh > 0 ? sy / dh * 100 : 0) + '%';
      if (navbar) navbar.classList.toggle('solid', sy > 30);
      if (btt) btt.classList.toggle('show', sy > 400);
      revealAll();
      tickCounters();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  if (navbar) navbar.classList.toggle('solid', window.scrollY > 30);
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── CUSTOM CURSOR (desktop only) ── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && window.innerWidth > 900) {
    let rx = 0, ry = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => { dx = e.clientX; dy = e.clientY; dot.style.left = dx + 'px'; dot.style.top = dy + 'px'; }, { passive: true });
    function moveRing() {
      rx += (dx - rx) * 0.12; ry += (dy - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(moveRing);
    }
    moveRing();
    document.querySelectorAll('a,button,.svc-card,.port-card,.blog-card,.team-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  } else { if (dot) dot.style.display = 'none'; if (ring) ring.style.display = 'none'; }

  /* ── HAMBURGER / MOBILE NAV ── */
  const ham = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  ham?.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mobileNav?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { ham?.classList.remove('open'); mobileNav.classList.remove('open'); document.body.style.overflow = ''; });
  });

  /* ── ACTIVE NAV ── */
  const pg = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const h = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('active', h === pg || (!pg && h === 'index.html') || (pg === 'index.html' && (h === '' || h === '../index.html')));
  });

  /* ── SCROLL REVEAL ── */
  // Stagger grids
  document.querySelectorAll('.svc-grid-main .svc-card, .port-grid .port-card, .blog-grid .blog-card, .team-grid .team-card, .price-grid .price-card').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.07) + 's';
  });
  function revealAll() {
    const th = window.innerHeight - 60;
    document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el => { if (el.getBoundingClientRect().top < th) el.classList.add('vis'); });
  }
  setTimeout(revealAll, 120);

  /* ── COUNTERS ── */
  let counted = false;
  function tickCounters() {
    if (counted) return;
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (els[0].getBoundingClientRect().top > window.innerHeight) return;
    counted = true;
    els.forEach(el => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur = 2000;
      const t0 = performance.now();
      const update = now => {
        const p = Math.min((now - t0) / dur, 1);
        const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = v.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(update);
    });
  }
  setTimeout(tickCounters, 600);

  /* ── TESTIMONIALS CAROUSEL ── */
  const tTrack = document.querySelector('.testi-track');
  if (tTrack) {
    const cards = tTrack.querySelectorAll('.testi-card');
    const dots = document.querySelectorAll('.c-dot');
    const mobile = window.innerWidth <= 768;
    const perView = mobile ? 1 : 2;
    const total = Math.max(1, cards.length - perView + 1);
    let cur = 0;

    const go = i => {
      cur = Math.max(0, Math.min(i, total - 1));
      tTrack.style.transform = `translateX(-${cur * (cards[0].offsetWidth + 24)}px)`;
      dots.forEach((d, j) => d.classList.toggle('on', j === cur));
    };

    document.querySelector('.c-prev')?.addEventListener('click', () => go(cur - 1));
    document.querySelector('.c-next')?.addEventListener('click', () => go(cur + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

    let autoT = setInterval(() => go((cur + 1) % total), 5000);
    tTrack.addEventListener('mouseenter', () => clearInterval(autoT));
    tTrack.addEventListener('mouseleave', () => { autoT = setInterval(() => go((cur + 1) % total), 5000); });

    let tx = 0;
    tTrack.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    tTrack.addEventListener('touchend',   e => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 40) go(d > 0 ? cur + 1 : cur - 1); }, { passive: true });
    go(0);
  }

  /* ── FAQ ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const isOn = item.classList.contains('on');
      document.querySelectorAll('.faq-item.on').forEach(o => { o.classList.remove('on'); o.querySelector('.faq-body').style.maxHeight = '0'; });
      if (!isOn) { item.classList.add('on'); body.style.maxHeight = body.scrollHeight + 40 + 'px'; }
    });
  });

  /* ── CONTACT FORM ── */
  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    setTimeout(() => {
      e.target.style.display = 'none';
      document.getElementById('form-ok')?.classList.add('show');
    }, 1500);
  });

  /* ── LIVE CHAT ── */
  const chatBtn  = document.querySelector('.chat-btn-wrap');
  const chatBox  = document.querySelector('.chat-box');
  const chatSend = document.querySelector('.chat-send');
  const chatIn   = document.querySelector('.chat-in');
  const chatMsgs = document.querySelector('.chat-msgs');

  chatBtn?.addEventListener('click', () => {
    const o = chatBox.classList.toggle('open');
    chatBtn.textContent = o ? '✕' : '💬';
    chatBtn.style.animation = o ? 'none' : '';
  });

  const botR = [
    '👋 Hi! Welcome to Teivora. How can I help you today?',
    'Great question! Our specialists will respond within 24 hours.',
    'Want to book a free strategy session? Just say the word!',
    'We\'ve delivered 250+ projects across AI, Cloud, and more.',
    'You can also reach us at hello@teivora.com anytime.',
  ];
  let ri = 0;
  const addMsg = (txt, type) => {
    if (!chatMsgs) return;
    const d = document.createElement('div');
    d.className = `cmsg ${type}`; d.textContent = txt;
    d.style.cssText = 'opacity:0;transform:translateY(6px);transition:all .3s ease';
    chatMsgs.appendChild(d);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    requestAnimationFrame(() => { d.style.opacity = '1'; d.style.transform = 'none'; });
  };
  const sendMsg = () => {
    const v = chatIn?.value.trim(); if (!v) return;
    addMsg(v, 'user'); chatIn.value = '';
    setTimeout(() => addMsg(botR[ri++ % botR.length], 'bot'), 700);
  };
  chatSend?.addEventListener('click', sendMsg);
  chatIn?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });

  /* ── COOKIE ── */
  const ck = document.getElementById('cookie');
  if (ck && !localStorage.getItem('tv-ck')) { setTimeout(() => ck.classList.remove('hide'), 2800); }
  document.querySelector('.ck-ok')?.addEventListener('click',  () => { localStorage.setItem('tv-ck','1'); ck?.classList.add('hide'); });
  document.querySelector('.ck-no')?.addEventListener('click',  () => { localStorage.setItem('tv-ck','0'); ck?.classList.add('hide'); });

  /* ── BLOG/PORTFOLIO FILTERS ── */
  document.querySelectorAll('.filter-row').forEach(row => {
    row.querySelectorAll('.ftag').forEach(tag => {
      tag.addEventListener('click', () => {
        row.querySelectorAll('.ftag').forEach(t => t.classList.remove('on'));
        tag.classList.add('on');
        const cat = tag.dataset.cat;
        const section = tag.closest('section') || document.body;
        section.querySelectorAll('[data-cat]').forEach(c => {
          const show = cat === 'all' || c.dataset.cat === cat;
          c.style.display = show ? '' : 'none';
          if (show) { c.classList.remove('vis'); requestAnimationFrame(() => c.classList.add('vis')); }
        });
      });
    });
  });

  /* ── NEWSLETTER ── */
  document.querySelectorAll('.nl-form').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const b = f.querySelector('.nl-btn');
      b.textContent = '✓ Done!'; b.style.background = '#22c55e';
      f.querySelector('.nl-in').value = '';
      setTimeout(() => { b.textContent = 'Subscribe'; b.style.background = ''; }, 3500);
    });
  });

  /* ── SMOOTH ANCHOR ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── PRICING TOGGLE ── */
  const pd = {
    monthly:{ s:'₹49,999', p:'₹1,49,999', per:'/ month' },
    yearly: { s:'₹47,999', p:'₹1,43,999', per:'/ year (20% off)' }
  };
  window.setPricing = t => {
    const d = pd[t];
    ['starter-price','pro-price'].forEach((id,i) => {
      const el = document.getElementById(id); if (el) el.textContent = i===0? d.s : d.p;
    });
    ['starter-per','pro-per'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = d.per; });
    document.querySelectorAll('.price-toggle-btn').forEach(btn => {
      const act = btn.dataset.mode === t;
      btn.style.background = act ? 'var(--c-blue)' : 'transparent';
      btn.style.color = act ? '#fff' : 'var(--c-text2)';
    });
  };

  /* ── CANVAS PARTICLES (hero) ── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize, { passive: true });
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .5,
      c: Math.random() < .5 ? 'rgba(53,87,255,' : 'rgba(0,198,190,'
    }));
    const animParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + '.7)'; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(53,87,255,${.12 * (1 - d / 120)})`; ctx.lineWidth = .5;
          ctx.stroke();
        }
      }));
      requestAnimationFrame(animParticles);
    };
    animParticles();
  }

  /* ── JSON-LD SCHEMA ── */
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Teivora Technology Solutions",
        "url": "https://teivora.com",
        "logo": "https://teivora.com/images/logo.png",
        "description": "AI, Cloud, Cybersecurity, and Software Development solutions.",
        "address": { "@type":"PostalAddress","addressLocality":"Pune","addressRegion":"Maharashtra","addressCountry":"IN" },
        "contactPoint": { "@type":"ContactPoint","telephone":"+91-98765-43210","contactType":"customer service" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {"@type":"Question","name":"What industries does Teivora specialize in?","acceptedAnswer":{"@type":"Answer","text":"FinTech, HealthTech, E-Commerce, Manufacturing, Education, and Government."}},
          {"@type":"Question","name":"How long does a typical project take?","acceptedAnswer":{"@type":"Answer","text":"MVP: 6–12 weeks. Enterprise transformations: 3–12 months."}}
        ]
      }
    ]
  };
  const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(schema); document.head.appendChild(s);

});
