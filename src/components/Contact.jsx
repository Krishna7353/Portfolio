import { useState } from "react";
import { useMagnetic } from "../hooks.js";

// Empty in dev (Vite proxies /api to Spring Boot). In production set VITE_API_URL
// to your deployed backend, e.g. https://my-portfolio-api.onrender.com
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Contact({ profile }) {
  const mag = useMagnetic(0.3);
  const [status, setStatus] = useState({ type: "idle", text: "" });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const d = new FormData(form);
    setStatus({ type: "sending", text: "" });
    try {
      const res = await fetch(API + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.get("name"),
          email: d.get("email"),
          message: d.get("message"),
          website: d.get("website"),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        setStatus({ type: "sent", text: "Message sent. I'll reply within a day." });
      } else {
        setStatus({
          type: "error",
          text: body.error || "Couldn't send that. Please email me at " + profile.email,
        });
      }
    } catch {
      setStatus({ type: "error", text: "Server unreachable. Please email me at " + profile.email });
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <h2 className="contact-h">Hiring, or have something to build?</h2>
        <a className="mega" href={"mailto:" + profile.email} ref={mag}>{profile.email}</a>

        <div className="contact-grid">
          <ul className="contact-links">
            <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href={profile.resume}>Resume</a></li>
          </ul>

          <form className="form" onSubmit={onSubmit}>
            <label>
              Your name
              <input name="name" required maxLength={100} autoComplete="name" />
            </label>
            <label>
              Your email
              <input name="email" type="email" required maxLength={150} autoComplete="email" />
            </label>
            <label>
              Message
              <textarea name="message" rows="4" required minLength={5} maxLength={2000} />
            </label>

            {/* honeypot: hidden from people, bots fill it in */}
            <input name="website" tabIndex="-1" autoComplete="off" className="hp" aria-hidden="true" />

            <button className="btn btn-dark" type="submit" disabled={status.type === "sending"}>
              {status.type === "sending" ? "Sending..." : "Send message"}
            </button>
            <p className="form-status" role="status" aria-live="polite">{status.text}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
