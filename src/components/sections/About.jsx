import { LuLayers, LuChartBar, LuShieldCheck, LuBrainCircuit, LuGraduationCap } from 'react-icons/lu';
import SectionHeading from '../ui/SectionHeading.jsx';
import { about, interests, approach, education } from '../../data/profile';

const ICONS = { layers: LuLayers, chart: LuChartBar, shield: LuShieldCheck, brain: LuBrainCircuit };

function CodeCard() {
  return (
    <div className="code-card" aria-hidden="true">
      <div className="code-card-bar">
        <div className="terminal-dots"><i /><i /><i /></div>
        <span>vivek.ts</span>
      </div>
      <pre>
        <code>
          <span className="tk-key">const</span> <span className="tk-var">vivek</span> = {'{'}
          {'\n  '}role: <span className="tk-str">&apos;Software Developer&apos;</span>,
          {'\n  '}education: <span className="tk-str">&apos;B.Tech CSE · 2025&apos;</span>,
          {'\n  '}stack: [<span className="tk-str">&apos;React&apos;</span>, <span className="tk-str">&apos;Node&apos;</span>, <span className="tk-str">&apos;Python&apos;</span>, <span className="tk-str">&apos;SQL&apos;</span>],
          {'\n  '}testing: [<span className="tk-str">&apos;Playwright&apos;</span>, <span className="tk-str">&apos;Pytest&apos;</span>],
          {'\n  '}currently: <span className="tk-str">&apos;building &amp; learning daily&apos;</span>,
          {'\n  '}openToWork: <span className="tk-bool">true</span>,
          {'\n'}{'}'};
        </code>
      </pre>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading index="01" eyebrow="About" id="about-title" title="Building software end to end" />

        <div className="about-grid">
          <div className="about-text" data-reveal>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <dl className="fact-grid">
              {about.facts.map((f) => (
                <div key={f.label} className="fact">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-reveal style={{ '--delay': '120ms' }}>
            <CodeCard />
          </div>
        </div>

        <h3 className="sub-heading" data-reveal>What I Do</h3>
        <div className="interest-grid">
          {interests.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <article key={item.title} className="card interest-card" data-reveal style={{ '--delay': `${i * 80}ms` }}>
                <span className="icon-tile"><Icon aria-hidden="true" /></span>
                <h4>{item.title}</h4>
                <ul className="bolt-list">
                  {item.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="about-bottom">
          <div>
            <h3 className="sub-heading" data-reveal>How I Work</h3>
            <ol className="approach-list">
              {approach.map((a, i) => (
                <li key={a.step} data-reveal style={{ '--delay': `${i * 80}ms` }}>
                  <span className="approach-step">{a.step}</span>
                  <div>
                    <h4>{a.title}</h4>
                    <p>{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="sub-heading" data-reveal>Education</h3>
            <ol className="timeline">
              {education.map((e, i) => (
                <li key={e.degree} className="timeline-item" data-reveal style={{ '--delay': `${i * 100}ms` }}>
                  <span className="timeline-dot" aria-hidden="true"><LuGraduationCap /></span>
                  <div className="card timeline-card">
                    <p className="timeline-period">{e.period}</p>
                    <h4>{e.degree}</h4>
                    <p className="timeline-school">{e.school}</p>
                    {e.note && <p className="timeline-note">{e.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
