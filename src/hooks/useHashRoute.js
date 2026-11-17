import { useEffect, useState } from 'react';

// Tiny hash router. "#project-<slug>" opens a project page; any other hash is a section on the home page.
// Plain "#name" hashes keep links shareable and work on any static host without server rewrites.
const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));

export default function useHashRoute() {
  const [hash, setHash] = useState(read);

  useEffect(() => {
    const onChange = () => setHash(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  if (hash.startsWith('project-')) return { view: 'project', slug: hash.slice('project-'.length), hash };
  return { view: 'home', section: hash || 'home', hash };
}
