import { lazy, Suspense, useEffect, useRef } from 'react';
import useHashRoute from './hooks/useHashRoute';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollProgress from './components/layout/ScrollProgress.jsx';
import BackToTop from './components/layout/BackToTop.jsx';
import Home from './components/sections/Home.jsx';
import { getProject } from './data/projects';
import { profile } from './data/profile';

const ProjectPage = lazy(() => import('./components/projects/ProjectPage.jsx'));

const BASE_TITLE = `${profile.name} | Software Developer · Full Stack · Python`;

export default function App() {
  const route = useHashRoute();
  const prevView = useRef(route.view);
  const project = route.view === 'project' ? getProject(route.slug.split('--')[0]) : null;
  const view = route.view === 'project' && !project ? 'home' : route.view;

  // Keep the document title in sync with the current view.
  useEffect(() => {
    document.title = project ? `${project.name}: ${project.tagline} | ${profile.name}` : BASE_TITLE;
  }, [project]);

  // Scroll to the right place when the route changes.
  useEffect(() => {
    const switched = prevView.current !== view;
    prevView.current = view;
    const behavior = switched ? 'auto' : 'smooth';
    if (view === 'project') {
      const anchor = route.slug.split('--')[1];
      if (!anchor) window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (!switched) return; // same page: the browser already handled the anchor jump
    const id = route.section;
    requestAnimationFrame(() => {
      const el = id && id !== 'home' ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior });
      else window.scrollTo({ top: 0, behavior });
    });
  }, [view, route.section, route.slug]);

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar view={view} />
      <main id="main" tabIndex={-1}>
        {view === 'project' ? (
          <Suspense fallback={<div className="page-loading" role="status">Loading project…</div>}>
            <ProjectPage project={project} anchor={route.slug.split('--')[1]} />
          </Suspense>
        ) : (
          <Home />
        )}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
