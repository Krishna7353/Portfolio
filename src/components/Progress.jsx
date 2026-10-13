import { useEffect, useRef } from "react";

export default function Progress() {
  const bar = useRef(null);
  useEffect(() => {
    let raf;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight || 1;
        if (bar.current) bar.current.style.transform = "scaleX(" + h.scrollTop / max + ")";
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div className="progress" aria-hidden="true">
      <i ref={bar} />
    </div>
  );
}
