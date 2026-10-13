import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import ScrambleText from "./ScrambleText.jsx";
import { useMagnetic } from "../hooks.js";

const BallScene = lazy(() => import("./BallScene.jsx"));

function RoleCycler({ roles }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % roles.length), 3200);
    return () => clearInterval(t);
  }, [roles.length]);
  return <ScrambleText text={roles[i]} />;
}

export default function Hero({ profile, ready }) {
  const [sixes, setSixes] = useState(0);
  const [noGL, setNoGL] = useState(false);
  const words = profile.name.toUpperCase().split(" ");
  const len = Math.max(4, ...words.map((w) => w.length));
  const cta = useMagnetic(0.35);
  const onHit = useCallback(() => setSixes((s) => s + 1), []);
  const onFail = useCallback(() => setNoGL(true), []);
  let idx = 0;

  return (
    <header className={"hero" + (ready ? " hero-in" : "")} id="top">
      <div className="hero-bg" aria-hidden="true">
        {noGL && <div className="ball-fallback" />}
        {!noGL && ready && (
          <Suspense fallback={null}>
            <BallScene onHit={onHit} onFail={onFail} />
          </Suspense>
        )}
      </div>

      <div className="wrap hero-inner">
        <h1 className="hero-name" aria-label={profile.name} style={{ "--len": len }}>
          {words.map((w, wi) => (
            <span className={"hero-word" + (wi % 2 ? " outline" : "")} aria-hidden="true" key={w + wi}>
              {[...w].map((ch) => (
                <span className="ch" style={{ "--i": idx++ }} key={idx}>{ch}</span>
              ))}
            </span>
          ))}
        </h1>

        <div className="hero-foot">
          <div>
            <p className="hero-role"><RoleCycler roles={profile.roles} /></p>
            <p className="hero-headline">{profile.headline}</p>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects" ref={cta}>See the projects</a>
            <a className="btn" href={profile.resume}>Download resume</a>
          </div>
        </div>
      </div>

      <p className="sixes" aria-live="polite">
        {sixes === 0 ? "Click the ball" : "Sixes hit: " + sixes}
      </p>
    </header>
  );
}
