# Floodlight Portfolio (React + Three.js)

A night-match themed developer portfolio. Highlights:

- **3D cricket ball** in the hero (Three.js): leather texture, raised seam, stitching.
  It follows your pointer, tumbles as you scroll, and spins up when you click it. Each hit counts as a six.
- **Floodlight cursor**: a warm light that trails the pointer and reveals a pitch-grid behind the page.
- **Live demos inside the page**
  - *Event Booking System with Seat Locking*: lock a seat with a countdown while a simulated second buyer competes. Server log shows Redis-style commands.
  - *Cricket Management System*: a working ball-by-ball scorer with overs, run rate and undo.
- **Collectible player card** with 3D tilt and a holographic sheen, plus count-up stats.
- **Command palette** (Ctrl K or Cmd K): jump to sections, open any project, copy your email.
- Intro scoreboard loader, text-decode headings, scroll progress, spotlight project cards,
  scroll-filled timeline, and a full-amber "lights on" contact section.
- Accessible: keyboard focus styles, skip link, `prefers-reduced-motion` support, WebGL fallback.

## Project layout

```
react-portfolio/
├── src/            React frontend (Vite)
├── backend/        Spring Boot + MySQL API for the contact form
└── README.md
```

## Run it (frontend + backend)

```bash
# 1. MySQL (Docker). Or use your own MySQL and set DB_URL / DB_USER / DB_PASSWORD
cd backend && docker compose up -d

# 2. Backend  → http://localhost:8080   (needs JDK 17+ and Maven)
mvn spring-boot:run

# 3. Frontend → http://localhost:5173   (new terminal, project root)
cd ..
npm install
npm run dev
```

Messages sent from the contact form are stored in the `contact_messages` table:
`SELECT * FROM contact_messages ORDER BY created_at DESC;`

### Deploying
- Frontend → Vercel / Netlify. Add env var `VITE_API_URL` = your backend URL.
- Backend → Railway / Render / AWS (a `Dockerfile` is in `backend/`).
  Env vars: `DB_URL` (jdbc:mysql://HOST:PORT/DB), `DB_USER`, `DB_PASSWORD`, `CORS_ORIGINS` (your frontend URL, no trailing slash).

## Frontend only

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```

## Make it yours (10 minutes)

Everything is in **`src/data.js`**:

1. `profile`: name, email, links, headline, roles that cycle in the hero, `photo` (optional, e.g. `/me.jpg` in `/public`).
2. `playerCard`: batting / bowling / fielding lines and the four count-up stats. Use real numbers.
3. `skills`, `projects`, `experience`.
4. Put your resume at `public/resume.pdf`.
5. Update the page title and description in `index.html`.
6. Colours are CSS variables at the top of `src/styles.css`.

### Adding a project
Add an object to `projects`. Without `featured: true` it appears in the "More projects" grid.
Featured projects get a case-study layout; `demo: "seats"` or `demo: "cricket"` picks the live widget.

## Deploy free
- **Vercel**: import the GitHub repo, preset "Vite".
- **Netlify**: build `npm run build`, publish `dist`.

## Interview talking points
- Seat locking: an atomic lock (`SET key value NX PX ttl`) means only one buyer wins; expiry returns the seat to sale; the database stays the source of truth. The demo in `SeatLockDemo.jsx` mirrors this.
- Cricket stats are derived from the ball-by-ball log rather than typed in. `CricketDemo.jsx` shows the idea.
