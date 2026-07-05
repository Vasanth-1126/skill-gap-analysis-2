export interface CareerTemplate {
  name: string;
  description: string;
  currentProfile: string;
  targetRole: string;
  targetIndustry: string;
  experienceLevel: string;
}

export const CAREER_TEMPLATES: CareerTemplate[] = [
  {
    name: "Frontend Dev ➔ Full-Stack Architect",
    description: "React/JS Developer aiming for Senior Full-Stack with distributed backend and system design skills.",
    currentProfile: `Primary Skills: React, TypeScript, HTML/CSS, Tailwind, Redux, Git.
Experience: 3 years as a frontend software engineer. Developed multiple responsive web applications, optimized webpack bundles, integrated REST APIs, and mentored 2 junior frontend engineers.
Academics: BS in Computer Science.`,
    targetRole: "Senior Full Stack Engineer",
    targetIndustry: "SaaS & Enterprise Systems",
    experienceLevel: "Senior"
  },
  {
    name: "Data Analyst ➔ ML Engineer",
    description: "SQL & Python data analyst looking to cross over into Production Machine Learning and MLOps.",
    currentProfile: `Primary Skills: SQL, Python (Pandas, NumPy), Excel, Tableau, Basic Statistics.
Experience: 2.5 years as a business/data analyst. Building daily KPI dashboards, writing advanced SQL queries, extracting insights, and automated data pipelines using simple Python scripts.
Familiarity: Basic scikit-learn models (regression, classification).`,
    targetRole: "Machine Learning Engineer",
    targetIndustry: "AI & Automation",
    experienceLevel: "Mid-Level"
  },
  {
    name: "Junior Backend ➔ Cloud DevOps Engineer",
    description: "Express/Java programmer aiming to master Cloud Infrastructure, CI/CD, and Kubernetes orchestration.",
    currentProfile: `Primary Skills: Node.js, Express, Java, MongoDB, PostgreSQL, Git, Linux command line.
Experience: 1.5 years as a junior backend engineer. Built REST APIs, managed database migrations, wrote unit tests, and pushed code to GitHub.
Academics: Self-taught programmer.`,
    targetRole: "Cloud DevOps Engineer",
    targetIndustry: "FinTech & Cloud Infrastructure",
    experienceLevel: "Mid-Level"
  }
];
