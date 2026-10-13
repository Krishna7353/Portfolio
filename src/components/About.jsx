import { useEffect, useState } from "react";
import { skills, playerCard } from "../data.js";
import { useCountUp, useInView, useTilt } from "../hooks.js";
import SectionTitle from "./SectionTitle.jsx";

function Stat({ label, value, suffix, run }) {
  const v = useCountUp(value, run);
  return (
    <div className="stat">
      <span className="stat-n">{v.toLocaleString()}{suffix}</span>
      <span className="stat-l">{label}</span>
    </div>
  );
}

function PlayerCard({ profile }) {
  const tilt = useTilt(9);
  const [wrapRef, seen] = useInView({ threshold: 0.35 });
  const [imgOk, setImgOk] = useState(true);
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="pcard-wrap" ref={wrapRef}>
      <div className="pcard" {...tilt} data-cursor>
        <div className="pcard-top">
          <span className="pcard-pos">{playerCard.position}</span>
          <span className="pcard-status"><i /> {profile.status}</span>
        </div>
        <div className="pcard-photo">
          {profile.photo && imgOk ? (
            <img src={profile.photo} alt={profile.name} onError={() => setImgOk(false)} />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
        <h3 className="pcard-name">{profile.name}</h3>
        <dl className="pcard-rows">
          <div><dt>Batting</dt><dd>{playerCard.batting}</dd></div>
          <div><dt>Bowling</dt><dd>{playerCard.bowling}</dd></div>
          <div><dt>Fielding</dt><dd>{playerCard.fielding}</dd></div>
        </dl>
        <div className="stats">
          {playerCard.stats.map((s) => (
            <Stat key={s.label} {...s} run={seen} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function About({ profile }) {
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <PlayerCard profile={profile} />
        <div className="about-copy">
          <SectionTitle>I like problems with more than one person in them</SectionTitle>
          {profile.about.map((p) => (
            <p className="lead" key={p}>{p}</p>
          ))}
          <div className="skills">
            {skills.map((s) => (
              <section key={s.group}>
                <h3 className="skills-title">{s.group}</h3>
                <ul className="chips">
                  {s.items.map((i) => (
                    <li className="chip" key={i}>{i}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
