(() => {
  'use strict';

  /* ===== CONFIGURAÇÃO — troque apenas aqui ===== */
  const CONFIG = {
    whatsapp: '5511966490536', // formato internacional, sem espaços, parênteses ou traços
    instagram: 'evelynkaras_naildesigner', // usuário do Instagram, sem @
    message: [
      'Olá, Evelyn! Tudo bem?',
      'Conheci seu trabalho pelo site e gostaria de saber mais sobre seus serviços de Nail Designer.',
      'Gostaria de consultar os procedimentos disponíveis e verificar os horários para agendar um atendimento.',
      'Aguardo seu retorno!'
    ].join('\n')
  };
  const MASONRY = { gap: 0, stagger: 60 };           // espaço entre fotos (px) e atraso da entrada (ms)
  const WORK = [                                     // slats de "Meu trabalho"
    { t: 'Designs sofisticados e contemporâneos', f: 'trabalho-01.jpg', alt: 'Unhas amendoadas em vinho com francesinha diagonal e folhas de ouro' },
    { t: 'Alongamento em gel', f: 'trabalho-02.jpg', alt: 'Unhas longas quadradas em vinho e francesinha com detalhes dourados' },
    { t: 'Unhas naturais e delicadas', f: 'trabalho-03.jpg', alt: 'Unhas curtas com francesinha branca clássica' },
    { t: 'Nail art minimalista', f: 'trabalho-04.jpg', alt: 'Francesinha rosa pink com corações e fios dourados' },
    { t: 'Francesinha moderna', f: 'trabalho-05.jpg', alt: 'Francesinha branca fina sobre base rosa com brilho' }
  ];
  const PHOTOS = [                                   // fotos do portfólio (a = altura/largura)
    { f: 'portfolio-01.jpg', a: 1.5, t: 'Vermelho clássico', alt: 'Unhas curtas em gel vermelho com brilho' },
    { f: 'trabalho-01.jpg', a: 1.3, t: 'Vinho com folhas de ouro', alt: 'Unhas amendoadas em vinho com francesinha diagonal e folhas de ouro' },
    { f: 'trabalho-03.jpg', a: 1.6, t: 'Francesinha clássica', alt: 'Unhas curtas com francesinha branca clássica' },
    { f: 'portfolio-02.jpg', a: 1.25, t: 'Francesinha com ouro', alt: 'Francesinha branca amendoada com detalhes em folha de ouro' },
    { f: 'trabalho-04.jpg', a: 1.5, t: 'Corações e fios dourados', alt: 'Francesinha rosa pink com corações e fios dourados' },
    { f: 'trabalho-02.jpg', a: 1.7, t: 'Vinho e dourado', alt: 'Unhas longas quadradas em vinho e francesinha com detalhes dourados' },
    { f: 'trabalho-05.jpg', a: 1.3, t: 'Francesinha rosa com brilho', alt: 'Francesinha branca fina sobre base rosa com brilho' }
  ];

  const $ = s => document.querySelector(s);
  const srcOf = f => (window.IMG && window.IMG[f]) ? 'data:image/jpeg;base64,' + window.IMG[f] : 'assets/img/' + f;

  /* Links de contato */
  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.message)}`;
  const ig = `https://instagram.com/${CONFIG.instagram}`;
  document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href = wa; });
  document.querySelectorAll('[data-instagram]').forEach(a => { a.href = ig; });

  /* Menu mobile */
  const toggle = $('.menu-toggle'), nav = $('#nav');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'FECHAR' : 'MENU';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Link ativo na navegação */
  const links = [...nav.querySelectorAll('a')];
  const nio = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.toggleAttribute('aria-current', a.hash === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = document.querySelector(a.hash); if (s) nio.observe(s); });

  /* Textos que entram ao rolar */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
  }), { threshold: .2 });
  document.querySelectorAll('.reveal').forEach(el => rio.observe(el));

  /* ===== Meu trabalho — Spotlight Frames (accordion de fatias) ===== */
  const spot = $('#spot');
  if (spot) {
    const n = WORK.length, GAP = 2;
    let open = 1;
    const caps = document.createElement('div');
    caps.className = 'spot__caps';
    spot.insertAdjacentHTML('beforeend', '<div class="spot__sel" aria-hidden="true"></div>');
    const sel = spot.querySelector('.spot__sel');
    WORK.forEach((w, i) => {
      spot.insertAdjacentHTML('beforeend',
        `<div class="spot__slat" role="button" tabindex="0" aria-label="${w.t}" style="--i:${i}"><div class="spot__in"><img src="${srcOf(w.f)}" alt="${w.alt}" style="--x:${w.x || '50%'}" draggable="false" loading="lazy"></div></div>`);
      caps.insertAdjacentHTML('beforeend', `<div class="spot__cap"><span class="spot__t">${w.t}</span></div>`);
    });
    spot.after(caps);
    const slats = [...spot.querySelectorAll('.spot__slat')];
    const capEls = [...caps.children];

    const lay = () => {
      const W = spot.clientWidth;
      const e = W < 640 ? W * .6 : Math.min(Math.max(W * .36, 200), 560);
      spot.style.height = Math.max(340, Math.min(e * 1.55, innerHeight * .82)) + 'px';
      const c = (W - e - GAP * (n - 1)) / (n - 1);
      spot.style.setProperty('--e', e + 'px');
      let left = 0;
      slats.forEach((s, i) => {
        const w = i === open ? e : c;
        s.style.left = capEls[i].style.left = left + 'px';
        s.style.width = capEls[i].style.width = w + 'px';
        s.setAttribute('aria-pressed', String(i === open));
        capEls[i].classList.toggle('is-open', i === open);
        if (i === open) { sel.style.left = left + 'px'; sel.style.width = w + 'px'; }
        left += w + GAP;
      });
    };
    const set = i => { if (i !== open) { open = i; lay(); } };
    const hover = matchMedia('(hover: hover) and (pointer: fine)');
    slats.forEach((s, i) => {
      s.addEventListener('pointerenter', () => { if (hover.matches) set(i); });
      s.addEventListener('click', () => set(i));
      s.addEventListener('focus', () => set(i));
      s.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        slats[Math.max(0, Math.min(n - 1, i + d))].focus();
      });
    });
    new ResizeObserver(lay).observe(spot);
    lay();
    const sio = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { spot.classList.add('is-in'); sio.disconnect(); }
    }), { threshold: .25 });
    sio.observe(spot);
  }

  /* ===== Portfólio — Masonry (colunas, entrada ao rolar, arrastar para reordenar) ===== */
  const box = $('#masonry');
  const order = PHOTOS.map(p => ({ ...p }));
  if (box) {
    order.forEach(p => {
      const st = ['x', 'y', 'ox', 'oy', 's'].filter(k => p[k]).map(k => `--${k}:${p[k]}`).join(';');
      box.insertAdjacentHTML('beforeend',
        `<div class="m-item"><button class="m-card" type="button" aria-label="Ampliar: ${p.t}"><img src="${srcOf(p.f)}" alt="${p.alt}" style="${st}" draggable="false" loading="lazy" decoding="async"><span class="m-cap label">${p.t}</span></button></div>`);
      p.el = box.lastElementChild;
    });

    const layout = () => {
      const W = box.clientWidth, cols = W >= 1024 ? 4 : 2, g = MASONRY.gap;
      const size = (W - g * (cols - 1)) / cols, hs = new Array(cols).fill(0);
      order.forEach(p => {
        const span = Math.min(p.span || 1, cols);
        let col = 0, top = Infinity;
        for (let s = 0; s <= cols - span; s++) {
          const y = Math.max(...hs.slice(s, s + span));
          if (y < top - .5) { top = y; col = s; }
        }
        const w = size * span + g * (span - 1), h = w * p.a;
        p.r = { x: col * (size + g), y: top, w, h };
        for (let k = col; k < col + span; k++) hs[k] = top + h + g;
        p.el.style.width = w + 'px';
        p.el.style.height = h + 'px';
        if (!p.el.classList.contains('drag')) p.el.style.transform = `translate(${p.r.x}px,${p.r.y}px)`;
      });
      box.style.height = Math.max(...hs) - g + 'px';
    };
    layout();
    requestAnimationFrame(() => box.classList.add('ready'));
    new ResizeObserver(layout).observe(box);

    const mio = new IntersectionObserver(es => {
      es.filter(e => e.isIntersecting).forEach((e, k) => {
        e.target.style.setProperty('--d', k * MASONRY.stagger);
        e.target.classList.add('in');
        mio.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    order.forEach(p => mio.observe(p.el));

    /* Arrastar para reordenar (mouse) */
    let drag = null, quiet = false;
    box.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      const el = e.target.closest('.m-item');
      if (el) drag = { p: order.find(p => p.el === el), sx: e.clientX, sy: e.clientY, on: false };
    });
    window.addEventListener('pointermove', e => {
      if (!drag) return;
      if (!drag.on) {
        if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
        drag.on = true;
        drag.p.el.classList.add('drag');
      }
      const b = box.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top, p = drag.p;
      p.el.style.transform = `translate(${px - p.r.w / 2}px,${py - p.r.h / 2}px)`;
      const hit = order.find(o => o !== p && px >= o.r.x && px <= o.r.x + o.r.w && py >= o.r.y && py <= o.r.y + o.r.h);
      if (hit) {
        order.splice(order.indexOf(p), 1);
        order.splice(order.indexOf(hit) + (order.indexOf(hit) >= 0 && p.r.y < hit.r.y ? 1 : 0), 0, p);
        layout();
      }
    });
    window.addEventListener('pointerup', () => {
      if (!drag) return;
      if (drag.on) {
        drag.p.el.classList.remove('drag');
        layout();
        quiet = true;
        setTimeout(() => { quiet = false; }, 60);
      }
      drag = null;
    });

    /* Lightbox */
    const dlg = $('#lightbox'), big = dlg.querySelector('img'), count = $('#lb-count');
    let cur = 0;
    const show = i => {
      cur = (i + order.length) % order.length;
      big.src = srcOf(order[cur].f);
      big.alt = order[cur].alt;
      count.textContent = `${cur + 1} / ${order.length}`;
    };
    box.addEventListener('click', e => {
      const el = e.target.closest('.m-item');
      if (quiet || !el) return;
      show(order.findIndex(p => p.el === el));
      dlg.showModal();
    });
    dlg.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (e.target === dlg || (b && 'close' in b.dataset)) dlg.close();
      else if (b && b.dataset.step) show(cur + Number(b.dataset.step));
    });
    dlg.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }
})();
