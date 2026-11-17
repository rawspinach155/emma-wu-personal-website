export const sectionContent = {
  about: {
    eyebrow: "a little about me",
    title: "hi, i’m emma!",
    intro:
      <>I’m a <a className="academic-link" href="https://catalog.registrar.ucla.edu/major/2021/statisticsbs?siteYear=2021" target="_blank" rel="noreferrer">UCLA Statistics and Data Science major</a> with a <a className="academic-link" href="https://catalog.registrar.ucla.edu/minor/2025/DataScienceEngineeringMinor?siteYear=2025" target="_blank" rel="noreferrer">minor in Data Science Engineering</a>.</>,
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
    <>
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
                <h3>currently into</h3>
                <ul>
                  <li>Playing basketball</li>
                  <li>Exploring new restaurants</li>
                  <li>Making matcha &amp; coffee</li>
                </ul>
              </section>

              <section className="school-involvements">
                <h3>school involvements</h3>
                <div className="involvement-links">
                  <a href="https://datascienceunion.com/" target="_blank" rel="noreferrer">
                    <strong>UCLA Data Science Union</strong><span>2024–present · Visit organization ↗︎</span>
                  </a>
                  <a href="https://statisticsucla.com/" target="_blank" rel="noreferrer">
                    <strong>UCLA Statistics Club</strong><span>Marketing Chair 2024–2026 · Visit organization ↗︎</span>
                  </a>
                </div>
              </section>

            </div>
          </div>
              <section className="relevant-coursework">
                <h3>relevant coursework</h3>
                <p><a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS100B" target="_blank" rel="noreferrer">Mathematical Statistics</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS100A" target="_blank" rel="noreferrer">Probability</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS100C" target="_blank" rel="noreferrer">Linear Models</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS101A" target="_blank" rel="noreferrer">Data Analysis and Regression</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS101B" target="_blank" rel="noreferrer">Design and Analysis of Experiment</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS101C" target="_blank" rel="noreferrer">Statistical Models</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS102A" target="_blank" rel="noreferrer">Computational Statistics with R</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS102B" target="_blank" rel="noreferrer">Optimization for Statistics</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/STATS102C" target="_blank" rel="noreferrer">Monte Carlo Methods</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2025/math115a?siteYear=2025" target="_blank" rel="noreferrer">Linear Algebra</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2025/stats167?siteYear=2025" target="_blank" rel="noreferrer">Databases</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2023/comsci143?siteYear=2023" target="_blank" rel="noreferrer">Data Management Systems</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2025/COMSCI145?siteYear=2025" target="_blank" rel="noreferrer">Data Mining</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2023/statsc161?siteYear=2023" target="_blank" rel="noreferrer">AI and Machine Learning</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/comsci180?siteYear=2024" target="_blank" rel="noreferrer">Algorithms and Complexity</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2023/comscim148?siteYear=2023" target="_blank" rel="noreferrer">Data Science</a>, <a className="academic-link" href="https://catalog.registrar.ucla.edu/course/2024/comscim146?siteYear=2024" target="_blank" rel="noreferrer">Machine Learning</a>.</p>
              </section>
    </>
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
                  <h3><a className="academic-link" href="https://meta.com" target="_blank" rel="noreferrer">Meta</a></h3>
                  <p><strong>Data Engineer Intern</strong><br />Central Product · Experimentation Platform</p>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-kohls" /></span>
                <div>
                  <small>Oct 2025–Mar 2026 · Remote</small>
                  <h3><a className="academic-link" href="https://corporate.kohls.com/" target="_blank" rel="noreferrer">Kohl’s Corporate</a></h3>
                  <p><strong>Data Scientist</strong><br />Contract through UCLA Data Science Union</p>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-sentry" /></span>
                <div>
                  <small>Jun–Sep 2025 · San Francisco, CA</small>
                  <h3><a className="academic-link" href="https://sentry.io" target="_blank" rel="noreferrer">Sentry (Sentry.io)</a></h3>
                  <p><strong>Business Intelligence Intern</strong></p>
                  <a
                    className="experience-link"
                    href="https://blog.sentry.io/meet-sentrys-2025-summer-interns/"
                    target="_blank"
                    rel="noreferrer"
                  >Meet Sentry’s 2025 summer interns ↗︎</a>
                </div>
              </article>
              <article>
                <span className="company-logo-tile" aria-hidden="true"><span className="company-logo logo-break-through" /></span>
                <div>
                  <small>Mar 2024–Apr 2025 · Los Angeles, CA</small>
                  <h3><a className="academic-link" href="https://www.breakthroughtech.org/programs/" target="_blank" rel="noreferrer">Break Through Tech AI</a></h3>
                  <p><strong>Fellow</strong><br />UCLA · Cornell Tech</p>
                </div>
              </article>
            </div>

            <section className="experience-toolkit" aria-labelledby="toolkit-title">
              <h3 id="toolkit-title">technical toolkit</h3>
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
                <div className="skill-chips"><span>Data Science</span><span>Data Visualization</span><span>Machine Learning</span><span>Business Intelligence</span><span>ETL/ELT</span></div>
              </div>
            </section>

            <section className="experience-awards" aria-labelledby="awards-title">
              <h3 id="awards-title">awards</h3>
              <ul>
                <li><a className="academic-link" href="http://datafest.stat.ucla.edu/2025-asa-datafesttm-at-ucla/2025-datafest-results/" target="_blank" rel="noreferrer">UCLA ASA DataFest 2025</a> Finalist</li>
                <li><a className="academic-link" href="https://devpost.com/software/medibuddy-j52hfo?ref_content=my-projects-tab&amp;ref_feature=my_projects" target="_blank" rel="noreferrer">LA Hacks 2024</a> Sponsor Track — Category 1st Place</li>
                <li><a className="academic-link" href="https://devpost.com/software/westwood-community-garden?ref_content=my-projects-tab&amp;ref_feature=my_projects" target="_blank" rel="noreferrer">UCLA ACM HOTH XI</a> — Category 1st Place</li>
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
                <small aria-hidden="true">↗︎</small>
              </a>
            </div>
          </div>
  );
}

export function ExperiencePhotos({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "experience-photos-full-width" : "experience-heading-photos"} style={fullWidth ? { display: "flex", flexDirection: "row", flexWrap: "nowrap", width: "100%", gap: "12px" } : undefined}>                <figure className="experience-polaroid experience-polaroid-meta">
                  <img src="/experience/meta.jpg" alt="Emma at Meta" width="1400" height="933" loading="lazy" />
                  <figcaption>Meta · summer 2026</figcaption>
                </figure>
                <figure className="experience-polaroid experience-polaroid-sentry">
                  <img src="/experience/sentry.jpg" alt="Emma at Sentry" width="1400" height="1050" loading="lazy" />
                  <figcaption>Sentry · summer 2025</figcaption>
                </figure>
</div>
  );
}
