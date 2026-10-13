import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cursor from "./components/Cursor.jsx";
import Progress from "./components/Progress.jsx";
import Loader from "./components/Loader.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Experience from "./components/Experience.jsx";
import Contact from "./components/Contact.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import { profile, projects, skills } from "./data.js";
import { prefersReducedMotion } from "./hooks.js";

const seenIntro = () => {
  try {
    return sessionStorage.getItem("intro-seen") === "1";
  } catch {
    return false;
  }
};

export default function App() {
  const skip = useMemo(() => seenIntro() || prefersReducedMotion(), []);
  const [ready, setReady] = useState(skip);
  const [loading, setLoading] = useState(!skip);
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  const onReveal = useCallback(() => {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);
  const onIntroDone = useCallback(() => setLoading(false), []);

  useEffect(() => {
    document.body.classList.toggle("locked", loading);
  }, [loading]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2400);
  };

  const items = useMemo(() => {
    const go = (sel) => () =>
      document.querySelector(sel)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    return [
      { id: "about", label: "Go to About", group: "Navigate", run: go("#about") },
      { id: "projects", label: "Go to Projects", group: "Navigate", run: go("#projects") },
      { id: "experience", label: "Go to Experience", group: "Navigate", run: go("#experience") },
      { id: "contact", label: "Go to Contact", group: "Navigate", run: go("#contact") },
      ...projects.map((p) => ({ id: "p-" + p.id, label: p.title, group: "Project", run: go("#project-" + p.id) })),
      { id: "github", label: "Open GitHub", group: "Link", run: () => window.open(profile.github, "_blank", "noreferrer") },
      { id: "linkedin", label: "Open LinkedIn", group: "Link", run: () => window.open(profile.linkedin, "_blank", "noreferrer") },
      { id: "resume", label: "Download resume", group: "Link", run: () => (window.location.href = profile.resume) },
      {
        id: "email",
        label: "Copy my email address",
        group: "Action",
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          notify("Email copied: " + profile.email);
        },
      },
    ];
  }, []);

  const marqueeA = skills.flatMap((s) => s.items.slice(0, 3));
  const marqueeB = ["Seat locking", "Live scoring", "REST APIs", "WebSockets", "Redis TTL", "JWT auth", "Clean code", "System design"];

  return (
    <>
      <Cursor />
      <Progress />
      {loading && <Loader onReveal={onReveal} onDone={onIntroDone} />}
      <a className="skip" href="#projects">Skip to projects</a>
      <Nav name={profile.name} onOpenPalette={() => setPalette(true)} />
      <main>
        <Hero profile={profile} ready={ready} />
        <Marquee items={marqueeA} />
        <About profile={profile} />
        <Marquee items={marqueeB} reverse />
        <Projects projects={projects} />
        <Experience />
        <Contact profile={profile} />
      </main>
      <footer className="footer">
        <div className="wrap">
          <p>Built with React, Three.js and a lot of chai by {profile.name}. Press Ctrl K to jump anywhere.</p>
        </div>
      </footer>
      <CommandPalette open={palette} onClose={() => setPalette(false)} items={items} />
      <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
