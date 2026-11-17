import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { LuMail } from 'react-icons/lu';
import { profile } from '../../data/profile';

export default function SocialLinks({ className = '', size = 18 }) {
  const links = [
    { href: profile.github, label: 'GitHub profile', Icon: FaGithub, external: true },
    { href: profile.linkedin, label: 'LinkedIn profile', Icon: FaLinkedinIn, external: true },
    { href: `mailto:${profile.email}`, label: `Email ${profile.email}`, Icon: LuMail, external: false },
  ];
  return (
    <ul className={`social-links ${className}`}>
      {links.map(({ href, label, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <Icon style={{ width: size, height: size }} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
