import { useEffect, useRef } from "react";
import { experience } from "../data.js";
import { useInView } from "../hooks.js";
import SectionTitle from "./SectionTitle.jsx";

function Item({ e }) {
  const [ref, seen] = useInView({ threshold: 0.5 });
  return (
    <li className={"tl-item" + (seen ? " on" : "")} ref={ref}>
      <p className="tl-when">{e.when}</p>
      <div>
        <h3 className="tl-title">{e.title}</h3>
        <p className="tl-place">{e.place}</p>
        <p>{e.text}</p>
      </div>
    </li>
  );
}

export default function Experience() {
  const list = useRef(null);
  useEffect(() => {
    const el = list.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
      el.style.setProperty("--fill", p.toFixed(3));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SectionTitle>Experience and education</SectionTitle>
        <ol className="tl" ref={list}>
          {experience.map((e) => (
            <Item e={e} key={e.title} />
          ))}
        </ol>
      </div>
    </section>
  );
}
