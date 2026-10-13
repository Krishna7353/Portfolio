import { useEffect, useState } from "react";

export default function Loader({ onReveal, onDone }) {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const dur = 1500;
    const start = performance.now();
    let raf;
    let timer;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor((1 - Math.pow(1 - p, 2.2)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        onReveal();
        timer = setTimeout(onDone, 950);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [onReveal, onDone]);

  return (
    <div className={"loader" + (leaving ? " leaving" : "")} role="status" aria-label="Loading portfolio">
      <div className="ld-half ld-top" />
      <div className="ld-half ld-bot" />
      <div className="ld-center">
        <div className="ld-score">{String(n).padStart(2, "0")}</div>
        <div className="ld-line">
          <span className="ld-ball" style={{ "--p": n }} />
        </div>
        <p className="ld-text">Walking out to bat</p>
      </div>
    </div>
  );
}
