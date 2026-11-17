"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ExperiencePhotos, AboutDetails, ExperienceDetails, ContactDetails, sectionContent } from "./portfolio-details";
import "./portfolio.css";
import GaltonBoard from "./galton-board";

const Plaza = dynamic(() => import("./plaza"), {
  ssr: false,
  loading: () => <div className="plaza-loading" role="status">Opening Emma’s little plaza…</div>,
});

export default function Home() {
  const [mode, setMode] = useState<"regular" | "3d">("regular");
  return (
    <div className={`site-mode site-mode-${mode}`}>
      <div className="mode-switch" role="group" aria-label="Website mode">
        <button type="button" aria-pressed={mode === "regular"} onClick={() => setMode("regular")}>Default</button>
        <button type="button" aria-pressed={mode === "3d"} onClick={() => setMode("3d")}>3D mode ✧</button>
      </div>
      {mode === "3d" ? <Plaza /> : <div className="editorial-site" id="top">
        <main>
          <div className="editorial-first-screen">
        <header className="editorial-header">
          <a className="editorial-wordmark" href="#top">emma wu<span aria-hidden="true">✳︎</span></a>
          <nav aria-label="Main navigation"><a href="#about">about</a><a href="#experience">experience</a><a href="#contact">say hello ↗</a></nav>
        </header>
          <section className="editorial-hero">
            <GaltonBoard />
            <div className="hero-copy">
            <span className="editorial-eyebrow">welcome to my personal site</span>
            <div className="editorial-title"><span className="hero-sparkle" aria-hidden="true">✳︎</span><h1>hi, i’m <span><a href="https://www.linkedin.com/in/emmawu155/" target="_blank" rel="noreferrer">emma</a>.</span></h1><span className="hero-heart" aria-hidden="true">♡</span></div>
            <p>UCLA Statistics &amp; Data Science student.<br />Turning data into insights, and insights into meaningful stories.</p>
            <a className="editorial-button" href="#experience">explore my experience <span aria-hidden="true">↗</span></a>
            </div>
          </section>
          </div>
          <section className="editorial-section editorial-about" id="about">
            <div className="editorial-section-heading"><span className="editorial-eyebrow">01 / {sectionContent.about.eyebrow}</span><h2>{sectionContent.about.title}</h2><p>{sectionContent.about.intro}</p></div>
            <AboutDetails />
          </section>
          <section className="editorial-section editorial-experience" id="experience">
            <span className="editorial-eyebrow">02 / {sectionContent.experience.eyebrow}</span>
            <div className="editorial-heading-row experience-heading-with-photos"><div className="experience-heading-copy"><h2>{sectionContent.experience.title}</h2><p className="editorial-intro">{sectionContent.experience.intro}</p></div><ExperiencePhotos /></div>
            <ExperienceDetails />
          </section>
          <section className="editorial-contact" id="contact">
            <span className="editorial-eyebrow">03 / {sectionContent.contact.eyebrow}</span><h2>{sectionContent.contact.title}</h2><p>{sectionContent.contact.intro}</p><ContactDetails />
          </section>
        </main>
        <footer className="editorial-footer"><a className="editorial-wordmark" href="#top">emma wu ✳︎</a><a href="#top">back to the top ↑</a></footer>
      </div>}
    </div>
  );
}
