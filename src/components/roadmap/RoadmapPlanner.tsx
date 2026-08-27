"use client";

import { useMemo, useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Circle,
  Cloud,
  Code2,
  Compass,
  Cpu,
  Lightbulb,
  LockKeyhole,
  Palette,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import RoadmapGraph from "./RoadmapGraph";
import type { Step, LearningResource } from "./RoadmapGraph";

type CourseGroup = { title: string; icon: LucideIcon; color: string; courses: string[] };

const courseGroups: CourseGroup[] = [
  { title: "Technology & Software", icon: Code2, color: "text-accent", courses: ["Computer Science", "Programming Fundamentals", "C Programming", "C++", "Java", "Python", "JavaScript", "TypeScript", "Data Structures & Algorithms", "Object-Oriented Programming", "Database Management", "SQL", "Backend Development", "Frontend Development", "Full-Stack Development", "Mobile App Development", "Android Development", "iOS Development", "Game Development", "Software Engineering", "System Design", "API Development", "Git & GitHub", "Open Source Development"] },
  { title: "AI & Data", icon: BrainCircuit, color: "text-accent-secondary", courses: ["AI Engineer", "Artificial Intelligence", "Machine Learning", "Deep Learning", "Generative AI", "Large Language Models", "Prompt Engineering", "AI Agents", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Data Science", "Data Analytics", "Data Visualization", "Statistics", "Mathematics for AI", "MLOps", "Big Data", "Data Engineering"] },
  { title: "Cloud & Infrastructure", icon: Cloud, color: "text-accent", courses: ["Cloud Computing", "AWS", "Microsoft Azure", "Google Cloud", "DevOps", "Docker", "Kubernetes", "Linux", "Networking", "CI/CD", "Infrastructure as Code", "Site Reliability Engineering", "Cloud Security"] },
  { title: "Cybersecurity", icon: LockKeyhole, color: "text-error", courses: ["Cybersecurity Fundamentals", "Ethical Hacking", "Penetration Testing", "Network Security", "Web Security", "Application Security", "Digital Forensics", "Malware Analysis", "Cryptography", "Security Operations", "Cloud Security", "Identity & Access Management", "Cybersecurity Governance"] },
  { title: "Design & Creative", icon: Palette, color: "text-accent-secondary", courses: ["UI Design", "UX Design", "Product Design", "Graphic Design", "Figma", "Motion Graphics", "3D Design", "Blender", "Video Editing", "Animation", "Photography", "Digital Art", "Game Art", "Web Design"] },
  { title: "Business & Finance", icon: BriefcaseBusiness, color: "text-warning", courses: ["Business Fundamentals", "Entrepreneurship", "Startup Building", "Business Analytics", "Financial Management", "Accounting", "Investment", "Stock Market", "Personal Finance", "Economics", "Marketing", "Digital Marketing", "SEO", "Social Media Marketing", "Content Marketing", "Brand Management", "Sales", "Business Strategy", "Project Management", "Product Management"] },
  { title: "Professional & Career Skills", icon: Target, color: "text-success", courses: ["Communication Skills", "Public Speaking", "English", "Technical Writing", "Business Writing", "Leadership", "Negotiation", "Critical Thinking", "Problem Solving", "Time Management", "Team Management", "Interview Preparation", "Resume Building", "Personal Branding"] },
  { title: "Science & Engineering", icon: Cpu, color: "text-accent", courses: ["Mathematics", "Statistics", "Physics", "Chemistry", "Biology", "Biotechnology", "Electronics", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Robotics", "Embedded Systems", "Internet of Things", "Semiconductor Technology", "VLSI", "CAD", "3D Printing", "Automation"] },
  { title: "Other Career Paths", icon: Compass, color: "text-muted", courses: ["Architecture", "Psychology", "Law", "Healthcare", "Healthcare Management", "Supply Chain Management", "Logistics", "Hospitality", "Aviation", "Renewable Energy", "Sustainability", "Agriculture Technology", "Food Technology", "Teaching / Education", "Research", "Freelancing"] },
];

const resourcesByGroup: Record<string, LearningResource[]> = {
  "Technology & Software": [
    { label: "MDN Learn", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
    { label: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/" },
    { label: "roadmap.sh", url: "https://roadmap.sh/" },
  ],
  "AI & Data": [
    { label: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
    { label: "scikit-learn", url: "https://scikit-learn.org/stable/user_guide.html" },
    { label: "Hugging Face Course", url: "https://huggingface.co/learn" },
  ],
  "Cloud & Infrastructure": [
    { label: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/" },
    { label: "AWS Skill Builder", url: "https://skillbuilder.aws/" },
    { label: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/" },
  ],
  Cybersecurity: [
    { label: "OWASP Web Security", url: "https://owasp.org/www-project-web-security-testing-guide/" },
    { label: "PortSwigger Academy", url: "https://portswigger.net/web-security" },
    { label: "TryHackMe", url: "https://tryhackme.com/" },
  ],
  "Design & Creative": [
    { label: "Figma Learn", url: "https://help.figma.com/hc/en-us/categories/360002051613-Get-started" },
    { label: "Google UX Design", url: "https://grow.google/certificates/ux-design/" },
    { label: "Adobe Tutorials", url: "https://helpx.adobe.com/creative-cloud/tutorials-explore.html" },
  ],
  "Business & Finance": [
    { label: "HubSpot Academy", url: "https://academy.hubspot.com/" },
    { label: "Khan Academy Economics", url: "https://www.khanacademy.org/economics-finance-domain" },
    { label: "Google Skillshop", url: "https://skillshop.withgoogle.com/" },
  ],
  "Professional & Career Skills": [
    { label: "Toastmasters Resources", url: "https://www.toastmasters.org/resources" },
    { label: "Google Career Certificates", url: "https://grow.google/certificates/" },
    { label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
  ],
  "Science & Engineering": [
    { label: "Khan Academy", url: "https://www.khanacademy.org/" },
    { label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
    { label: "NPTEL", url: "https://nptel.ac.in/courses" },
  ],
  "Other Career Paths": [
    { label: "Coursera", url: "https://www.coursera.org/" },
    { label: "edX", url: "https://www.edx.org/learn" },
    { label: "OpenLearn", url: "https://www.open.edu/openlearn/" },
  ],
};

const depthTopicsByGroup: Record<string, [string[], string[], string[], string[]]> = {
  "Technology & Software": [["computer architecture and operating-system basics", "syntax, control flow and functions", "command line, Git and debugging"], ["data structures and algorithms", "object-oriented and functional design", "databases, HTTP and APIs"], ["unit testing and error handling", "code review and documentation", "performance, security and accessibility"], ["production deployment", "system design trade-offs", "resume-ready project storytelling"]],
  "AI & Data": [["Python, notebooks and data types", "linear algebra, probability and statistics", "data cleaning and exploratory analysis"], ["supervised and unsupervised learning", "feature engineering and evaluation metrics", "PyTorch, TensorFlow or modern AI tooling"], ["experimentation and model validation", "bias, safety and responsible AI", "reproducible pipelines and versioning"], ["end-to-end case study", "deployment and monitoring", "portfolio walkthrough and interview questions"]],
  "Cloud & Infrastructure": [["Linux command line and networking", "compute, storage and identity", "security and shared-responsibility basics"], ["containers and images", "infrastructure as code", "managed databases and observability"], ["CI/CD pipelines", "autoscaling and reliability", "incident response and cost control"], ["deploy a resilient service", "architecture diagram and runbook", "certification or interview revision"]],
  Cybersecurity: [["networking, Linux and security vocabulary", "CIA triad and threat modelling", "authentication and access control"], ["web, network and application security", "cryptography and secure protocols", "security tools and logging"], ["legal lab exercises", "vulnerability reporting", "defence, monitoring and incident response"], ["documented lab portfolio", "security assessment report", "ethical-practice interview preparation"]],
  "Design & Creative": [["visual hierarchy, colour and typography", "design process and user research", "creative-tool fundamentals"], ["wireframes, prototypes and interaction", "design systems and accessibility", "feedback and iteration"], ["usability testing", "component libraries and handoff", "refining craft and visual consistency"], ["case-study storytelling", "portfolio curation", "client or product presentation"]],
  "Business & Finance": [["markets, customers and business models", "financial and commercial vocabulary", "spreadsheets and data basics"], ["strategy frameworks", "budgeting, metrics and analysis", "communication and stakeholder management"], ["case studies and decision making", "experiments and measurement", "risk and ethics"], ["business plan or campaign", "results presentation", "role-specific interview preparation"]],
  "Professional & Career Skills": [["clear written and verbal communication", "goal setting and time management", "confidence and active listening"], ["structured problem solving", "teamwork, leadership and negotiation", "professional writing and presentations"], ["mock conversations and feedback", "conflict handling and decision making", "reflection and improvement loops"], ["resume and LinkedIn", "portfolio and personal brand", "interview stories and applications"]],
  "Science & Engineering": [["mathematics and scientific method", "core theory and notation", "safety, tools and measurement"], ["domain-specific systems and components", "modelling, simulation or lab methods", "standards and engineering constraints"], ["problem sets and experiments", "analysis and error checking", "technical reports and peer feedback"], ["applied design or research project", "documentation and presentation", "career or higher-study preparation"]],
  "Other Career Paths": [["industry overview and key terminology", "professional ethics and regulations", "fundamental tools and methods"], ["role-specific skills and frameworks", "communication with stakeholders", "case examples and guided practice"], ["realistic scenarios and feedback", "professional standards", "reflection and improvement"], ["portfolio, research or career plan", "networking and applications", "interview or admissions preparation"]],
};

function makeRoadmap(course: string, group: string): Step[] {
  const resources = resourcesByGroup[group];
  if (course === "AI Engineer") return [
    { title: "Python", description: "Learn the language used to build AI systems.", topics: ["Syntax, functions and OOP", "NumPy, pandas and notebooks", "APIs, packaging and environments", "Data structures and file handling"], outcome: "Build a small data-processing script.", icon: Code2, resources: [resources[0], resources[1]] },
    { title: "Math", description: "Develop intuition behind machine-learning models.", topics: ["Vectors, matrices and eigenvalues", "Probability distributions and Bayes rule", "Descriptive statistics and hypothesis testing", "Derivatives, gradients and optimisation"], outcome: "Explain core ML maths clearly.", icon: BookOpen, resources: [resources[0], resources[1]] },
    { title: "Machine Learning", description: "Train models and evaluate them correctly.", topics: ["Regression, classification and clustering", "Feature engineering and pipelines", "Cross-validation and hyperparameter tuning", "Precision, recall, F1 and ROC-AUC"], outcome: "Complete an end-to-end ML project.", icon: BarChart3, resources: [resources[1], resources[2]] },
    { title: "Deep Learning", description: "Understand neural networks and modern model training.", topics: ["PyTorch or TensorFlow fundamentals", "Backpropagation and optimizers", "CNNs, attention and transformers", "Regularisation, tuning and evaluation"], outcome: "Train and document a neural-network project.", icon: BrainCircuit, resources: [resources[1], resources[2]] },
    { title: "NLP & LLMs", description: "Build applications with language models.", topics: ["Tokenisation and embeddings", "Prompt design and structured output", "Retrieval augmented generation", "LLM evaluation, safety and guardrails"], outcome: "Ship a useful LLM-powered app.", icon: Sparkles, resources: [resources[2], resources[1]] },
    { title: "Projects", description: "Make your work portfolio and production ready.", topics: ["FastAPI or Streamlit", "Docker and cloud deployment", "Experiment tracking and monitoring", "Portfolio storytelling and demos"], outcome: "Deploy two AI projects.", icon: Target, resources: [resources[0], resources[2]] },
  ];
  const focus = group === "Technology & Software" ? ["programming fundamentals", "core tools and architecture", "data structures and problem solving", "a deployable project"] : group === "AI & Data" ? ["Python and data foundations", "maths, statistics and domain basics", "models, tools and evaluation", "an end-to-end portfolio project"] : group === "Cloud & Infrastructure" ? ["Linux, networking and command line", "core platform services", "automation, containers and deployment", "a reliable cloud project"] : group === "Cybersecurity" ? ["security fundamentals and networking", "threats, tools and defence", "safe hands-on labs", "a documented security case study"] : group === "Design & Creative" ? ["design principles and visual foundations", "essential creative tools", "feedback-driven practice", "a portfolio case study"] : group === "Business & Finance" ? ["business and market foundations", "analysis frameworks and tools", "real-world case practice", "a measurable strategy project"] : group === "Professional & Career Skills" ? ["core communication habits", "structured practice and feedback", "real-work simulations", "a polished professional portfolio"] : group === "Science & Engineering" ? ["scientific and mathematical foundations", "core engineering concepts", "labs, simulations or problem sets", "a documented applied project"] : ["industry foundations", "role-specific core skills", "hands-on practice", "a portfolio or career plan"];
  const depth = depthTopicsByGroup[group];
  return [
    { title: "Foundation", description: `Start ${course} with the concepts and vocabulary that make later topics easier.`, topics: [focus[0], ...depth[0]], outcome: "A clear foundation and revision sheet.", icon: BookOpen, resources: [resources[0], resources[1]] },
    { title: "Core Skills", description: `Build the important skills used every day in ${course}.`, topics: [focus[1], ...depth[1]], outcome: "Confident use of the core tools.", icon: Lightbulb, resources: [resources[0], resources[2]] },
    { title: "Practice", description: "Turn knowledge into speed, judgement and reliable execution.", topics: [focus[2], ...depth[2]], outcome: "A personal error log and stronger accuracy.", icon: Target, resources: [resources[1], resources[2]] },
    { title: "Build & Showcase", description: "Create evidence of your skills that others can understand quickly.", topics: [focus[3], ...depth[3]], outcome: "A shareable proof-of-skill project.", icon: Sparkles, resources: [resources[0], resources[2]] },
  ];
}

export default function RoadmapPlanner() {
  const [filter, setFilter] = useState("AI & Data");
  const [selectedCourse, setSelectedCourse] = useState("AI Engineer");
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    async function loadRoadmapProgress() {
      try {
        const res = await fetch("/api/user/roadmap");
        if (res.ok) {
          const json = await res.json();
          if (json.progress) {
            const completedKeys = Object.keys(json.progress).filter((k) => json.progress[k]);
            const formatted = completedKeys.map((k) => {
              const [c, t] = k.split("::");
              return `${c}-${t}`;
            });
            setCompleted(formatted);
          }
        }
      } catch (err) {
        console.warn("Failed to load roadmap progress:", err);
      }
    }

    loadRoadmapProgress();
  }, []);

  const group = courseGroups.find((item) => item.courses.includes(selectedCourse)) ?? courseGroups[0];
  const roadmap = useMemo(() => makeRoadmap(selectedCourse, group.title), [selectedCourse, group.title]);
  const courses = (courseGroups.find((item) => item.title === filter)?.courses ?? []).filter((course) => course.toLowerCase().includes(search.toLowerCase()));
  const completeCount = roadmap.filter((step) => completed.includes(`${selectedCourse}-${step.title}`)).length;
  const progress = Math.round((completeCount / roadmap.length) * 100);

  function choose(course: string) {
    setSelectedCourse(course);
    const nextGroup = courseGroups.find((item) => item.courses.includes(course));
    if (nextGroup) setFilter(nextGroup.title);
  }

  function toggle(step: Step) {
    const id = `${selectedCourse}-${step.title}`;
    const willBeCompleted = !completed.includes(id);

    setCompleted((items) => willBeCompleted ? [...items, id] : items.filter((item) => item !== id));

    fetch("/api/user/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: selectedCourse,
        topicKey: step.title,
        completed: willBeCompleted,
        topicTitle: `${selectedCourse}: ${step.title}`,
      }),
    })
      .then((res) => {
        if (res.ok) {
          window.dispatchEvent(new Event("activityUpdated"));
        }
      })
      .catch((err) => {
        console.warn("Failed to sync roadmap milestone:", err);
      });
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      {/* Top Header */}
      <header className="flex items-center gap-4 border-b border-border bg-surface px-5 py-4">
        <button type="button" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted hover:text-primary transition">
          <ChevronLeft size={16} />
          <span>Roadmaps</span>
        </button>
        <span className="h-4 w-px bg-border" />
        <p className="text-sm sm:text-base font-bold text-primary">{selectedCourse}</p>
        <button type="button" className="ml-auto rounded-xl border border-border bg-base px-3 py-1 text-xs font-semibold text-muted hover:text-primary hover:bg-soft transition" aria-label="More roadmap options">
          •••
        </button>
      </header>

      <div className="grid min-h-[760px] lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left Aside Navigation */}
        <aside className="border-b border-border bg-elevated p-5 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Course Tracks
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-base px-3 py-2 text-muted focus-within:border-accent">
            <Search size={15} className="text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses..."
              className="w-full bg-transparent text-xs text-primary outline-none placeholder:text-muted"
            />
            {search ? (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="text-muted hover:text-primary">
                <X size={14} />
              </button>
            ) : null}
          </div>

          {/* Group categories list */}
          <div className="mt-4 max-h-52 space-y-1 overflow-y-auto pr-1 lg:max-h-60">
            {courseGroups.map((item) => {
              const Icon = item.icon;
              const active = item.title === filter;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setFilter(item.title)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition cursor-pointer ${
                    active
                      ? "bg-soft border border-border text-primary font-semibold shadow-sm"
                      : "text-muted hover:bg-base hover:text-primary"
                  }`}
                >
                  <Icon size={15} className={active ? "text-accent" : "text-muted"} />
                  <span className="flex-1 truncate">{item.title}</span>
                  <span className="text-[10px] text-muted font-bold">{item.courses.length}</span>
                </button>
              );
            })}
          </div>

          {/* Courses in selected group */}
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {filter}
            </p>
            <div className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
              {courses.map((course) => {
                const active = course === selectedCourse;
                return (
                  <button
                    key={course}
                    type="button"
                    onClick={() => choose(course)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer ${
                      active
                        ? "bg-soft border border-border text-primary font-bold shadow-sm"
                        : "text-muted hover:bg-base hover:text-primary"
                    }`}
                  >
                    <span className={active ? "text-accent" : "text-muted"}>
                      {active ? <ChevronRight size={15} /> : <Circle size={10} />}
                    </span>
                    <span className="truncate">{course}</span>
                  </button>
                );
              })}
              {courses.length === 0 ? (
                <p className="px-3 py-4 text-xs text-muted">No matching courses.</p>
              ) : null}
            </div>
          </div>

          {/* Overall Progress Widget */}
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-xs font-semibold text-primary">Track Progress</p>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-muted">
              <span>{completeCount}/{roadmap.length} modules</span>
              <span className="text-accent font-bold">{progress}% complete</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area — node graph */}
        <main className="relative flex min-h-0 flex-col overflow-hidden bg-surface">
          <RoadmapGraph
            roadmap={roadmap}
            selectedCourse={selectedCourse}
            group={group}
            completed={completed}
            toggle={toggle}
          />
        </main>
      </div>
    </div>
  );
}
