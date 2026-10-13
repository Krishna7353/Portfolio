import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks.js";

const CH = "!<>-_\\/[]{}=+*^?#abcdefghijklmnopqrstuvwxyz";

/** Text that decodes itself letter by letter. The real text stays in the DOM for screen readers. */
export default function ScrambleText({ text, play = true, block = false }) {
  const [out, setOut] = useState("");
  const prev = useRef("");

  useEffect(() => {
    if (!play) return;
    if (prefersReducedMotion()) {
      setOut(text);
      prev.current = text;
      return;
    }
    const from = prev.current;
    const len = Math.max(from.length, text.length);
    const queue = Array.from({ length: len }, (_, i) => ({
      from: from[i] || "",
      to: text[i] || "",
      start: Math.floor(Math.random() * 14),
      end: 14 + Math.floor(Math.random() * 18),
      ch: "",
    }));
    let frame = 0;
    let raf;
    const tick = () => {
      let s = "";
      let done = 0;
      for (const c of queue) {
        if (frame >= c.end) {
          done++;
          s += c.to;
        } else if (frame >= c.start) {
          if (!c.ch || Math.random() < 0.3) c.ch = CH[Math.floor(Math.random() * CH.length)];
          s += c.to === " " ? " " : c.ch;
        } else {
          s += c.from;
        }
      }
      setOut(s);
      prev.current = done === len ? text : s;
      if (done < len) {
        frame++;
        raf = requestAnimationFrame(tick);
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [text, play]);

  return (
    <span className={"sc" + (block ? " sc-block" : "")}>
      <span className="sc-ghost">{text}</span>
      <span className="sc-live" aria-hidden="true">{out}</span>
    </span>
  );
}
