import { LuArrowRight, LuPlay } from 'react-icons/lu';
import TechIcon from '../ui/TechIcon.jsx';
import ProjectPreview from './ProjectPreview.jsx';

export default function ProjectCard({ project, index }) {
  const techs = project.stack.slice(0, 8);
  return (
    <article className={`project-card ${index % 2 ? 'is-reversed' : ''}`} style={{ '--accent': project.accent }} data-reveal>
      <a href={`#project-${project.slug}`} className="project-visual" aria-label={`Open the ${project.name} case study`} tabIndex={-1}>
        <ProjectPreview slug={project.slug} />
      </a>

      <div className="project-body">
        <p className="project-kicker">
          <span className="project-number">0{index + 1}</span> {project.category}
        </p>
        <h3 className="project-title">
          <a href={`#project-${project.slug}`}>{project.name}</a>
        </h3>
        <p className="project-tagline">{project.tagline}</p>
        <p className="project-summary">{project.summary}</p>

        <ul className="project-highlights">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <ul className="chip-list" aria-label="Technologies">
          {techs.map((t) => (
            <li key={t.name} className="chip">
              <TechIcon name={t.name} size={14} /> {t.name}
            </li>
          ))}
          {project.stack.length > techs.length && <li className="chip chip-more">+{project.stack.length - techs.length}</li>}
        </ul>

        <div className="project-actions">
          <a href={`#project-${project.slug}`} className="btn btn-primary btn-small">
            Read case study <LuArrowRight aria-hidden="true" />
          </a>
          <a href={`#project-${project.slug}--preview`} className="btn btn-ghost btn-small">
            <LuPlay aria-hidden="true" /> Try it live
          </a>
        </div>
      </div>
    </article>
  );
}
