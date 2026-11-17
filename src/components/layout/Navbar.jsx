import { useEffect, useState } from 'react';
import { LuMenu, LuX, LuArrowUpRight } from 'react-icons/lu';
import Logo from '../ui/Logo.jsx';
import useActiveSection from '../../hooks/useActiveSection';
import { navLinks, profile } from '../../data/profile';

const IDS = navLinks.map((l) => l.id);

export default function Navbar({ view }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(IDS, view === 'home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open]);

  // Clicking the link for the section you're already on still scrolls to it.
  const handleNav = (id) => (e) => {
    setOpen(false);
    if (view === 'home' && window.location.hash.replace('#', '') === id) {
      e.preventDefault();
      const el = id === 'home' ? null : document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${scrolled || open ? 'is-scrolled' : ''}`}>
      <nav className="container navbar-inner" aria-label="Main">
        <Logo onClick={handleNav('home')} />

        <ul className="nav-links">
          {navLinks.map((link) => {
            const isActive = view === 'home' ? active === link.id : link.id === 'projects';
            return (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={handleNav(link.id)} className={isActive ? 'is-active' : ''} aria-current={isActive ? 'true' : undefined}>
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="nav-actions">
          <a className="btn btn-small btn-ghost nav-cta" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn <LuArrowUpRight aria-hidden="true" />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        <ul>
          {navLinks.map((link, i) => (
            <li key={link.id} style={{ '--i': i }}>
              <a href={`#${link.id}`} onClick={handleNav(link.id)} className={view === 'home' && active === link.id ? 'is-active' : ''}>
                <span className="mobile-index">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mobile-menu-foot">{profile.email}</p>
      </div>
    </header>
  );
}
