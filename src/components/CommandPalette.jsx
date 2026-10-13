import { useEffect, useMemo, useRef, useState } from "react";

export default function CommandPalette({ open, onClose, items }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef(null);
  const opener = useRef(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => (i.label + " " + i.group).toLowerCase().includes(s)) : items;
  }, [q, items]);

  useEffect(() => {
    if (open) {
      opener.current = document.activeElement;
      setQ("");
      setIdx(0);
      setTimeout(() => input.current && input.current.focus(), 30);
    } else if (opener.current && opener.current.focus) {
      opener.current.focus();
    }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  if (!open) return null;

  const run = (item) => {
    onClose();
    setTimeout(() => item.run(), 60);
  };

  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(list.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && list[idx]) {
      e.preventDefault();
      run(list[idx]);
    }
  };

  return (
    <div className="pal-back" onMouseDown={onClose}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={input}
          className="pal-input"
          placeholder="Jump to a section, open a project, copy my email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded="true"
          aria-controls="pal-list"
          aria-activedescendant={list[idx] ? "pal-" + list[idx].id : undefined}
        />
        <ul className="pal-list" id="pal-list" role="listbox">
          {list.length === 0 && <li className="pal-empty">Nothing matches "{q}". Try "projects" or "email".</li>}
          {list.map((it, i) => (
            <li
              key={it.id}
              id={"pal-" + it.id}
              role="option"
              aria-selected={i === idx}
              className={"pal-item" + (i === idx ? " on" : "")}
              onMouseEnter={() => setIdx(i)}
              onClick={() => run(it)}
            >
              <span>{it.label}</span>
              <small>{it.group}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
