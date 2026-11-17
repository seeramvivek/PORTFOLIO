import { LuArrowRight, LuDownload, LuMapPin } from 'react-icons/lu';
import HeroBackground from './HeroBackground.jsx';
import SocialLinks from '../ui/SocialLinks.jsx';
import TechIcon from '../ui/TechIcon.jsx';
import useTypewriter from '../../hooks/useTypewriter';
import { profile } from '../../data/profile';
import photoWebp from '../../assets/vivek.webp';
import photoJpg from '../../assets/vivek.jpg';

const FLOATING = [
  { name: 'React.js', label: 'React', pos: 'chip-a' },
  { name: 'Python', label: 'Python', pos: 'chip-b' },
  { name: 'PostgreSQL', label: 'PostgreSQL', pos: 'chip-c' },
  { name: 'Playwright', label: 'Playwright', pos: 'chip-d' },
];

export default function Hero() {
  const typed = useTypewriter(profile.titles);
  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <HeroBackground />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-badge">
            <span className="pulse-dot" aria-hidden="true" />
            Open to software engineering roles
          </p>

          <h1 id="hero-title" className="hero-title">
            <span className="hero-hello">Hi, I&apos;m</span>
            <span className="hero-name">
              {first} <span className="gradient-text">{rest.join(' ')}</span>
            </span>
          </h1>

          <p className="hero-role" aria-live="off">
            <span className="hero-prompt" aria-hidden="true">&gt;</span>
            <span className="sr-only">{profile.titles.join(', ')}</span>
            <span aria-hidden="true">{typed}</span>
            <span className="caret" aria-hidden="true" />
          </p>

          <p className="hero-intro">{profile.intro}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View Projects <LuArrowRight aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Contact Me
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn btn-ghost" download>
                <LuDownload aria-hidden="true" /> Resume
              </a>
            )}
          </div>

          <div className="hero-meta">
            <SocialLinks />
            <span className="hero-location">
              <LuMapPin aria-hidden="true" /> {profile.location}
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="portrait">
            <div className="portrait-ring" aria-hidden="true" />
            <picture>
              <source srcSet={photoWebp} type="image/webp" />
              <img src={photoJpg} alt={`Portrait of ${profile.name}`} width="640" height="789" fetchPriority="high" />
            </picture>
            {FLOATING.map((chip) => (
              <span key={chip.name} className={`float-chip ${chip.pos}`} aria-hidden="true">
                <TechIcon name={chip.name} size={16} /> {chip.label}
              </span>
            ))}
            <div className="hero-terminal" aria-hidden="true">
              <div className="terminal-dots"><i /><i /><i /></div>
              <p><span className="t-accent">$</span> whoami</p>
              <p className="t-muted">build · ship · test · repeat</p>
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About section">
        <span />
      </a>
    </section>
  );
}
