import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

// A quiet, developer-themed backdrop: a drifting node network on a canvas,
// layered over a masked dot grid and two soft gradient glows (in CSS).
export default function HeroBackground() {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let nodes = [];
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(26, (width * height) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const maxDist = 130;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.14 * (1 - d / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(94, 234, 212, 0.55)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!running) return;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      draw();
      frame = requestAnimationFrame(tick);
    };

    resize();
    if (reduced) draw();
    else frame = requestAnimationFrame(tick);

    // Pause the animation when the hero is off screen to save battery.
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          const shouldRun = entry.isIntersecting && !reduced;
          if (shouldRun && !running) {
            running = true;
            frame = requestAnimationFrame(tick);
          } else if (!shouldRun) {
            running = false;
            cancelAnimationFrame(frame);
          }
        })
      : null;
    io?.observe(canvas);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced) draw();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io?.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-grid-dots" />
      <div className="hero-glow glow-1" />
      <div className="hero-glow glow-2" />
      <canvas ref={canvasRef} />
    </div>
  );
}
