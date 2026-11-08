/**
 * Effets liés au défilement, partagés par toutes les pages. Tout le contenu
 * reste visible sans JavaScript : on ne masque (pour l'animer) que ce qui se
 * trouve sous la ligne de flottaison au moment du chargement.
 */
import { useEffect } from 'react';
import { reducedMotion } from './site';

const BELOW_FOLD = 0.92;

/** Apparition au défilement des éléments [data-reveal="délai en ms"] et éventail du rapport [data-fan-wrap]. */
export function useReveal(path: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled || reducedMotion() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('rv-hidden', 'fan-pending');
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const raf = requestAnimationFrame(() => {
      const limit = window.innerHeight * BELOW_FOLD;
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-rv-done])').forEach(el => {
        el.setAttribute('data-rv-done', '');
        if (el.getBoundingClientRect().top <= limit) return;
        el.style.transitionDelay = `${Number(el.dataset.reveal) || 0}ms`;
        el.classList.add('rv-ready', 'rv-hidden');
        io.observe(el);
      });
      document.querySelectorAll<HTMLElement>('[data-fan-wrap]:not([data-rv-done])').forEach(el => {
        el.setAttribute('data-rv-done', '');
        if (el.getBoundingClientRect().top <= limit) return;
        el.classList.add('fan-pending');
        io.observe(el);
      });
    });

    const showAll = () => document.querySelectorAll('.rv-hidden, .fan-pending')
      .forEach(el => el.classList.remove('rv-hidden', 'fan-pending'));
    window.addEventListener('beforeprint', showAll);
    return () => { cancelAnimationFrame(raf); io.disconnect(); showAll(); window.removeEventListener('beforeprint', showAll); };
  }, [path, enabled]);
}

/** En-tête opaque après 80 px de défilement et barre de progression [data-progress]. */
export function useScrollState(setScrolled: (v: boolean) => void, path: string) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 80);
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>('[data-progress]').forEach(el => {
        const r = el.parentElement!.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.6)));
        el.style.transform = `scaleX(${p})`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [setScrolled, path]);
}

/**
 * Superposition des sections : chaque section de premier niveau de <main>
 * reste collée pendant que la suivante la recouvre ; la section recouverte
 * rétrécit légèrement et s'assombrit (voile en ::after, piloté par --veil).
 */
export function useStacking(path: string, enabled: boolean, mobile: boolean) {
  useEffect(() => {
    if (!enabled || reducedMotion()) return;
    const mq = window.matchMedia('(min-width: 960px)');
    let secs: HTMLElement[] = [];
    let footer: HTMLElement | null = null;
    let heights: number[] = [];
    let raf = 0;

    const clear = () => {
      secs.forEach(s => {
        s.removeAttribute('data-stack');
        s.style.removeProperty('top');
        s.style.removeProperty('z-index');
        s.style.removeProperty('transform');
        s.style.removeProperty('--veil');
      });
      secs = [];
    };

    const measure = () => {
      const vh = window.innerHeight;
      heights = secs.map(s => s.offsetHeight);
      secs.forEach((s, i) => { s.style.top = `${Math.min(0, vh - heights[i])}px`; });
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Lectures d'abord, écritures ensuite : pas de recalcul de mise en page forcé.
      const tops = secs.map((_, i) => (secs[i + 1] ?? footer)?.getBoundingClientRect().top ?? vh);
      secs.forEach((s, i) => {
        // Référence = min(écran, section) : une section plus courte que l'écran (hero à 86vh)
        // n'est ni réduite ni voilée tant que la suivante n'a pas commencé à la recouvrir.
        const ref = Math.max(1, Math.min(vh, heights[i] ?? vh));
        const p = Math.max(0, Math.min(1, 1 - tops[i] / ref));
        s.style.setProperty('--veil', (p * 0.55).toFixed(3));
        s.style.transform = p > 0 ? `scale(${(1 - p * 0.04).toFixed(4)})` : '';
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const setup = () => {
      clear();
      if (!mobile && !mq.matches) return;
      secs = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
      footer = document.querySelector<HTMLElement>('footer.footer');
      if (secs.length < 2) { secs = []; return; }
      secs.forEach((s, i) => { s.setAttribute('data-stack', ''); s.style.zIndex = String(i + 1); });
      measure();
      update();
    };

    const raf0 = requestAnimationFrame(setup);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => { measure(); onScroll(); }) : null;
    const observe = () => secs.forEach(s => ro?.observe(s));
    const raf1 = requestAnimationFrame(observe);
    const onMq = () => { setup(); observe(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mq.addEventListener?.('change', onMq);
    return () => {
      cancelAnimationFrame(raf0); cancelAnimationFrame(raf1); cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mq.removeEventListener?.('change', onMq);
      clear();
    };
  }, [path, enabled, mobile]);
}
