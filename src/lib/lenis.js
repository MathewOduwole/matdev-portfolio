import Lenis from 'lenis';

// Singleton Lenis instance. Skipped entirely under prefers-reduced-motion
// (native instant scrolling is the correct behaviour there) and on touch
// devices, where Lenis's synthetic wheel smoothing has nothing to smooth.
let lenis = null;

export const initLenis = () => {
  if (lenis) return lenis;
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
};

export const getLenis = () => lenis;

// Smooth-scroll to an in-page anchor (`#work`), falling back to the native
// hash jump when Lenis is inactive (reduced motion / touch).
export const scrollToHash = (hash) => {
  const el = hash && hash !== '#top' ? document.querySelector(hash) : document.body;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(hash === '#top' ? 0 : el, { offset: -72 });
  } else {
    if (hash === '#top') window.scrollTo({ top: 0 });
    else el.scrollIntoView(true);
  }
};
