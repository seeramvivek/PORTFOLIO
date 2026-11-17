import { lazy, Suspense, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { LuArrowLeft, LuArrowRight, LuArrowUpRight, LuCircleCheck, LuCircleDashed, LuPlay, LuTarget, LuLightbulb } from 'react-icons/lu';
import TechIcon from '../ui/TechIcon.jsx';
import ErrorBoundary from '../ui/ErrorBoundary.jsx';
import ArchitectureDiagram from './ArchitectureDiagram.jsx';
import useReveal from '../../hooks/useReveal';
import { projects } from '../../data/projects';

const DEMOS = {
  sprintmind: lazy(() => import('../demos/SprintMindDemo.jsx')),
  insightforge: lazy(() => import('../demos/InsightForgeDemo.jsx')),
  qualitygate: lazy(() => import('../demos/QualityGateDemo.jsx')),
};

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'stack', label: 'Tech stack' },
  { id: 'features', label: 'Features' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'preview', label: 'Live preview' },
];

export default function ProjectPage({ project, anchor }) {
  useReveal([project.slug]);
  const Demo = DEMOS[project.demo];
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  useEffect(() => {
    if (!anchor) return undefined;
    const t = setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 120);
    return () => clearTimeout(t);
  }, [anchor, project.slug]);

  const jump = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <article className="project-page" style={{ '--accent': project.accent }} aria-labelledby="project-title">
      <header className="pp-hero">
        <div className="hero-glow glow-1" aria-hidden="true" />
        <div className="container">
          <a href="#projects" className="back-link">
            <LuArrowLeft aria-hidden="true" /> All projects
          </a>
          <p className="project-kicker">
            <span className="project-number">0{idx + 1}</span> {project.category}
          </p>
          <h1 id="project-title" className="pp-title">{project.name}</h1>
          <p className="pp-tagline">{project.tagline}</p>
          <p className="pp-summary">{project.summary}</p>

          <div className="pp-actions">
            <a href="#preview" onClick={jump('preview')} className="btn btn-primary">
              <LuPlay aria-hidden="true" /> Open live preview
            </a>
            {project.repoUrl && (
              <a href={project.repoUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                <FaGithub aria-hidden="true" /> Source code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                Live site <LuArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>

          <dl className="pp-meta">
            <div>
              <dt>Relevant roles</dt>
              <dd>{project.roles.join(' · ')}</dd>
            </div>
            <div>
              <dt>Core stack</dt>
              <dd className="pp-meta-icons">
                {project.stack.slice(0, 9).map((s) => (
                  <span key={s.name} title={s.name}>
                    <TechIcon name={s.name} size={20} />
                    <span className="sr-only">{s.name}</span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="container pp-layout">
        <nav className="pp-toc" aria-label="On this page">
          <p>On this page</p>
          <ul>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} onClick={jump(t.id)}>{t.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pp-content">
          <section id="overview" className="pp-section" aria-labelledby="overview-h">
            <h2 id="overview-h" className="pp-h2">Overview</h2>
            <div className="ps-grid">
              <div className="card ps-card" data-reveal>
                <span className="icon-tile tone-warn"><LuTarget aria-hidden="true" /></span>
                <h3>The problem</h3>
                <p>{project.problem}</p>
              </div>
              <div className="card ps-card" data-reveal style={{ '--delay': '100ms' }}>
                <span className="icon-tile"><LuLightbulb aria-hidden="true" /></span>
                <h3>The solution</h3>
                <p>{project.solution}</p>
              </div>
            </div>
          </section>

          <section id="architecture" className="pp-section" aria-labelledby="arch-h">
            <h2 id="arch-h" className="pp-h2">Architecture</h2>
            <div className="card arch-card" data-reveal>
              <ArchitectureDiagram architecture={project.architecture} name={project.name} />
            </div>
          </section>

          <section id="stack" className="pp-section" aria-labelledby="stack-h">
            <h2 id="stack-h" className="pp-h2">Tech stack &amp; why</h2>
            <ul className="stack-grid">
              {project.stack.map((s, i) => (
                <li key={s.name} className="stack-item" data-reveal style={{ '--delay': `${(i % 3) * 60}ms` }}>
                  <span className="stack-icon"><TechIcon name={s.name} size={22} /></span>
                  <div>
                    <h3>{s.name}</h3>
                    <p>{s.why}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="features" className="pp-section" aria-labelledby="features-h">
            <h2 id="features-h" className="pp-h2">Features</h2>
            <div className="feature-grid">
              <div className="card" data-reveal>
                <h3 className="list-title">Core features</h3>
                <ul className="feature-list">
                  {project.features.map((f) => (
                    <li key={f}>
                      <LuCircleCheck className="ok" aria-hidden="true" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="feature-side">
                <div className="card" data-reveal style={{ '--delay': '100ms' }}>
                  <h3 className="list-title">Roadmap <span className="pill">Planned</span></h3>
                  <ul className="feature-list is-planned">
                    {project.roadmap.map((f) => (
                      <li key={f}>
                        <LuCircleDashed aria-hidden="true" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card" data-reveal style={{ '--delay': '160ms' }}>
                  <h3 className="list-title">My role</h3>
                  <ul className="bolt-list">
                    {project.contributions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="decisions" className="pp-section" aria-labelledby="decisions-h">
            <h2 id="decisions-h" className="pp-h2">Engineering decisions</h2>
            <div className="decision-grid">
              {project.decisions.map((d, i) => (
                <div key={d.title} className="card decision-card" data-reveal style={{ '--delay': `${(i % 2) * 90}ms` }}>
                  <span className="decision-index">0{i + 1}</span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))}
            </div>
            <div className="card approach-card" data-reveal>
              <h3 className="list-title">Development approach</h3>
              <ol className="approach-inline">
                {project.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </div>
          </section>

          <section id="preview" className="pp-section" aria-labelledby="preview-h">
            <h2 id="preview-h" className="pp-h2">Live preview</h2>
            <ErrorBoundary fallback={<p className="demo-error" role="alert">The interactive preview couldn&apos;t load. Please refresh the page.</p>}>
              <Suspense fallback={<div className="demo-loading" role="status">Loading preview…</div>}>
                <Demo />
              </Suspense>
            </ErrorBoundary>
          </section>

          <a href={`#project-${next.slug}`} className="next-project" style={{ '--accent': next.accent }}>
            <span>Next project</span>
            <strong>
              {next.name} <LuArrowRight aria-hidden="true" />
            </strong>
            <em>{next.tagline}</em>
          </a>
        </div>
      </div>
    </article>
  );
}
