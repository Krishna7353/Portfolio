// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE: everything on the site comes from here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Krishna Rathod",
  role: "Full-stack developer",
  headline:
    "I build web apps that keep working when a thousand people click at once.",
  about: [
    "I'm a full-stack developer who likes the unglamorous parts of software: data models that don't break, APIs that explain their errors, and screens that stay calm under load.",
    "My favourite problems sit where the frontend meets concurrency: live scores that update for everyone, and seat maps where two people can never book the same seat.",
  ],




  email: "krishna16rathod@gmail.com",
  github: "https://github.com/Krishna7353",
  linkedin: "https://www.linkedin.com/in/krishnarathod11/",
  resume: "./krishnaResume.pdf", // put your resume.pdf inside the /public folder
  status: "Open to full-time roles",
  coreStack: "React, Node.js, MongoDB, Redis",
  photo: "./photoProfile.png", // e.g. "/me.jpg" after putting your photo in /public. Leave empty to show initials.
  roles: ["Full-stack developer", "Seat-lock engineer", "Cricket stats nerd"],
};

// Shown on the collectible "player card" in the About section.
export const playerCard = {
  position: "All-rounder",
  batting: "Frontend: React, JavaScript(ES6), CSS",
  bowling: "Backend: Java, SpringBoot, JSP",
  fielding: "Tooling: Git, Postman, Vercel",
  stats: [
    { label: "Projects shipped", value: 6, suffix: "" },
    { label: "Commits", value: 1200, suffix: "+" },
    { label: "Technologies", value: 22, suffix: "" },
    { label: "Cups of chai", value: 900, suffix: "+" },
  ],
};

export const skills = [
  { group: "Frontend", items: ["React", "JavaScript (ES6+)", "HTML5 and CSS3", "Responsive design"] },
  { group: "Backend", items: ["Java", "SpringBoot", "REST APIs", "Hibernate", "Spring Security"] },
  { group: "Data", items: ["MongoDB", "PostgreSQL", "Redis", "Mongoose", "SQL"] },
  { group: "Tooling", items: ["Git and GitHub", "Docker", "Postman", "Vercel", "Linux"] },
];

// `featured: true` projects get a full case study with a live demo.
// `demo` picks which interactive widget is shown: "cricket" or "seats".
export const projects = [
  {
    id: "event-booking",
    featured: true,
    demo: "seats",
    title: "Event Booking System with Seat Locking",
    category: "Full-stack",
    tagline:
      "Two people can't book the same seat, even when they click in the same millisecond.",
    description:
      "A ticketing app where choosing a seat places a temporary lock. The seat stays reserved while the buyer pays, and goes back on sale if they leave.",
    highlights: [
      "Atomic seat locks with Redis SET NX and a 10-minute TTL, so double booking can't happen",
      "Live seat map over WebSockets as other buyers lock and release seats",
      "Payment webhook turns a lock into a permanent reservation",
      "Background job clears expired locks; PostgreSQL stays the source of truth",
    ],
    stack: ["React", "Node.js", "Express", "Redis", "PostgreSQL", "WebSockets", "Razorpay"],
    github: "https://github.com/your-username/event-booking-seat-locking",
    live: "https://example.com",
  },
  {
    id: "cricket-management",
    featured: true,
    demo: "cricket",
    title: "Cricket Management System",
    category: "Full-stack",
    tagline: "One place to run a club season, from fixtures to the final scorecard.",
    description:
      "Club secretaries were juggling spreadsheets and group chats. This app manages teams, players, fixtures and live scoring, and works out the statistics for you.",
    highlights: [
      "Ball-by-ball scoring with extras, wickets and undo, pushed to every viewer with Socket.IO",
      "Batting average, strike rate, economy and net run rate calculated from the ball log",
      "Role-based access for admins, scorers and players using JWT",
      "Round-robin fixture generator and an automatic points table",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT"],
    github: "https://github.com/your-username/cricket-management-system",
    live: "https://example.com",
  },
  {
    id: "realtime-chat",
    title: "Real-time Chat App",
    category: "Real-time",
    tagline: "Rooms, typing indicators and read receipts.",
    description:
      "Group and direct messaging with presence, message history and optimistic UI so sending feels instant.",
    stack: ["React", "Socket.IO", "Node.js", "MongoDB"],
    github: "https://github.com/your-username/realtime-chat",
    live: "https://example.com",
  },
  {
    id: "url-shortener",
    title: "URL Shortener with Analytics",
    category: "Full-stack",
    tagline: "Short links plus a dashboard of who clicked, where and when.",
    description:
      "Redis-cached redirects keep links fast, while click events feed charts by country, device and day.",
    stack: ["Node.js", "Express", "Redis", "MongoDB", "React"],
    github: "https://github.com/your-username/url-shortener",
    live: "https://example.com",
  },
  {
    id: "expense-dashboard",
    title: "Expense Tracker Dashboard",
    category: "Frontend",
    tagline: "Budgets, categories and charts that explain where the money went.",
    description:
      "A responsive dashboard with monthly budgets, filters, recurring expenses and CSV export.",
    stack: ["React", "Recharts", "Context API", "CSS"],
    github: "https://github.com/your-username/expense-dashboard",
    live: "https://example.com",
  },
  {
    id: "job-tracker",
    title: "Job Application Tracker",
    category: "Frontend",
    tagline: "A kanban board for the job hunt.",
    description:
      "Drag applications between Applied, Interview and Offer, with notes, deadlines and reminders.",
    stack: ["React", "Drag and drop", "LocalStorage"],
    github: "https://github.com/your-username/job-tracker",
    live: "https://example.com",
  },
];

export const experience = [
  {
    when: "2025",
    title: "Software Engineering Intern",
    place: "Rest Coder Academy ",
    text: "Built and shipped internal dashboard features in React, and wrote Node.js APIs with test coverage.",
  },
  {
    when: "2022 to 2026",
    title: "B.TECH. in Computer Science",
    place: "Dayananda Sagar University",
    text: "Focus on data structures, databases and distributed systems. Led the college tech club's web team.",
  },
];