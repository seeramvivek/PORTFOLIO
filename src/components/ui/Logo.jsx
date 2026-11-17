import { profile } from '../../data/profile';

export default function Logo({ onClick }) {
  return (
    <a href="#home" className="logo" onClick={onClick} aria-label={`${profile.name}, back to top`}>
      <span className="logo-bracket" aria-hidden="true">&lt;</span>
      <span className="logo-name">{profile.shortName}</span>
      <span className="logo-bracket" aria-hidden="true">/&gt;</span>
    </a>
  );
}
