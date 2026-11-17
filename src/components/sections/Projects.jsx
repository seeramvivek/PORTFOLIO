import SectionHeading from '../ui/SectionHeading.jsx';
import ProjectCard from '../projects/ProjectCard.jsx';
import { projects } from '../../data/projects';

export default function Projects() {
  return (
    <section id="projects" className="section section-alt" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Featured Projects"
          id="projects-title"
          title="Selected work"
          intro="Three systems across full-stack development, data engineering and quality engineering. Each one opens into a full case study with its architecture, design decisions and an interactive preview you can use right here."
        />
        <div className="project-list">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
