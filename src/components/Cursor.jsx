import { useEffect, useRef } from "react";

/** Floodlight that follows the pointer (lights up a grid), plus a trailing ring. */
export default function Cursor() {
  const ring = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let tx = window.innerWidth * 0.72;
    let ty = window.innerHeight * 0.28;
    let x = tx, y = ty, rx = tx, ry = ty;
    let raf;
    let moved = false;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!moved && ring.current) {
        moved = true;
        ring.current.style.opacity = "1";
      }
    };
    const over = (e) => {
      if (!ring.current) return;
      const hot = e.target.closest && e.target.closest("a, button, input, textarea, label, [data-cursor]");
      ring.current.classList.toggle("big", !!hot);
    };
    const loop = () => {
      x += (tx - x) * 0.09; // the floodlight lags a little
      y += (ty - y) * 0.09;
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      root.style.setProperty("--fx", x.toFixed(1) + "px");
      root.style.setProperty("--fy", y.toFixed(1) + "px");
      if (ring.current) ring.current.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      raf = requestAnimationFrame(loop);
    };

    if (fine) {
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerover", over);
    }
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <>
      <div className="flood" aria-hidden="true" />
      <div className="floodgrid" aria-hidden="true" />
      <div className="ring" ref={ring} aria-hidden="true" />
    </>
  );
}
