import { useState } from "react";
import SeatLockDemo from "./SeatLockDemo.jsx";
import CricketDemo from "./CricketDemo.jsx";
import SectionTitle from "./SectionTitle.jsx";
import { useInView, useTilt } from "../hooks.js";

function Links({ p }) {
  return (
    <div className="links">
      <a className="btn btn-small" href={p.github} target="_blank" rel="noreferrer">View code</a>
      <a className="btn btn-small" href={p.live} target="_blank" rel="noreferrer">Open live app</a>
    </div>
  );
}

function Window({ url, children }) {
  return (
    <div className="win-wrap">
      <div className="win">
        <div className="win-bar" aria-hidden="true">
          <span /><span /><span />
          <em>{url}</em>
        </div>
        <div className="win-body">{children}</div>
      </div>
    </div>
  );
}

function Feature({ p, i }) {
  const [ref, seen] = useInView({ threshold: 0.12 });
  return (
    <article id={"project-" + p.id} ref={ref} className={"feature" + (i % 2 ? " rev" : "") + (seen ? " in" : "")}>
      <span className="ghost" aria-hidden="true">{p.demo === "seats" ? "Lock" : "Score"}</span>
      <div className="feature-copy">
        <p className="feature-cat">{p.category}</p>
        <h3 className="h3">{p.title}</h3>
        <p className="feature-tag">{p.tagline}</p>
        <p className="feature-desc">{p.description}</p>
        <ul className="ticks">
          {p.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ul className="chips">
          {p.stack.map((s) => (
            <li className="chip" key={s}>{s}</li>
          ))}
        </ul>
        <Links p={p} />
      </div>
      <Window url={p.demo === "seats" ? "localhost:5173/events/final-match" : "localhost:5173/scorer"}>
        {p.demo === "seats" ? <SeatLockDemo /> : <CricketDemo />}
      </Window>
    </article>
  );
}

function Card({ p }) {
  const tilt = useTilt(5);
  return (
    <article className="card" id={"project-" + p.id} {...tilt} data-cursor>
      <div className="card-in">
        <p className="feature-cat">{p.category}</p>
        <h4 className="card-title">{p.title}</h4>
        <p className="card-tag">{p.tagline}</p>
        <p className="card-desc">{p.description}</p>
        <ul className="chips">
          {p.stack.map((s) => (
            <li className="chip" key={s}>{s}</li>
          ))}
        </ul>
        <Links p={p} />
      </div>
    </article>
  );
}

export default function Projects({ projects }) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const cats = ["All", ...new Set(others.map((p) => p.category))];
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? others : others.filter((p) => p.category === cat);

  return (
    <section className="section" id="projects">
      <div className="wrap">
        <SectionTitle>Selected work</SectionTitle>
        <p className="lead narrow">
          The first two projects run right here in the page. Lock a seat, score a few balls.
        </p>

        <div className="features">
          {featured.map((p, i) => (
            <Feature p={p} i={i} key={p.id} />
          ))}
        </div>

        <div className="more-head">
          <h3 className="h3">More projects</h3>
          <div className="filters" role="group" aria-label="Filter projects">
            {cats.map((c) => (
              <button key={c} type="button" className="filter" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {shown.map((p) => (
            <Card p={p} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
