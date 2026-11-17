import { useEffect, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

// Types each word, pauses, deletes it, then moves to the next one.
export default function useTypewriter(words, { typeMs = 70, deleteMs = 40, holdMs = 1600 } = {}) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduced ? words[0] : '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      const t = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
      return () => clearInterval(t);
    }
    const word = words[index % words.length];
    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && text === word) delay = holdMs;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, typeMs, deleteMs, holdMs, reduced]);

  return reduced ? words[index % words.length] : text;
}
