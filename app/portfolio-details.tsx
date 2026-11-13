export const sectionContent = {
  about: {
    eyebrow: "a little about me",
    title: "hi, i’m emma!",
    intro:
      "I’m a UCLA Statistics and Data Science major with a minor in Data Science Engineering.",
  },
  experience: {
    eyebrow: "my experience",
    title: "where i’ve worked.",
    intro:
      "My experience spans data engineering, business intelligence, and data science. I’m deeply passionate about using data to uncover insights and tell meaningful stories.",
  },
  contact: {
    eyebrow: "let’s connect",
    title: "contact",
    intro:
      "Feel free to reach out by email or connect with me on LinkedIn!",
  },
};

export function AboutDetails() {
  return (
          <div className="about-grid">
            <div className="portrait-column">
              <div className="mini-card portrait-card">
                <img src="/emma-headshot.png" alt="Portrait of Emma Wu at UCLA" />
              </div>
              <p className="portfolio-blurb">
                I also do content creation on the side! Check out my portfolio{" "}
                <a href="https://eatingwuu.vercel.app/" target="_blank" rel="noreferrer">here</a>.
              </p>
            </div>
            <div className="about-notes">
              <section>
                <h3>Currently into</h3>
                <ul>
                  <li>Playing basketball</li>
                  <li>Exploring new restaurants</li>
                  <li>Lifting</li>
                </ul>
              </section>

              <section className="school-involvements">
                <h3>School involvements</h3>
                <div className="involvement-links">
                  <a href="https://datascienceunion.com/" target="_blank" rel="noreferrer">
                    <strong>UCLA Data Science Union</strong><span>Visit organization ↗</span>
                  </a>
                  <a href="https://statisticsucla.com/" target="_blank" rel="noreferrer">
                    <strong>UCLA Statistics Club</strong><span>Marketing Chair · Visit organization ↗</span>
                  </a>
                </div>
              </section>

            </div>
          </div>
  );
}

export function ExperienceDetails() {
  return (
          <div className="experience-content">
            <div className="timeline">
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-meta" /></span>
                <div>
                  <small>Jun–Sep 2026 · Menlo Park, CA</small>
                  <h3>Meta</h3>
                  <p><strong>Data Engineer Intern</strong><br />Central Product · Experimentation Platform</p>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-kohls" /></span>
                <div>
                  <small>Oct 2025–Mar 2026 · Remote</small>
                  <h3>Kohl’s Corporate</h3>
                  <p><strong>Data Scientist</strong><br />Contract through UCLA Data Science Union</p>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-sentry" /></span>
                <div>
                  <small>Jun–Sep 2025 · San Francisco, CA</small>
                  <h3>Sentry (Sentry.io)</h3>
                  <p><strong>Business Intelligence Intern</strong></p>
                  <a
                    className="experience-link"
                    href="https://blog.sentry.io/meet-sentrys-2025-summer-interns/"
                    target="_blank"
                    rel="noreferrer"
                  >Meet Sentry’s 2025 summer interns ↗</a>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-break-through" /></span>
                <div>
                  <small>Mar 2024–Apr 2025 · Los Angeles, CA</small>
                  <h3>Break Through Tech AI</h3>
                  <p><strong>Fellow</strong><br />UCLA · Cornell Tech</p>
                </div>
              </article>
            </div>

            <section className="experience-toolkit" aria-labelledby="toolkit-title">
              <h3 id="toolkit-title">Technical toolkit</h3>
              <div className="skill-group">
                <strong>Programming languages</strong>
                <div className="skill-chips"><span>Python</span><span>R</span><span>SQL</span><span>LookML</span></div>
              </div>
              <div className="skill-group">
                <strong>Tools &amp; libraries</strong>
                <div className="skill-chips"><span>Git</span><span>BigQuery</span><span>Google Cloud Platform</span><span>AI tooling</span><span>Apache Hive</span><span>Jupyter</span><span>Looker</span><span>NumPy</span><span>Pandas</span></div>
              </div>
              <div className="skill-group">
                <strong>Concepts</strong>
                <div className="skill-chips"><span>Data Science</span><span>Data Visualization</span><span>Machine Learning</span><span>Business Intelligence</span><span>ETL/ELT</span><span>Semantic Modeling</span></div>
              </div>
            </section>

            <section className="experience-awards" aria-labelledby="awards-title">
              <h3 id="awards-title">Awards</h3>
              <ul>
                <li>UCLA ASA DataFest 2025 Finalist</li>
                <li>LA Hacks 2024 Sponsor Track — 1st Place</li>
                <li>UCLA ACM HOTH XI — 1st Place</li>
              </ul>
            </section>
          </div>
  );
}

export function ContactDetails() {
  return (
          <div className="contact-card">
            <a href="mailto:emmawu@ucla.edu"><span>email</span>emmawu@ucla.edu</a>
            <div><span>citizenship</span>U.S. Citizen</div>
            <div className="contact-links">
              <a className="linkedin-button" href="https://www.linkedin.com/in/emmawu155" target="_blank" rel="noreferrer">
                <span className="linkedin-mark" aria-hidden="true">in</span>
                <strong>LinkedIn</strong>
                <small aria-hidden="true">↗</small>
              </a>
            </div>
          </div>
  );
}
