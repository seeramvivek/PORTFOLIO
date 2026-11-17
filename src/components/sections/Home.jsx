import Hero from './Hero.jsx';
import TechMarquee from './TechMarquee.jsx';
import About from './About.jsx';
import Projects from './Projects.jsx';
import Skills from './Skills.jsx';
import Contact from './Contact.jsx';
import useReveal from '../../hooks/useReveal';

export default function Home() {
  useReveal([]);
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}
