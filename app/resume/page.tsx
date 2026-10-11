import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/profile";
import PrintButton from "./print-button";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume | Musibau Bolaji",
  description: "Backend developer resume for Musibau Bolaji.",
};

export default function ResumePage() {
  return (
    <main className={styles.resumeShell}>
      <div className={styles.actions}>
        <Link href="/" className={styles.backLink}>← Portfolio</Link>
        <PrintButton />
      </div>
      <article className={styles.resumePage}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>BACKEND DEVELOPER</p>
            <h1>{profile.fullName}</h1>
            <p className={styles.intro}>{profile.summary}</p>
          </div>
          <address className={styles.contact}>
            <span>{profile.location}</span>
            <a href={`tel:${profile.phone.replaceAll(" ", "")}`}>{profile.phone}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.github} target="_blank" rel="noreferrer">github.com/adigson</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/musibau-bolaji</a>
          </address>
        </header>

        <section className={styles.section}>
          <h2>Technical skills</h2>
          <p className={styles.skills}>{profile.skills.join(" · ")}</p>
        </section>

        <section className={styles.section}>
          <h2>Experience</h2>
          {profile.experience.map((job) => (
            <article className={styles.entry} key={`${job.company}-${job.role}`}>
              <div className={styles.entryHeading}>
                <h3>{job.role} <span>· {job.company}</span></h3>
                <time>{job.period}</time>
              </div>
              {job.description && <p className={styles.entryDescription}>{job.description}</p>}
              <ul>
                {job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className={styles.section}>
          <h2>Selected projects</h2>
          {profile.projects.map((project) => (
            <article className={styles.entry} key={project.name}>
              <div className={styles.entryHeading}>
                <h3>{project.name} <span>· {project.kind}</span></h3>
                <time>{project.period}</time>
              </div>
              <p className={styles.entryDescription}>{project.description}</p>
              <ul>
                {project.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              <p className={styles.projectLinks}>
                <span>{project.stack.join(" · ")}</span>
                <a href={project.url} target="_blank" rel="noreferrer">Repository ↗</a>
              </p>
            </article>
          ))}
        </section>

        <div className={styles.bottomGrid}>
          <section className={styles.section}>
            <h2>Education</h2>
            <h3>{profile.education.degree}</h3>
            <p>{profile.education.institution}</p>
          </section>
          <section className={styles.section}>
            <h2>Certifications</h2>
            <ul>
              {profile.certifications.map((certification) => <li key={certification}>{certification}</li>)}
            </ul>
          </section>
        </div>
        <footer className={styles.resumeFooter}>References available on request</footer>
      </article>
    </main>
  );
}
