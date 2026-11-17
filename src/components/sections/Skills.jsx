import SectionHeading from '../ui/SectionHeading.jsx';
import TechIcon from '../ui/TechIcon.jsx';
import { skillGroups } from '../../data/skills';
import { projects } from '../../data/projects';

// Which projects use a given technology (from each project's stack and architecture).
const usage = (() => {
  const map = new Map();
  projects.forEach((p) => {
    const names = new Set(p.stack.map((s) => s.name));
    p.architecture.layers.forEach((l) => l.nodes.forEach((n) => n.tech.forEach((t) => names.add(t))));
    names.forEach((n) => map.set(n, [...(map.get(n) || []), p.name]));
  });
  // aliases between skill names and stack names
  const alias = { 'Generative AI': 'FastAPI', 'AI API Integration': 'FastAPI', 'Machine Learning Fundamentals': 'scikit-learn', 'Data Analysis': 'Jupyter', 'VS Code': 'Git', GitHub: 'Git', JavaScript: 'React.js', CSS3: 'Tailwind CSS' };
  Object.entries(alias).forEach(([k, v]) => !map.has(k) && map.set(k, map.get(v) || []));
  return map;
})();

export default function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Skills"
          id="skills-title"
          title="Technology stack"
          intro="Grouped by where they fit in a system. Hover or focus a tool to see which projects use it."
        />
        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <article key={g.title} className="card skill-card" data-reveal style={{ '--delay': `${(i % 4) * 70}ms` }}>
              <header>
                <h3>{g.title}</h3>
                <p>{g.blurb}</p>
              </header>
              <ul className="skill-items">
                {g.items.map((item) => {
                  const used = usage.get(item) || [];
                  const tip = used.length ? `Used in ${used.join(', ')}` : item;
                  return (
                    <li key={item} className="skill-item" tabIndex={0} title={tip} aria-label={`${item}. ${tip}`}>
                      <TechIcon name={item} size={18} />
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
