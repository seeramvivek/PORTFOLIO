import TechIcon from '../ui/TechIcon.jsx';

const TECH = ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'Pandas', 'NumPy', 'Power BI', 'Playwright', 'Selenium', 'Pytest', 'Postman', 'Docker', 'AWS', 'Git'];

export default function TechMarquee() {
  const row = TECH.map((t) => (
    <li key={t}>
      <TechIcon name={t} size={20} /> <span>{t}</span>
    </li>
  ));
  return (
    <div className="marquee" role="group" aria-label="Technologies I work with">
      <ul className="marquee-track">
        {row}
        {/* duplicated for a seamless loop; hidden from assistive tech */}
        {TECH.map((t) => (
          <li key={`${t}-dup`} aria-hidden="true">
            <TechIcon name={t} size={20} /> <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
