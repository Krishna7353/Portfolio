export default function Nav({ name, onOpenPalette }) {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="wrap nav-inner">
        <a className="nav-brand" href="#top">{name}</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button type="button" className="nav-search" onClick={onOpenPalette} aria-label="Open command palette">
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>
      </div>
    </nav>
  );
}
