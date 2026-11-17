import Logo from '../ui/Logo.jsx';
import SocialLinks from '../ui/SocialLinks.jsx';
import { navLinks, profile } from '../../data/profile';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>Software developer building full-stack applications, data pipelines and automated test suites.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks />
      </div>
      <div className="container footer-base">
        <p>© {new Date().getFullYear()} {profile.name}. Designed and built with React.</p>
        <p className="footer-location">{profile.location}</p>
      </div>
    </footer>
  );
}
