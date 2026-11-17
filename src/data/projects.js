// Featured projects, presented as case studies:
// problem → solution → architecture → stack → features → roadmap → decisions → interactive preview.
// Add repoUrl / liveUrl when a public repository or deployment is available; buttons appear automatically.

export const projects = [
  {
    slug: 'sprintmind',
    name: 'SprintMind',
    tagline: 'AI-powered collaborative task workspace',
    category: 'Full Stack · Real-time · AI',
    accent: '#5eead4',
    summary:
      'A real-time Kanban workspace where tasks, discussions and AI help live in one place. Teammates see board changes instantly, and a Python AI service breaks big tasks into subtasks and summarises long comment threads.',
    roles: ['Full Stack', 'Frontend', 'Backend', 'Application Development'],
    highlights: ['Live board sync over Socket.IO', 'JWT auth with role-based access', 'Python AI microservice'],
    repoUrl: null,
    liveUrl: null,
    problem:
      'Small teams often split their work across a chat app, a spreadsheet and a task board. Context gets lost between them: decisions sit in old messages, nobody is sure which card is current, and long comment threads are hard to catch up on after a day away.',
    solution:
      'SprintMind puts the board, the discussion and the catch-up in one app. Every board change is broadcast to teammates in real time, access is controlled per workspace role, and an AI assistant turns a vague task into concrete subtasks or condenses a long thread into a short summary that the team can edit.',
    architecture: {
      layers: [
        {
          name: 'Client',
          nodes: [
            { title: 'React SPA', sub: 'TypeScript · Tailwind CSS', tech: ['React.js', 'TypeScript', 'Tailwind CSS'] },
            { title: 'State & cache', sub: 'Redux Toolkit + RTK Query', tech: ['Redux Toolkit'] },
          ],
        },
        {
          name: 'API layer',
          nodes: [
            { title: 'REST API', sub: 'Node.js · Express · /api/v1', tech: ['Node.js', 'Express.js'] },
            { title: 'Auth', sub: 'JWT access + refresh, RBAC middleware', tech: ['JWT'] },
            { title: 'Realtime gateway', sub: 'Socket.IO rooms per workspace', tech: ['Socket.IO'] },
          ],
        },
        {
          name: 'Services',
          nodes: [{ title: 'AI service', sub: 'Python · FastAPI · LLM API (server-side key)', tech: ['Python', 'FastAPI'] }],
        },
        {
          name: 'Data',
          nodes: [
            { title: 'PostgreSQL', sub: 'users · workspaces · roles · tasks', tech: ['PostgreSQL'] },
            { title: 'MongoDB', sub: 'comment threads · activity log · AI history', tech: ['MongoDB'] },
          ],
        },
      ],
      flows: ['HTTPS · REST + JWT  /  WebSocket', 'internal REST · JSON', 'SQL (transactions) + document queries'],
    },
    stack: [
      { name: 'React.js', why: 'Component-based UI for the board, task drawer and chat panels.' },
      { name: 'TypeScript', why: 'Shared types for API payloads and socket events catch mismatches at compile time.' },
      { name: 'Tailwind CSS', why: 'Fast, consistent styling with a small design-token set.' },
      { name: 'HTML5', why: 'Semantic markup and native drag-and-drop for moving cards.' },
      { name: 'Redux Toolkit', why: 'Board state, optimistic updates with rollback, and RTK Query for caching API calls.' },
      { name: 'Node.js', why: 'Runs the API and the Socket.IO server in one process during development.' },
      { name: 'Express.js', why: 'Versioned REST routes, validation and error-handling middleware.' },
      { name: 'JWT', why: 'Short-lived access tokens plus refresh tokens in httpOnly cookies.' },
      { name: 'Socket.IO', why: 'Pushes task and comment events to everyone in the same workspace room.' },
      { name: 'Python', why: 'AI service that builds prompts and validates model output.' },
      { name: 'FastAPI', why: 'Typed endpoints with Pydantic models for the AI service.' },
      { name: 'PostgreSQL', why: 'Relational core: memberships, roles and tasks need constraints and transactions.' },
      { name: 'MongoDB', why: 'Append-heavy, flexible documents: comment threads, activity feed, AI request history.' },
      { name: 'Git', why: 'Feature branches, small commits and pull-request reviews against main.' },
    ],
    features: [
      'Sign up and log in with JWT access tokens and rotating refresh tokens',
      'Workspace roles (owner, admin, member, viewer) enforced by API middleware',
      'Kanban board with drag-and-drop and optimistic updates',
      'Real-time sync of task moves, edits and comments across all open sessions',
      'Presence indicators showing who is viewing the board',
      'AI subtask breakdown: turns a task title and description into a checklist',
      'AI thread summary: condenses long comment threads into key points',
      'Activity log of every change, stored per workspace',
    ],
    roadmap: [
      'File attachments stored in Amazon S3',
      'Email and in-app notification digests',
      'Sprint burndown analytics',
      'Offline mode with queued sync',
    ],
    contributions: [
      'Owned the build end to end: requirements, database schema, API design, UI and testing',
      'Designed the split between PostgreSQL and MongoDB and the event names for Socket.IO',
      'Wrote the prompt templates and output validation for the AI service',
      'Built the reusable component set and board interactions in React',
    ],
    decisions: [
      {
        title: 'Two databases, each for what it does best',
        text: 'Memberships and tasks are relational and need foreign keys and transactions, so they live in PostgreSQL. Comments and activity events are written constantly and vary in shape, so they go to MongoDB.',
      },
      {
        title: 'Authenticated sockets, not just authenticated routes',
        text: 'The Socket.IO handshake verifies the same JWT as the REST API, and a client joins a workspace room only after a membership check, so events never reach someone outside the workspace.',
      },
      {
        title: 'Making AI output safe to render',
        text: 'The AI service asks the model for JSON matching a schema, validates it with Pydantic, retries once on failure, and otherwise returns a clear error instead of half-parsed text. The API key never leaves the server.',
      },
      {
        title: 'Optimistic UI with rollback',
        text: 'A card moves instantly in the UI; if the server rejects the change, Redux restores the previous state and shows why. The board feels fast without lying about what was saved.',
      },
    ],
    approach: [
      'Wrote user stories and an entity-relationship diagram before any code',
      'Defined REST routes and socket event contracts as shared TypeScript types',
      'Built vertical slices (auth → board → realtime → AI) so each step was usable',
      'Tested API routes and reducers as each slice landed',
    ],
    demo: 'sprintmind',
  },
  {
    slug: 'insightforge',
    name: 'InsightForge',
    tagline: 'Retail sales analytics & forecasting platform',
    category: 'Data Analytics · Data Engineering · ML',
    accent: '#818cf8',
    summary:
      'An end-to-end analytics pipeline for multi-region retail sales data: it ingests messy sales exports, cleans and validates them with Pandas, loads a PostgreSQL warehouse, and turns the result into exploratory analysis, a demand forecast and Power BI dashboards.',
    roles: ['Data Analyst', 'Python Developer', 'Junior Data Engineer', 'AI/ML'],
    highlights: ['Pandas cleaning & validation pipeline', 'PostgreSQL star schema', 'Forecast + Power BI dashboards'],
    repoUrl: null,
    liveUrl: null,
    problem:
      "Regional stores send monthly sales as CSV or Excel exports with different column names, missing values, duplicate rows and the odd impossible number. Managers can't answer simple questions (which region is slipping, which category to stock up on next month) without hours of manual spreadsheet work.",
    solution:
      'InsightForge automates the path from raw files to answers. A Python pipeline standardises and validates every file, enriches it with a public holidays API, and loads a star schema in PostgreSQL. On top of that sit SQL views for reporting, a Jupyter-based exploratory and statistical analysis, a scikit-learn demand forecast, and Power BI and Excel outputs that managers can use directly.',
    architecture: {
      layers: [
        {
          name: 'Sources',
          nodes: [
            { title: 'Store exports', sub: 'CSV + Excel sales files', tech: ['Excel'] },
            { title: 'Holidays API', sub: 'public REST API, cached locally', tech: ['REST APIs'] },
          ],
        },
        {
          name: 'Pipeline',
          nodes: [
            { title: 'Ingest', sub: 'Python readers + requests', tech: ['Python'] },
            { title: 'Clean & validate', sub: 'Pandas · NumPy · schema checks', tech: ['Pandas', 'NumPy'] },
          ],
        },
        {
          name: 'Warehouse',
          nodes: [{ title: 'PostgreSQL', sub: 'fact_sales · dim_store · dim_product · dim_date + SQL views', tech: ['PostgreSQL', 'SQL'] }],
        },
        {
          name: 'Analysis & outputs',
          nodes: [
            { title: 'EDA & statistics', sub: 'Jupyter notebooks', tech: ['Jupyter'] },
            { title: 'Forecast model', sub: 'scikit-learn regression', tech: ['scikit-learn'] },
            { title: 'Dashboards', sub: 'Power BI + Excel reports', tech: ['Power BI', 'Excel'] },
          ],
        },
      ],
      flows: ['file drop + scheduled API pull', 'bulk load (upsert)', 'SQL views / model features'],
    },
    stack: [
      { name: 'Python', why: 'Runs the whole pipeline as a configurable command-line job.' },
      { name: 'Pandas', why: 'Standardising columns, type coercion, deduplication and imputation.' },
      { name: 'NumPy', why: 'Vectorised outlier checks (IQR) and feature calculations.' },
      { name: 'REST APIs', why: 'Pulls public holiday dates so the model knows about festive spikes.' },
      { name: 'PostgreSQL', why: 'Star-schema warehouse with constraints that reject bad rows.' },
      { name: 'SQL', why: 'Reporting views: monthly revenue, region growth, category mix, top products.' },
      { name: 'Jupyter', why: 'Exploratory analysis and statistical tests, documented step by step.' },
      { name: 'scikit-learn', why: 'Regression with lag and seasonality features, compared against a naive baseline.' },
      { name: 'Power BI', why: 'Interactive dashboard connected to the PostgreSQL views.' },
      { name: 'Excel', why: 'Monthly summary workbook for people who live in spreadsheets.' },
      { name: 'Data Visualization', why: 'Trend, distribution and comparison charts during EDA and in reports.' },
    ],
    features: [
      'Column mapping that unifies differently named fields across store files',
      'Data-quality checks: missing values, duplicates, negative quantities, IQR outliers',
      'Quality report per run listing every row that was fixed, flagged or rejected',
      'Star-schema load into PostgreSQL with upserts, so reruns are safe',
      'SQL reporting views for revenue, growth, category mix and top products',
      'Exploratory and statistical analysis: seasonality, correlation, region comparison',
      'Demand forecast evaluated on a time-based hold-out against a naive baseline',
      'Power BI dashboard and an auto-generated Excel summary',
    ],
    roadmap: [
      'Scheduled orchestration with Apache Airflow',
      'Automated data-drift alerts on new files',
      'Forecast confidence intervals in the dashboard',
    ],
    contributions: [
      'Designed the warehouse schema and built the pipeline end to end',
      'Wrote the data-quality rules and the per-run quality report',
      'Carried out the EDA and statistical analysis and wrote up findings in notebooks',
      'Built the forecast features, evaluation and the dashboard pages',
    ],
    decisions: [
      {
        title: 'Validate before you load, not after',
        text: 'Every rule (types, ranges, required fields, duplicates) runs in Pandas first, and PostgreSQL constraints act as a second safety net. Bad rows are logged with a reason instead of silently dropped.',
      },
      {
        title: 'A star schema for reporting',
        text: 'One fact table with store, product and date dimensions keeps SQL simple and makes Power BI relationships obvious.',
      },
      {
        title: 'Honest model evaluation',
        text: 'The forecast is tested on the most recent months it never saw during training and is always compared to a naive "same as last year" baseline, so any improvement is measured, not assumed.',
      },
      {
        title: 'Idempotent pipeline runs',
        text: 'Loads use upserts keyed on natural identifiers, so running the pipeline twice on the same files never doubles the numbers.',
      },
    ],
    approach: [
      'Listed the business questions first, then designed the schema to answer them',
      'Profiled the raw data and wrote cleaning rules for each problem found',
      'Built and tested the pipeline stage by stage on small sample files',
      'Validated dashboard numbers against direct SQL queries',
    ],
    demo: 'insightforge',
  },
  {
    slug: 'qualitygate',
    name: 'QualityGate',
    tagline: 'Test automation & quality engineering framework',
    category: 'QA · Test Automation · CI/CD',
    accent: '#fbbf24',
    summary:
      'A layered testing framework for ShopLite, an e-commerce web application with login, search, cart and checkout. It combines manual test design, Playwright and Selenium UI automation, API and database tests, bug tracking and a Dockerised CI pipeline that runs on every pull request.',
    roles: ['QA Engineer', 'Software Test Engineer', 'Automation Tester', 'Software Development'],
    highlights: ['Playwright + Pytest page-object suite', 'API, SQL and Java Selenium layers', 'Dockerised GitHub Actions pipeline'],
    repoUrl: null,
    liveUrl: null,
    problem:
      'Manually re-testing login, search, cart and checkout after every change is slow and inconsistent. Pricing and checkout bugs are the expensive ones, yet they are exactly what gets skipped when time is short, and scattered test scripts give no clear picture of release health.',
    solution:
      'QualityGate organises testing into layers that run automatically. Test cases are designed with proper techniques first, then automated where it pays off: fast API and database checks on every change, end-to-end UI journeys in Playwright, a cross-browser smoke suite in Java Selenium, and a CI pipeline that spins up the app in Docker, runs the suites and publishes a report.',
    architecture: {
      layers: [
        {
          name: 'Test design',
          nodes: [
            { title: 'Test plan & cases', sub: 'boundary values · equivalence classes · decision tables', tech: ['Manual Testing'] },
            { title: 'Bug tracking', sub: 'GitHub Issues templates', tech: ['GitHub Issues'] },
          ],
        },
        {
          name: 'Automation',
          nodes: [
            { title: 'UI E2E', sub: 'Playwright + Pytest, page objects', tech: ['Playwright', 'Pytest'] },
            { title: 'Smoke (cross-browser)', sub: 'Selenium WebDriver · Java · JUnit 5', tech: ['Selenium', 'Java', 'JUnit 5'] },
            { title: 'API & DB', sub: 'Pytest + requests · Postman/Newman · SQL checks', tech: ['Postman', 'SQL'] },
          ],
        },
        {
          name: 'System under test',
          nodes: [{ title: 'ShopLite', sub: 'web app + REST API + PostgreSQL in Docker Compose', tech: ['Docker', 'PostgreSQL'] }],
        },
        {
          name: 'Pipeline',
          nodes: [
            { title: 'GitHub Actions', sub: 'smoke → API → E2E on every PR · nightly regression', tech: ['GitHub Actions'] },
            { title: 'Reports', sub: 'HTML report + screenshots as build artifacts', tech: ['CI/CD'] },
          ],
        },
      ],
      flows: ['cases → automated tests', 'HTTP / browser / SQL', 'docker compose up → run → report'],
    },
    stack: [
      { name: 'Manual Testing', why: 'Test plan, scenarios and exploratory sessions before anything is automated.' },
      { name: 'Functional Testing', why: 'Every user-facing rule (login, search, cart, coupons, checkout) has a case.' },
      { name: 'Regression Testing', why: 'A tagged suite runs nightly and before merges to catch old bugs coming back.' },
      { name: 'Playwright', why: 'Reliable end-to-end journeys with auto-waiting, tracing and screenshots.' },
      { name: 'Pytest', why: 'Fixtures, parametrised data and markers (smoke, api, e2e, regression).' },
      { name: 'Python', why: 'Language for the main framework, API tests and test data helpers.' },
      { name: 'Selenium', why: 'Cross-browser smoke checks on Chrome and Firefox.' },
      { name: 'Java', why: 'The Selenium smoke suite, built with Maven and JUnit 5.' },
      { name: 'API Testing', why: 'Status codes, response schemas, auth and negative cases for every endpoint.' },
      { name: 'Postman', why: 'Exploratory API collection, also run headless with Newman in CI.' },
      { name: 'SQL', why: 'Verifies orders and stock in PostgreSQL after each checkout test.' },
      { name: 'Git', why: 'Tests live next to the app code and go through the same pull requests.' },
      { name: 'Docker', why: 'Identical app + database environment locally and in CI.' },
      { name: 'GitHub Actions', why: 'Runs the suites on every pull request and nightly.' },
    ],
    features: [
      'Test plan and documented test cases built with boundary-value, equivalence and decision-table techniques',
      'Page Object Model for Playwright with reusable fixtures and test-data builders',
      'Parametrised data-driven tests for login, search filters and coupon rules',
      'API suite covering auth, products, cart and orders, including negative paths',
      'Database assertions that check order rows and stock levels after checkout',
      'Java Selenium smoke suite on Chrome and Firefox',
      'Bug reports filed with severity, priority, steps, expected vs actual, and evidence',
      'CI pipeline: Docker Compose up → smoke → API → E2E → HTML report artifact',
    ],
    roadmap: [
      'Deploy a shared test environment on AWS EC2',
      'Visual regression snapshots for key pages',
      'Basic load testing of the checkout API',
    ],
    contributions: [
      'Owned the full test strategy: test plan, framework design and every suite',
      'Designed the framework structure, markers and fixtures',
      'Wrote the CI workflow and Docker Compose setup',
      'Logged and triaged defects with clear reproduction steps',
    ],
    decisions: [
      {
        title: 'Test at the cheapest layer that catches the bug',
        text: 'Pricing rules are checked through the API in milliseconds; only true user journeys go through the browser. That keeps the UI suite small and stable.',
      },
      {
        title: 'Page objects and fixtures over copy-paste',
        text: 'Selectors live in one page class each, so a UI change means one edit, not twenty. Fixtures create fresh users and carts so tests never depend on each other.',
      },
      {
        title: 'Same environment everywhere',
        text: 'Docker Compose starts the app and a seeded PostgreSQL the same way on a laptop and in GitHub Actions, which removes most "works on my machine" failures.',
      },
      {
        title: 'Failures that explain themselves',
        text: 'Every failed UI test saves a screenshot and Playwright trace, and the HTML report links them, so a failure can be understood without re-running it.',
      },
    ],
    approach: [
      'Read requirements and wrote the test plan and risk list first',
      'Designed cases manually and picked the high-value ones to automate',
      'Built the framework skeleton, then grew suites layer by layer',
      'Added CI once the suites were stable locally',
    ],
    demo: 'qualitygate',
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
