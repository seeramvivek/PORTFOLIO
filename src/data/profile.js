// Single source of truth for personal details. Edit here, not in components.

export const profile = {
  name: 'Seeram Vivek Chandra',
  shortName: 'Seeram Vivek',
  titles: ['Software Developer', 'Full Stack Developer', 'Python Developer'],
  intro:
    'I build full-stack web apps, data pipelines and automated test suites, and I like taking a problem all the way from a rough idea to working, tested software.',
  location: 'Hyderabad, Telangana, India',
  email: 'seeramvivek4444@gmail.com',
  linkedin: 'https://linkedin.com/in/vivek-seeram-5946043b6',
  github: 'https://github.com/seeramvivek',
  // Set to a real file path (e.g. '/Seeram-Vivek-Chandra-Resume.pdf' placed in /public) to show the download button.
  resumeUrl: null,
  degree: 'B.Tech in Computer Science and Engineering',
  college: 'Vishnu Institute of Technology, Bhimavaram',
  graduation: '2025',
};

export const about = {
  paragraphs: [
    "I'm a Computer Science and Engineering graduate from Vishnu Institute of Technology, Bhimavaram (class of 2025). I enjoy the whole lifecycle of software: understanding what a user actually needs, designing the data model, writing the API and the interface, and then trying hard to break it before anyone else does.",
    'My projects deliberately cross boundaries. One is a real-time full-stack app with an AI service, one is a data pipeline that ends in forecasts and dashboards, and one is a test automation framework. Building all three taught me how frontend, backend, data and quality work fit together, and why each one matters to the others.',
  ],
  facts: [
    { label: 'Based in', value: 'Hyderabad, India' },
    { label: 'Degree', value: 'B.Tech CSE, 2025' },
    { label: 'Focus', value: 'Full stack · Data · QA' },
    { label: 'Open to', value: 'Developer, data & QA roles' },
  ],
};

export const interests = [
  {
    title: 'Full Stack Development',
    icon: 'layers',
    points: [
      'Responsive React interfaces with clean, reusable components',
      'REST APIs in Node.js and Express with JWT authentication',
      'Real-time features with Socket.IO',
    ],
  },
  {
    title: 'Data & Analytics',
    icon: 'chart',
    points: [
      'Cleaning and shaping messy data with Pandas and NumPy',
      'SQL for analysis, data modelling and reporting',
      'Dashboards in Power BI and Excel that answer real questions',
    ],
  },
  {
    title: 'Quality Engineering',
    icon: 'shield',
    points: [
      'Test case design: boundary values, equivalence classes, negative paths',
      'UI and API automation with Playwright, Selenium, Pytest and Postman',
      'Wiring tests into CI so regressions are caught on every change',
    ],
  },
  {
    title: 'AI & Cloud',
    icon: 'brain',
    points: [
      'Integrating generative AI APIs with validated, structured output',
      'Machine learning fundamentals for prediction problems',
      'Docker and AWS fundamentals for packaging and deployment',
    ],
  },
];

export const approach = [
  {
    step: '01',
    title: 'Understand',
    text: 'Start from the user and the problem. Write down what "done" means before writing code.',
  },
  {
    step: '02',
    title: 'Design',
    text: 'Sketch the data model, API contracts and architecture so the hard decisions happen on paper first.',
  },
  {
    step: '03',
    title: 'Build',
    text: 'Small, reviewable commits. Readable code over clever code. Handle the error paths, not just the happy path.',
  },
  {
    step: '04',
    title: 'Verify',
    text: 'Test at the right layer, automate what repeats, and document how to run and extend the work.',
  },
];

export const education = [
  {
    degree: 'B.Tech, Computer Science and Engineering',
    school: 'Vishnu Institute of Technology, Bhimavaram',
    period: 'Nov 2021 – Nov 2025',
    note: 'Core coursework in programming, data structures, databases, operating systems, computer networks and software engineering.',
  },
  {
    degree: 'Intermediate (MPC)',
    school: 'Sri Chaitanya Junior College, Eluru',
    period: 'Jul 2019 – May 2021',
    note: 'Mathematics, Physics and Chemistry.',
  },
  {
    degree: 'SSC, Class 10',
    school: 'Secondary School Certificate',
    period: 'Jun 2018 – Mar 2019',
    note: null,
  },
];

export const certifications = [
  {
    title: 'AWS Academy Cloud Foundations',
    issuer: 'Amazon Web Services · AWS Academy',
    text: 'Core AWS services, global infrastructure, security and the shared responsibility model, pricing and support, and cloud architecture basics.',
    tags: ['Cloud concepts', 'EC2 & S3', 'IAM', 'Architecture'],
  },
  {
    title: 'AWS Academy Generative AI Foundations',
    issuer: 'Amazon Web Services · AWS Academy',
    text: 'An introduction to AI with a focus on generative AI: foundation models and large language models, prompt engineering, responsible AI, and the AWS services and tools used for generative AI.',
    tags: ['Foundation models', 'LLMs', 'Prompt engineering', 'Responsible AI'],
  },
];

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];
