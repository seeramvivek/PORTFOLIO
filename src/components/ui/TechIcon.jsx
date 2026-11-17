import {
  SiReact, SiTypescript, SiJavascript, SiPython, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql,
  SiTailwindcss, SiRedux, SiSocketdotio, SiGit, SiGithub, SiDocker, SiPandas, SiNumpy, SiSelenium,
  SiPytest, SiPostman, SiHtml5, SiCss, SiJsonwebtokens, SiFastapi, SiScikitlearn, SiGithubactions,
  SiJunit5, SiJupyter, SiApachemaven,
} from 'react-icons/si';
import { FaJava, FaAws, FaFileExcel } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';
import { LuSparkles, LuBrainCircuit, LuChartBar, LuChartLine, LuListChecks, LuRepeat, LuPlug, LuBug, LuDatabase, LuWorkflow, LuFlaskConical, LuRoute } from 'react-icons/lu';

// Power BI and Playwright are not in the icon sets, so they get small hand-drawn marks.
const PowerBiIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <rect x="3" y="11" width="4.5" height="10" rx="1.2" opacity=".55" />
    <rect x="9.75" y="6.5" width="4.5" height="14.5" rx="1.2" opacity=".8" />
    <rect x="16.5" y="2.5" width="4.5" height="18.5" rx="1.2" />
  </svg>
);

const PlaywrightIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M3.5 6.5c3-1.4 6-1.6 9-.6l-1.3 9.3c-.5 3.1-3.6 4.6-6 3.4-1.6-.8-2.4-2.4-2.2-4.3z" />
    <path d="M12.6 6c2.9-1 5.8-.9 8.4.4l-.9 7.6c-.3 2.7-3 4-5.1 3-.9-.4-1.5-1.1-1.9-2" />
    <path d="M6 10.5h1.6M9 10.2h1.4M15.2 9.5h1.4M18 9.7h1.3M6.6 14.5c.9.8 2.2.9 3.1.2" />
  </svg>
);

const ICONS = {
  'React.js': { Icon: SiReact, color: '#61dafb' },
  React: { Icon: SiReact, color: '#61dafb' },
  TypeScript: { Icon: SiTypescript, color: '#3178c6' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  Python: { Icon: SiPython, color: '#4b8bbe' },
  Java: { Icon: FaJava, color: '#f89820' },
  SQL: { Icon: LuDatabase, color: '#7dd3fc' },
  HTML5: { Icon: SiHtml5, color: '#e34f26' },
  CSS3: { Icon: SiCss, color: '#2965f1' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#38bdf8' },
  'Redux Toolkit': { Icon: SiRedux, color: '#9f7aea' },
  'Node.js': { Icon: SiNodedotjs, color: '#5fa04e' },
  'Express.js': { Icon: SiExpress, color: '#e6edf7' },
  'REST APIs': { Icon: LuPlug, color: '#5eead4' },
  JWT: { Icon: SiJsonwebtokens, color: '#d63aff' },
  'Socket.IO': { Icon: SiSocketdotio, color: '#e6edf7' },
  MongoDB: { Icon: SiMongodb, color: '#47a248' },
  PostgreSQL: { Icon: SiPostgresql, color: '#4f8fd6' },
  Pandas: { Icon: SiPandas, color: '#a78bfa' },
  NumPy: { Icon: SiNumpy, color: '#4dabcf' },
  Excel: { Icon: FaFileExcel, color: '#21a366' },
  'Data Analysis': { Icon: LuChartLine, color: '#fbbf24' },
  'Data Visualization': { Icon: LuChartBar, color: '#f472b6' },
  'Generative AI': { Icon: LuSparkles, color: '#c4b5fd' },
  'AI API Integration': { Icon: LuPlug, color: '#a5b4fc' },
  'Machine Learning Fundamentals': { Icon: LuBrainCircuit, color: '#f9a8d4' },
  'Manual Testing': { Icon: LuListChecks, color: '#5eead4' },
  'Functional Testing': { Icon: LuFlaskConical, color: '#86efac' },
  'Regression Testing': { Icon: LuRepeat, color: '#fcd34d' },
  'API Testing': { Icon: LuRoute, color: '#93c5fd' },
  Selenium: { Icon: SiSelenium, color: '#43b02a' },
  Playwright: { Icon: PlaywrightIcon, color: '#45ba4b' },
  Pytest: { Icon: SiPytest, color: '#4fa3e0' },
  Postman: { Icon: SiPostman, color: '#ff6c37' },
  Git: { Icon: SiGit, color: '#f05032' },
  GitHub: { Icon: SiGithub, color: '#e6edf7' },
  'VS Code': { Icon: VscVscode, color: '#3ea6ff' },
  Docker: { Icon: SiDocker, color: '#2496ed' },
  'AWS Fundamentals': { Icon: FaAws, color: '#ff9900' },
  AWS: { Icon: FaAws, color: '#ff9900' },
  'Power BI': { Icon: PowerBiIcon, color: '#f2c811' },
  FastAPI: { Icon: SiFastapi, color: '#05998b' },
  'scikit-learn': { Icon: SiScikitlearn, color: '#f7931e' },
  'GitHub Actions': { Icon: SiGithubactions, color: '#4b9bff' },
  'JUnit 5': { Icon: SiJunit5, color: '#25a162' },
  Jupyter: { Icon: SiJupyter, color: '#f37626' },
  Maven: { Icon: SiApachemaven, color: '#e3405f' },
  'GitHub Issues': { Icon: LuBug, color: '#f87171' },
  'CI/CD': { Icon: LuWorkflow, color: '#5eead4' },
};

export function getTech(name) {
  return ICONS[name] || { Icon: null, color: '#94a3b8' };
}

export default function TechIcon({ name, size = 18, className = '' }) {
  const { Icon, color } = getTech(name);
  if (!Icon) {
    return (
      <span className={`tech-monogram ${className}`} style={{ width: size, height: size, fontSize: size * 0.5 }} aria-hidden="true">
        {name.slice(0, 2)}
      </span>
    );
  }
  return <Icon className={className} style={{ color, width: size, height: size, flexShrink: 0 }} aria-hidden="true" />;
}
