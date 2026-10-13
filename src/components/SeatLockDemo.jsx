import { Fragment, useEffect, useReducer, useState } from "react";

const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = 10;
const TTL = 15000; // 10 minutes in production, 15 seconds here so you can watch it expire
const MAX_HOLD = 4;
const PRICE = 450;

let seq = 0;
const addLog = (logs, t, text, kind) => [{ id: ++seq, t, text, kind }, ...logs].slice(0, 7);
const time = (t) => new Date(t).toLocaleTimeString([], { hour12: false });

function init() {
  const seats = {};
  ROWS.forEach((r, ri) => {
    for (let c = 1; c <= COLS; c++) {
      const booked = (ri * 5 + c * 3) % 9 === 0;
      seats[r + c] = { status: booked ? "booked" : "free" };
    }
  });
  return {
    seats,
    logs: addLog([], Date.now(), "Seat map loaded from PostgreSQL", "info"),
    notice: "Pick a seat to lock it for 15 seconds.",
  };
}

function reducer(state, a) {
  switch (a.type) {
    case "tick": {
      let seats = state.seats;
      let logs = state.logs;
      let notice = state.notice;
      let changed = false;
      for (const id in state.seats) {
        const s = state.seats[id];
        if (s.status === "held" && s.expiresAt <= a.now) {
          if (!changed) {
            seats = { ...seats };
            changed = true;
          }
          if (s.owner === "other" && s.willBook) {
            seats[id] = { status: "booked" };
            logs = addLog(logs, a.now, "User B paid. seat:" + id + " is now booked", "ok");
          } else {
            seats[id] = { status: "free" };
            logs = addLog(logs, a.now, "seat:" + id + " TTL expired, lock released", "warn");
            if (s.owner === "you") notice = "Your hold on seat " + id + " expired and the seat went back on sale.";
          }
        }
      }
      return changed ? { ...state, seats, logs, notice } : state;
    }

    case "lock": {
      const s = state.seats[a.id];
      const mine = Object.values(state.seats).filter((x) => x.status === "held" && x.owner === "you").length;
      if (s.status === "booked") return { ...state, notice: "Seat " + a.id + " is already booked." };
      if (s.status === "held" && s.owner === "other") {
        const left = Math.ceil((s.expiresAt - a.now) / 1000);
        return {
          ...state,
          notice: "Seat " + a.id + " is locked by another buyer for " + left + "s. If they don't pay, it frees up.",
          logs: addLog(state.logs, a.now, "SET seat:" + a.id + " you NX returned nil (already locked)", "warn"),
        };
      }
      if (mine >= MAX_HOLD) return { ...state, notice: "You can hold up to " + MAX_HOLD + " seats at once." };
      return {
        ...state,
        seats: { ...state.seats, [a.id]: { status: "held", owner: "you", expiresAt: a.now + TTL } },
        logs: addLog(state.logs, a.now, "SET seat:" + a.id + " you NX PX " + TTL + " returned OK", "ok"),
        notice: "Seat " + a.id + " is yours for 15 seconds. Confirm before the timer runs out.",
      };
    }

    case "release": {
      return {
        ...state,
        seats: { ...state.seats, [a.id]: { status: "free" } },
        logs: addLog(state.logs, a.now, "DEL seat:" + a.id + " (released by you)", "info"),
        notice: "Seat " + a.id + " released.",
      };
    }

    case "confirm": {
      const ids = Object.keys(state.seats).filter((id) => state.seats[id].status === "held" && state.seats[id].owner === "you");
      if (!ids.length) return state;
      const seats = { ...state.seats };
      ids.forEach((id) => (seats[id] = { status: "booked" }));
      return {
        ...state,
        seats,
        logs: addLog(state.logs, a.now, "COMMIT booking [" + ids.join(", ") + "] and clear locks", "ok"),
        notice: "Booked " + ids.join(", ") + ". Payment confirmed.",
      };
    }

    case "other": {
      const free = Object.keys(state.seats).filter((id) => state.seats[id].status === "free");
      if (!free.length) return state;
      const id = free[Math.floor(a.r1 * free.length)];
      const ms = Math.round(6000 + a.r2 * 6000);
      return {
        ...state,
        seats: {
          ...state.seats,
          [id]: { status: "held", owner: "other", expiresAt: a.now + ms, willBook: a.r3 > 0.45 },
        },
        logs: addLog(state.logs, a.now, "User B: SET seat:" + id + " NX PX " + ms + " returned OK", "info"),
      };
    }

    case "reset":
      return init();

    default:
      return state;
  }
}

export default function SeatLockDemo() {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      dispatch({ type: "tick", now: t });
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "other", now: Date.now(), r1: Math.random(), r2: Math.random(), r3: Math.random() });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const mine = Object.keys(state.seats).filter((id) => state.seats[id].status === "held" && state.seats[id].owner === "you");

  function click(id) {
    const s = state.seats[id];
    const t = Date.now();
    if (s.status === "held" && s.owner === "you") dispatch({ type: "release", id, now: t });
    else dispatch({ type: "lock", id, now: t });
  }

  return (
    <div className="demo" aria-label="Seat locking demo">
      <div className="demo-head">
        <h4 className="demo-title">Seat map</h4>
        <p className="demo-sub">Another buyer, User B, is competing with you</p>
      </div>

      <div className="stage">Stage</div>

      <div className="seatmap">
        {ROWS.map((r) => (
          <div className="seat-row" key={r}>
            <span className="row-label" aria-hidden="true">{r}</span>
            {Array.from({ length: COLS }, (_, i) => {
              const id = r + (i + 1);
              const s = state.seats[id];
              const left = s.status === "held" ? Math.max(0, Math.ceil((s.expiresAt - now) / 1000)) : null;
              const cls =
                s.status === "booked" ? "seat-booked" : s.status === "held" ? (s.owner === "you" ? "seat-you" : "seat-other") : "seat-free";
              const label =
                "Seat " + id + ", " +
                (s.status === "booked" ? "booked" : s.status === "held" ? (s.owner === "you" ? "held by you, " + left + " seconds left" : "held by another buyer") : "available");
              return (
                <Fragment key={id}>
                  <button
                    type="button"
                    className={"seat " + cls}
                    onClick={() => click(id)}
                    disabled={s.status === "booked"}
                    aria-label={label}
                  >
                    {s.status === "booked" ? "×" : s.status === "held" ? left : i + 1}
                  </button>
                  {i === 4 && <span className="aisle" aria-hidden="true" />}
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <ul className="legend">
        <li><span className="swatch seat-free" /> Available</li>
        <li><span className="swatch seat-you" /> Held by you</li>
        <li><span className="swatch seat-other" /> Held by User B</li>
        <li><span className="swatch seat-booked" /> Booked</li>
      </ul>

      <p className="demo-notice" role="status" aria-live="polite">{state.notice}</p>

      <div className="demo-actions">
        <button
          type="button"
          className="btn btn-primary btn-small"
          disabled={!mine.length}
          onClick={() => dispatch({ type: "confirm", now: Date.now() })}
        >
          {mine.length ? "Pay ₹" + mine.length * PRICE + " and confirm" : "Confirm booking"}
        </button>
        <button type="button" className="btn btn-small" onClick={() => dispatch({ type: "reset" })}>
          Reset demo
        </button>
      </div>

      <div className="log-wrap">
        <h5 className="log-title">What the server is doing</h5>
        <ol className="log">
          {state.logs.map((l) => (
            <li key={l.id} className={"log-" + l.kind}>
              <span className="log-time">{time(l.t)}</span> {l.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
