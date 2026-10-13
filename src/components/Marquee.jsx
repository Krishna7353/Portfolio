function BallIcon() {
  return (
    <svg className="m-ball" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#ff3b4e" />
      <path d="M5 11c7 4 15 4 22 0M5 21c7-4 15-4 22 0" stroke="#f3f1e7" strokeWidth="1.6" fill="none" strokeDasharray="2 3" />
    </svg>
  );
}

export default function Marquee({ items, reverse }) {
  const row = items.concat(items);
  return (
    <div className={"marquee" + (reverse ? " rev" : "")} aria-hidden="true">
      <div className="track">
        {row.map((t, i) => (
          <span className={"m-item" + (i % 2 ? " o" : "")} key={t + i}>
            {t}
            <BallIcon />
          </span>
        ))}
      </div>
    </div>
  );
}
