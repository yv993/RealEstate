// EverGreen — motion utilities (scroll reveal + count-up)

// Adds .in to any .reveal element when it scrolls into view.
function useRevealObserver(deps) {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, deps || []);
}

// Count-up number that animates when it enters the viewport.
function CountUp({ end, suffix, dur }) {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  const done = React.useRef(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !done.current) {
          done.current = true;
          const D = dur || 1600, t0 = performance.now();
          const step = (t) => {
            const p = Math.min((t - t0) / D, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(end * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, dur]);
  return <span ref={ref}>{val.toLocaleString("en-US")}{suffix}</span>;
}

window.useRevealObserver = useRevealObserver;
window.CountUp = CountUp;
