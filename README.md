# Seeram Vivek Chandra · Developer Portfolio

Personal portfolio built with **React 19 + Vite**. Dark, responsive, accessible, with three featured project case studies that each include an interactive preview running in the browser.

## Features

- Hero with typewriter titles, animated node-network background and portrait
- Sections: Home, About (intro, What I Do, How I Work, education timeline), Projects, Skills, Contact
- Three project case studies: problem, solution, architecture diagram, tech stack with reasons, features vs. roadmap, engineering decisions
- Interactive previews:
  - **SprintMind**: Kanban board with drag-and-drop, live teammate events and AI subtask breakdown
  - **InsightForge**: data-cleaning pipeline, KPI dashboard, revenue chart with forecast, backtest and generated SQL
  - **QualityGate**: a real test runner that runs 14 test cases against two branches and drafts bug reports for failures
- Working contact form with validation, loading, success and error states (Netlify Forms or Formspree)
- SEO meta tags, Open Graph / Twitter cards, JSON-LD `Person` schema
- Accessibility: skip link, semantic landmarks, keyboard support, focus styles, ARIA live regions, `prefers-reduced-motion`
- Code-split project pages and previews, no heavy UI libraries

## Tech

React 19, Vite 7, react-icons, plain CSS with design tokens (no CSS framework needed).

## Project structure

```
├── index.html                  # SEO meta, fonts
├── netlify.toml                # build + caching/security headers
├── .env.example                # optional Formspree endpoint
├── public/                     # favicon, og-image.jpg, robots.txt, __forms.html (Netlify form detection)
└── src/
    ├── main.jsx / App.jsx      # entry + hash router
    ├── data/                   # ALL content lives here (profile, projects, skills)
    ├── hooks/                  # routing, active section, typewriter, reveal, reduced motion
    ├── assets/                 # portrait (webp + jpg)
    ├── styles/                 # base, layout, sections, projects, demos
    └── components/
        ├── layout/             # Navbar, Footer, ScrollProgress, BackToTop
        ├── sections/           # Hero, About, Projects, Skills, Contact (Certifications.jsx kept but not shown)
        ├── projects/           # ProjectCard, ProjectPage, ArchitectureDiagram, ProjectPreview
        ├── demos/              # SprintMind, InsightForge, QualityGate previews
        │   └── lib/            # dataset + pipeline + forecast, ShopLite rules + test suite
        └── ui/                 # TechIcon, SectionHeading, SocialLinks, Logo, ErrorBoundary
```

## Run locally

Requires **Node.js 20+**.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

## Edit content

Everything you see on the site comes from `src/data/`:

- `profile.js`: name, titles, intro, links, education, certifications, About text
- `projects.js`: the three case studies. Set `repoUrl` or `liveUrl` on a project and its buttons appear automatically.
- `skills.js`: skill categories

**Resume button:** put your PDF in `public/` (e.g. `public/Seeram-Vivek-Chandra-Resume.pdf`) and set `resumeUrl: '/Seeram-Vivek-Chandra-Resume.pdf'` in `profile.js`. The button stays hidden until you do.

## Deploy

### Netlify (recommended, the contact form works with zero setup)

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project →** pick the repo.
3. Netlify reads `netlify.toml` (build `npm run build`, publish `dist`). Click **Deploy**.
4. Go to **Forms → Enable form detection**, then **Deploys → Trigger deploy → Deploy site** (detection only starts on the next deploy).
5. Submissions appear under **Forms → contact**. Add an email notification there to get each message in your inbox.

Or drag and drop: run `npm run build` and drop the `dist` folder onto app.netlify.com/drop (the form needs a Git-connected or CLI deploy to be detected reliably).

### Vercel or GitHub Pages

Netlify Forms only works on Netlify, so use Formspree:

1. Create a free form at formspree.io and copy its endpoint.
2. Copy `.env.example` to `.env` and set `VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxx`.
3. Add the same variable in your host's environment settings, then build and deploy `dist/`.

For GitHub Pages under a sub-path (`username.github.io/repo`), add `base: '/repo/'` to `vite.config.js`.

### After deploying

- In `index.html`, change `og:image` and `twitter:image` to the full URL (e.g. `https://your-site.netlify.app/og-image.jpg`) so link previews show your photo.
- Add a `<link rel="canonical" href="https://your-site...">` with your final domain.
- Test the form once on the live site.

## Environment variables and secrets

The only variable is `VITE_FORMSPREE_ENDPOINT`, which is public by design. Anything prefixed `VITE_` is bundled into the browser, so never put secret API keys there. The interactive previews call no external APIs.

## Quality checks done

- Desktop (1440px), tablet (820px) and mobile (390px): no horizontal overflow
- All three previews exercised in a headless browser: the AI breakdown adds subtasks, the dashboard filters and chart tooltip work, the test runner gives 14/14 on `main` and 3 failures on the refactor branch
- Contact form: validation errors, error state when the endpoint is unreachable
- No runtime errors in the console
