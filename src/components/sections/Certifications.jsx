import { FaAws } from 'react-icons/fa';
import { LuAward } from 'react-icons/lu';
import SectionHeading from '../ui/SectionHeading.jsx';
import { certifications } from '../../data/profile';

export default function Certifications() {
  return (
    <section id="certifications" className="section section-alt" aria-labelledby="certs-title">
      <div className="container">
        <SectionHeading index="04" eyebrow="Certifications" id="certs-title" title="Cloud & AI credentials" />
        <div className="cert-grid">
          {certifications.map((c, i) => (
            <article key={c.title} className="card cert-card" data-reveal style={{ '--delay': `${i * 100}ms` }}>
              <div className="cert-top">
                <span className="cert-logo" aria-hidden="true"><FaAws /></span>
                <LuAward className="cert-award" aria-hidden="true" />
              </div>
              <h3>{c.title}</h3>
              <p className="cert-issuer">{c.issuer}</p>
              <p className="cert-text">{c.text}</p>
              <ul className="tag-list">
                {c.tags.map((t) => (
                  <li key={t} className="tag">{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
