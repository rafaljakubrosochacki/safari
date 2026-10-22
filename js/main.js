/* Przychodnia Weterynaryjna Safari – skrypty strony (vanilla JS, bez jQuery). */
(function () {
  'use strict';

  const ready = (fn) =>
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

  ready(function () {
    /* Rok w stopce */
    document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

    /* Cień nagłówka po przewinięciu */
    const bar = document.querySelector('[data-header-bar]');
    if (bar) {
      const onScroll = () => {
        const scrolled = window.scrollY > 12;
        bar.classList.toggle('shadow-xl', scrolled);
        bar.classList.toggle('shadow-plum-900/10', scrolled);
        bar.classList.toggle('bg-white/95', scrolled);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Menu mobilne */
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
      const setOpen = (open) => {
        menu.classList.toggle('hidden', !open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.querySelector('[data-icon-open]').classList.toggle('hidden', open);
        toggle.querySelector('[data-icon-close]').classList.toggle('hidden', !open);
      };
      toggle.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
      menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
      document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
      window.addEventListener('resize', () => window.innerWidth >= 1024 && setOpen(false));
    }

    /* Animacja pojawiania się sekcji */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.style.transitionDelay = (el.dataset.revealDelay || 0) + 'ms';
            el.classList.add('reveal-in');
            el.classList.remove('reveal-init');
            io.unobserve(el);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      revealEls.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // już widoczne
        el.classList.add('reveal-init');
        io.observe(el);
      });
    }

    /* Karuzele (scroll-snap + przyciski) */
    document.querySelectorAll('[data-carousel]').forEach((root) => {
      const track = root.querySelector('[data-track]');
      const prev = root.querySelector('[data-prev]');
      const next = root.querySelector('[data-next]');
      if (!track) return;
      const step = () => {
        const card = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
        return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth - 4;
        if (prev) prev.disabled = track.scrollLeft <= 4;
        if (next) next.disabled = track.scrollLeft >= max;
      };
      prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });

    /* Filtr zespołu (zespol.html) – obsługuje też linki typu zespol.html#lekarze */
    const filterRoot = document.querySelector('[data-team-filter]');
    if (filterRoot) {
      const buttons = filterRoot.querySelectorAll('[data-filter]');
      const items = document.querySelectorAll('[data-tags]');
      const apply = (filter) => {
        const valid = Array.from(buttons).some((b) => b.dataset.filter === filter);
        if (!valid) filter = '*';
        buttons.forEach((b) => {
          const active = b.dataset.filter === filter;
          b.setAttribute('aria-pressed', String(active));
          b.classList.toggle('bg-plum-700', active);
          b.classList.toggle('text-white', active);
          b.classList.toggle('shadow-lg', active);
          b.classList.toggle('bg-white', !active);
          b.classList.toggle('text-plum-800', !active);
        });
        items.forEach((item) => {
          const show = filter === '*' || item.dataset.tags.split(' ').includes(filter);
          item.classList.toggle('hidden', !show);
        });
      };
      buttons.forEach((b) =>
        b.addEventListener('click', () => {
          apply(b.dataset.filter);
          history.replaceState(null, '', b.dataset.filter === '*' ? location.pathname : '#' + b.dataset.filter);
        })
      );
      const fromHash = () => apply(decodeURIComponent(location.hash.replace('#', '')) || '*');
      window.addEventListener('hashchange', fromHash);
      fromHash();
    }

    /* Prosty lightbox dla galerii */
    const links = Array.from(document.querySelectorAll('[data-lightbox]'));
    if (links.length) {
      const box = document.createElement('div');
      box.className =
        'fixed inset-0 z-[100] hidden items-center justify-center bg-plum-950/90 p-4 backdrop-blur-sm';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.innerHTML =
        '<figure class="flex max-h-full max-w-full flex-col items-center gap-3">' +
        '<img class="max-h-[80vh] max-w-full rounded-2xl shadow-2xl" alt="">' +
        '<figcaption class="flex items-center gap-3 text-center text-sm font-semibold text-plum-100/90"><span data-lb-count class="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-extrabold tabular-nums"></span><span data-lb-caption></span></figcaption>' +
        '</figure>' +
        '<button type="button" data-lb-close aria-label="Zamknij" class="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"><i class="fa-solid fa-xmark"></i></button>' +
        '<button type="button" data-lb-prev aria-label="Poprzednie" class="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><i class="fa-solid fa-chevron-left"></i></button>' +
        '<button type="button" data-lb-next aria-label="Następne" class="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><i class="fa-solid fa-chevron-right"></i></button>';
      document.body.appendChild(box);
      const img = box.querySelector('img');
      let idx = 0;
      const show = (i) => {
        idx = (i + links.length) % links.length;
        img.src = links[idx].href;
        img.alt = links[idx].querySelector('img')?.alt || '';
        box.querySelector('[data-lb-caption]').textContent = img.alt;
        box.querySelector('[data-lb-count]').textContent = idx + 1 + ' / ' + links.length;
      };
      const open = (i) => {
        show(i);
        box.classList.remove('hidden');
        box.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      };
      const close = () => {
        box.classList.add('hidden');
        box.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      };
      links.forEach((a, i) =>
        a.addEventListener('click', (e) => {
          e.preventDefault();
          open(i);
        })
      );
      box.querySelector('[data-lb-close]').addEventListener('click', close);
      box.querySelector('[data-lb-prev]').addEventListener('click', () => show(idx - 1));
      box.querySelector('[data-lb-next]').addEventListener('click', () => show(idx + 1));
      box.addEventListener('click', (e) => e.target === box && close());
      document.addEventListener('keydown', (e) => {
        if (box.classList.contains('hidden')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(idx - 1);
        if (e.key === 'ArrowRight') show(idx + 1);
      });
    }

    /* Widżet opinii Google (SociableKIT) – ukrycie linku „tutorial” w Shadow DOM */
    const host = document.querySelector('.sk-ww-google-reviews');
    if (host) {
      const hideLink = () => {
        const link = host.shadowRoot && host.shadowRoot.querySelector('.tutorial_link');
        if (link) {
          link.style.color = 'transparent';
          return true;
        }
        return false;
      };
      const obs = new MutationObserver(() => {
        if (host.shadowRoot) {
          const inner = new MutationObserver(() => hideLink() && inner.disconnect());
          inner.observe(host.shadowRoot, { childList: true, subtree: true });
          hideLink() && inner.disconnect();
          obs.disconnect();
        }
      });
      obs.observe(host, { childList: true, subtree: true, attributes: true });
    }
  });
})();
