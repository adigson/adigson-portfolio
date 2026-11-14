"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "@/lib/profile";

type Repository = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
};

type GitHubData = {
  repositoryCount: number;
  languages: { name: string; count: number }[];
  repositories: Repository[];
};

type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

const initialLogs = [
  "system.boot() completed",
  "Musibau Bolaji profile loaded",
  "Listening for your next request...",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

export default function Dashboard() {
  const [github, setGithub] = useState<GitHubData | null>(null);
  const [githubError, setGithubError] = useState("");
  const [apiStatus, setApiStatus] = useState<"checking" | "operational" | "degraded">("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [logs, setLogs] = useState(initialLogs);
  const [projectViews, setProjectViews] = useState<Record<string, "ux" | "system">>({});
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestStatus, setGuestStatus] = useState("");
  const [shortInput, setShortInput] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortStatus, setShortStatus] = useState("");
  const [busy, setBusy] = useState(false);

  function addLog(message: string) {
    const time = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
    setLogs((current) => [...current.slice(-5), `${time} ${message}`]);
  }

  useEffect(() => {
    const started = performance.now();
    fetch("/api/health")
      .then(async (response) => {
        if (!response.ok) throw new Error("health check failed");
        await response.json();
        setLatency(Math.round(performance.now() - started));
        setApiStatus("operational");
      })
      .catch(() => {
        setLatency(null);
        setApiStatus("degraded");
      });

    fetch("/api/github")
      .then(async (response) => {
        if (!response.ok) throw new Error("GitHub data could not be loaded.");
        return (await response.json()) as GitHubData;
      })
      .then(setGithub)
      .catch((error: Error) => setGithubError(error.message));

    fetch("/api/guestbook")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Guestbook could not be loaded.");
        setGuestbook(result.entries as GuestbookEntry[]);
      })
      .catch((error: Error) => setGuestStatus(error.message));
  }, []);

  async function refreshGuestbook() {
    try {
      const response = await fetch("/api/guestbook");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Guestbook could not be loaded.");
      setGuestbook(result.entries as GuestbookEntry[]);
    } catch (error) {
      setGuestStatus(error instanceof Error ? error.message : "Guestbook could not be loaded.");
    }
  }

  async function submitGuestbook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setGuestStatus("");
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName, message: guestMessage }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Message could not be saved.");
      setGuestbook((entries) => [result.entry as GuestbookEntry, ...entries].slice(0, 10));
      setGuestName("");
      setGuestMessage("");
      setGuestStatus("Message written to the guestbook.");
      addLog("[POST] guestbook entry saved");
    } catch (error) {
      setGuestStatus(error instanceof Error ? error.message : "Message could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function createShortLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setShortStatus("");
    setShortUrl("");
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shortInput }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not shorten that URL.");
      setShortUrl(result.shortUrl as string);
      setShortStatus("Link created. It is ready to share.");
      addLog("[POST] new short link created");
    } catch (error) {
      setShortStatus(error instanceof Error ? error.message : "Could not shorten that URL.");
    } finally {
      setBusy(false);
    }
  }

  function logContact(kind: "linkedin" | "email") {
    addLog(
      kind === "linkedin"
        ? "[INFO] LinkedIn profile handshake initialized"
        : "[INFO] Email contact intent initialized",
    );
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Musibau Bolaji home">
          <span className="brand-mark">mb<span>.</span></span>
          <span className="brand-caption">PERSONAL SYSTEMS<br />ENGINEERED WITH INTENT</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#github">GitHub</a>
          <a href="#playground">Playground</a>
          <a href="#guestbook">Guestbook</a>
        </nav>
        <Link aria-label="Open print-ready resume" className="availability" href="/resume"><span className="pulse-dot" /> RESUME ↗</Link>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> PORTFOLIO SYSTEM / 001</div>
          <h1>Building systems.<br /><span>Making them human.</span></h1>
          <p className="hero-intro">
            I&apos;m <strong>{profile.name}</strong> — a backend developer building REST APIs and data-driven products
            with Node.js. I bring a user-aware approach to reliable, useful software.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore the system <span aria-hidden="true">↘</span></a>
            <a className="text-link" href="mailto:bolajimusibau20@gmail.com" onClick={() => logContact("email")}>Let&apos;s talk <span aria-hidden="true">↗</span></a>
            <Link className="text-link" href="/resume">Resume <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-meta"><span>NODE.JS / PRODUCT ENGINEERING</span><span className="meta-separator" /><span>PEOPLE-FOCUSED BUILDER</span></div>
        </div>
        <div className="system-card" aria-label="Live portfolio system status">
          <div className="card-topline"><span>LIVE SYSTEM OVERVIEW</span><span className="live-label"><i /> LIVE</span></div>
          <div className="status-line"><span className="status-icon">{apiStatus === "operational" ? "✓" : apiStatus === "degraded" ? "!" : "·"}</span><div><strong>{apiStatus === "operational" ? "All systems operational" : apiStatus === "degraded" ? "API needs attention" : "Checking portfolio API..."}</strong><small>{apiStatus === "operational" ? "Health route responding normally" : apiStatus === "degraded" ? "Health route did not respond" : "Waiting for health route"}</small></div></div>
          <div className="metric-row">
            <div className="metric"><span>API RESPONSE</span><strong>{latency === null ? "--" : `${latency}`}<small>{latency === null ? "CHECKING" : "MS"}</small></strong></div>
            <div className="metric"><span>FOCUS</span><strong className="metric-word">BUILD<span className="cursor">_</span></strong><small>THINGS THAT MATTER</small></div>
          </div>
          <div className="chart-wrap">
            <div className="chart-label"><span>SIGNAL PREVIEW</span><span>ILLUSTRATIVE TRACE</span></div>
            <svg className="signal-chart" viewBox="0 0 520 90" role="img" aria-label="Illustrative animated system signal">
              <defs><linearGradient id="signal-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b7fa64" stopOpacity=".2" /><stop offset="100%" stopColor="#b7fa64" stopOpacity="0" /></linearGradient></defs>
              <path className="chart-area" d="M0 67 C20 66 20 50 42 55 S70 68 90 48 S118 56 138 42 S170 52 190 37 S220 49 240 30 S270 43 290 34 S320 48 340 27 S370 37 390 24 S420 41 440 20 S470 30 490 17 S510 22 520 13 V90 H0Z" />
              <path className="chart-line" d="M0 67 C20 66 20 50 42 55 S70 68 90 48 S118 56 138 42 S170 52 190 37 S220 49 240 30 S270 43 290 34 S320 48 340 27 S370 37 390 24 S420 41 440 20 S470 30 490 17 S510 22 520 13" />
              <circle className="chart-point" cx="520" cy="13" r="4" />
            </svg>
          </div>
          <div className="card-footer"><span><i className="tiny-dot" /> HEALTH ROUTE {apiStatus === "operational" ? "ONLINE" : apiStatus === "degraded" ? "OFFLINE" : "CHECKING"}</span><span>NODE.JS / VERCEL</span></div>
        </div>
      </section>

      <div className="ticker" aria-label="Areas of focus">
        <span>NODE.JS</span><b>✳</b><span>EXPRESS</span><b>✳</b><span>REST API DESIGN</span><b>✳</b><span>POSTGRESQL</span><b>✳</b><span>BACKEND DEVELOPMENT</span><b>✳</b>
      </div>

      <section className="content-section work-section" id="work">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> SELECTED BUILDS / 01</div><h2>Small projects.<br /><span>Real foundations.</span></h2></div>
          <p>From useful APIs to thoughtful interactions, I like understanding both the people using a product and the systems powering it.</p>
        </div>
        <div className="project-grid">
          {profile.projects.map((project, index) => {
            const view = projectViews[project.name] ?? "ux";
            return (
              <article className="project-card" key={project.name}>
                <div className="project-top"><span className="project-number">0{index + 1}</span><span>{project.kind} / {project.period}</span><a href={project.url} target="_blank" rel="noreferrer" aria-label={`View ${project.name} on GitHub`}>↗</a></div>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
                <div className="toggle-row" role="group" aria-label={`${project.name} view`}>
                  <button aria-pressed={view === "ux"} className={view === "ux" ? "toggle-active" : ""} onClick={() => setProjectViews((state) => ({ ...state, [project.name]: "ux" }))}>THE UX VIEW</button>
                  <button aria-pressed={view === "system"} className={view === "system" ? "toggle-active" : ""} onClick={() => setProjectViews((state) => ({ ...state, [project.name]: "system" }))}>THE SYSTEM VIEW</button>
                </div>
                <div className="project-insight"><span className="insight-icon">{view === "ux" ? "◎" : "⌘"}</span><p>{view === "ux" ? project.ux : project.system}</p></div>
                <div className="tag-row">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {project.caseStudyUrl && (
                  <a className="case-study-link" href={project.caseStudyUrl} target="_blank" rel="noreferrer">
                    Read case study <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section experience-section" id="experience">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> EXPERIENCE / 02</div><h2>Engineering with<br /><span>context.</span></h2></div>
          <p>Backend engineering, service operations, and a practical understanding of the people who depend on reliable systems.</p>
        </div>
        <div className="experience-layout">
          <div className="experience-list">
            {profile.experience.map((job) => (
              <article className="experience-entry" key={`${job.company}-${job.role}`}>
                <div className="experience-meta"><span>{job.company}</span><time>{job.period}</time></div>
                <h3>{job.role}</h3>
                {job.description && <p className="experience-description">{job.description}</p>}
                <ul>{job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </article>
            ))}
          </div>
          <aside className="profile-aside">
            <div className="profile-block">
              <span className="summary-label">EDUCATION</span>
              <h3>{profile.education.degree}</h3>
              <p>{profile.education.institution}</p>
            </div>
            <div className="profile-block">
              <span className="summary-label">CERTIFICATIONS</span>
              {profile.certifications.map((certification) => <p className="certification" key={certification}>{certification}</p>)}
            </div>
            <div className="profile-block">
              <span className="summary-label">TOOLKIT</span>
              <div className="profile-skills">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </div>
            <a className="resume-link" href="/resume">VIEW PRINT-READY RESUME <span>↗</span></a>
          </aside>
        </div>
      </section>

      <section className="content-section github-section" id="github">
        <div className="section-heading github-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> OPEN SOURCE / 02</div><h2>Code in motion.</h2></div>
          <a className="text-link" href="https://github.com/adigson" target="_blank" rel="noreferrer">github.com/adigson <span aria-hidden="true">↗</span></a>
        </div>
        <div className="github-dashboard">
          <div className="github-summary">
            <div className="summary-label">PUBLIC REPOSITORIES</div>
            <div className="repo-count">{github ? github.repositoryCount : "--"}<span> REPOS</span></div>
            <p>Latest work, pulled live from GitHub and refreshed every 15 minutes.</p>
            <div className="language-title">LANGUAGE MIX <span>BY PRIMARY REPOSITORY LANGUAGE</span></div>
            {github?.languages.slice(0, 5).map((language) => {
              const max = Math.max(...github.languages.map((item) => item.count), 1);
              return <div className="language-row" key={language.name}><span>{language.name}</span><div className="language-track"><i style={{ width: `${(language.count / max) * 100}%` }} /></div><span>{language.count}</span></div>;
            })}
            {!github && !githubError && <div className="loading-copy">Connecting to GitHub...</div>}
            {githubError && <div className="error-copy">{githubError}</div>}
          </div>
          <div className="repo-list">
            <div className="repo-list-head"><span>RECENTLY UPDATED</span><span>LIVE API</span></div>
            {github?.repositories.map((repository) => (
              <a className="repo-row" href={repository.url} key={repository.id} target="_blank" rel="noreferrer">
                <div className="repo-name">{repository.name}<span>{repository.description || "No description yet."}</span></div>
                <div className="repo-meta"><span>{repository.language || "—"}</span><span>☆ {repository.stars}</span><time>{formatDate(repository.updatedAt)}</time><b>↗</b></div>
              </a>
            ))}
            {!github && !githubError && <div className="loading-copy">Fetching your latest repositories...</div>}
            {githubError && <div className="error-copy">Could not reach the GitHub API. Your projects are still available above.</div>}
          </div>
        </div>
      </section>

      <section className="content-section playground-section" id="playground">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> INTERACTIVE API / 03</div><h2>Try the system.</h2></div>
          <p>Real requests, real responses. These small tools run through serverless Node.js API routes on this portfolio.</p>
        </div>
        <div className="playground-grid">
          <article className="tool-card">
            <div className="tool-heading"><span className="tool-icon">↗</span><div><span>01 / URL SERVICE</span><h3>A shorter way there.</h3></div><span className="method-pill">POST</span></div>
            <p>Paste a destination and create a short link. Stored and redirected when a database is configured.</p>
            <form onSubmit={createShortLink}>
              <label className="sr-only" htmlFor="short-url">Long URL to shorten</label>
              <div className="input-action"><input id="short-url" type="url" placeholder="https://example.com/a/very/long/link" value={shortInput} onChange={(event) => setShortInput(event.target.value)} required maxLength={2048} /><button disabled={busy} type="submit" aria-label="Shorten URL">SHORTEN ↗</button></div>
            </form>
            {shortUrl && <a className="result-link" href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}<span>↗</span></a>}
            {shortStatus && <p className={shortUrl ? "success-copy" : "error-copy"} role="status">{shortStatus}</p>}
            <div className="endpoint"><span>ENDPOINT</span><code>POST /api/shorten</code></div>
          </article>
          <article className="tool-card terminal-card">
            <div className="tool-heading"><span className="tool-icon">⌘</span><div><span>02 / LIVE LOG STREAM</span><h3>Signals from the session.</h3></div><span className="live-label"><i /> LIVE</span></div>
            <div className="terminal" aria-live="polite">
              <div className="terminal-head"><span>musibau@portfolio ~</span><div><i /><i /><i /></div></div>
              <div className="terminal-body">{logs.map((line, index) => <p key={`${index}-${line}`}><span>{String(index + 1).padStart(2, "0")}</span>{line}</p>)}<p className="terminal-cursor"><span>_</span> awaiting interaction</p></div>
            </div>
            <div className="terminal-links"><a href={profile.linkedin} target="_blank" rel="noreferrer" onMouseEnter={() => addLog("[INFO] LinkedIn profile handshake initialized")} onClick={() => logContact("linkedin")}>LinkedIn profile ↗</a><a href={`mailto:${profile.email}`} onMouseEnter={() => addLog("[INFO] Email contact intent initialized")} onClick={() => logContact("email")}>Email Musibau ↗</a></div>
          </article>
        </div>
      </section>

      <section className="content-section guestbook-section" id="guestbook">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> LEAVE A SIGNAL / 04</div><h2>Good work is a<br /><span>conversation.</span></h2></div>
          <p>Drop a note, share an idea, or say hello. Your message is saved to the guestbook when the database is connected.</p>
        </div>
        <div className="guestbook-grid">
          <form className="guest-form" onSubmit={submitGuestbook}>
            <label htmlFor="guest-name">YOUR NAME</label>
            <input id="guest-name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="What should I call you?" required maxLength={60} />
            <label htmlFor="guest-message">YOUR MESSAGE</label>
            <textarea id="guest-message" value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} placeholder="A little note goes a long way..." required maxLength={500} rows={3} />
            <div className="guest-submit"><button className="button button-primary" type="submit" disabled={busy}>Send a signal <span>↗</span></button><span>{guestMessage.length}/500</span></div>
            {guestStatus && <p className={guestStatus.startsWith("Message written") ? "success-copy" : "error-copy"} role="status">{guestStatus}</p>}
          </form>
          <div className="guest-messages">
            <div className="guest-messages-head"><span>RECENT NOTES</span><button onClick={refreshGuestbook} type="button">REFRESH ↻</button></div>
            {guestbook.length > 0 ? guestbook.slice(0, 4).map((entry) => (
              <article className="guest-note" key={entry.id}><p>&ldquo;{entry.message}&rdquo;</p><div><strong>{entry.name}</strong><time>{formatDate(entry.created_at)}</time></div></article>
            )) : <div className="empty-notes"><span>✳</span><p>No signals yet.<br />You could be the first.</p><button type="button" onClick={refreshGuestbook}>CHECK GUESTBOOK ↻</button></div>}
          </div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#home"><span className="brand-mark">mb<span>.</span></span></a>
        <span>DESIGNED WITH INTENT. BUILT TO BE USEFUL.</span>
        <a href="#home">BACK TO TOP ↑</a>
        <span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span>
      </footer>
    </main>
  );
}
