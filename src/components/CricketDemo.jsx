import { useState } from "react";

const BUTTONS = [
  { label: "0", runs: 0, legal: true },
  { label: "1", runs: 1, legal: true },
  { label: "2", runs: 2, legal: true },
  { label: "3", runs: 3, legal: true },
  { label: "4", runs: 4, legal: true },
  { label: "6", runs: 6, legal: true },
  { label: "Wd", runs: 1, legal: false, title: "Wide" },
  { label: "W", runs: 0, legal: true, wicket: true, title: "Wicket" },
];

const MAX_BALLS = 120;

export default function CricketDemo() {
  const [balls, setBalls] = useState([]);

  const runs = balls.reduce((a, b) => a + b.runs, 0);
  const wickets = balls.filter((b) => b.wicket).length;
  const legal = balls.filter((b) => b.legal).length;
  const overs = Math.floor(legal / 6) + "." + (legal % 6);
  const rr = legal ? (runs / (legal / 6)).toFixed(2) : "0.00";
  const done = wickets >= 10 || legal >= MAX_BALLS;

  // balls of the current over (includes wides bowled in it)
  let count = 0;
  const thisOver = [];
  for (const b of balls) {
    thisOver.push(b);
    if (b.legal) count++;
    if (count === 6) {
      count = 0;
      thisOver.length = 0;
    }
  }

  const add = (b) => !done && setBalls((x) => [...x, b]);

  return (
    <div className="demo" aria-label="Live scorer demo">
      <div className="demo-head">
        <h4 className="demo-title">Live scorer</h4>
        <p className="demo-sub">Tap a result to score a ball</p>
      </div>

      <div className="board" role="status" aria-live="polite">
        <div className="board-score">
          <span className="board-runs">{runs}/{wickets}</span>
          <span className="board-label">Score</span>
        </div>
        <div>
          <span className="board-num">{overs}</span>
          <span className="board-label">Overs</span>
        </div>
        <div>
          <span className="board-num">{rr}</span>
          <span className="board-label">Run rate</span>
        </div>
      </div>

      <div className="over" aria-label="This over">
        {thisOver.length === 0 && <span className="over-empty">New over. Waiting for the first ball.</span>}
        {thisOver.map((b, i) => (
          <span key={i} className={"ball" + (b.wicket ? " ball-w" : b.runs >= 4 ? " ball-4" : "")}>
            {b.label}
          </span>
        ))}
      </div>

      <div className="keys">
        {BUTTONS.map((b) => (
          <button
            key={b.label}
            type="button"
            className={"key" + (b.wicket ? " key-w" : "")}
            onClick={() => add(b)}
            disabled={done}
            aria-label={b.title || b.label + (b.runs === 1 ? " run" : " runs")}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="demo-actions">
        <button type="button" className="btn btn-small" onClick={() => setBalls((x) => x.slice(0, -1))} disabled={!balls.length}>
          Undo last ball
        </button>
        <button type="button" className="btn btn-small" onClick={() => setBalls([])} disabled={!balls.length}>
          Start new innings
        </button>
      </div>
      {done && <p className="demo-note">Innings complete. Start a new innings to keep scoring.</p>}
      <p className="demo-foot">
        In the real app each ball is saved to MongoDB and broadcast to every viewer, and the stats are derived from that ball log.
      </p>
    </div>
  );
}
