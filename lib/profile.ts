export const profile = {
  name: "Musibau Bolaji",
  fullName: "Bolaji Musibau Anifowose",
  title: "Backend Developer",
  location: "Abeokuta, Nigeria",
  phone: "+234 806 318 9660",
  email: "bolajimusibau20@gmail.com",
  github: "https://github.com/adigson",
  linkedin: "https://www.linkedin.com/in/musibau-bolaji/",
  summary:
    "Backend developer building RESTful APIs, managing databases, and writing server-side logic. Hands-on experience with Node.js, Express, SQL and NoSQL databases, and API testing. Brings a practical, user-aware approach to reliable backend systems.",
  skills: [
    "Node.js",
    "Express.js",
    "JavaScript",
    "REST API design",
    "PostgreSQL",
    "MongoDB",
    "Supabase",
    "JWT / OAuth",
    "Git / GitHub",
    "Postman",
    "Database design",
    "Error handling",
    "Render deployment",
  ],
  experience: [
    {
      role: "Backend Development Intern",
      company: "BeTechified",
      period: "September 2026 – Present",
      description:
        "BeTechified is a technology learning platform that has trained more than 100,000 learners across Africa.",
      highlights: [
        "Built REST API endpoints with Node.js and Express for a learner registration platform.",
        "Designed and managed PostgreSQL tables for storing user and cohort data.",
        "Implemented JWT-based authentication and role-based access control for an admin dashboard.",
        "Wrote automated tests with Postman to validate API responses and error handling.",
        "Deployed a backend application to Render and configured environment variables.",
      ],
    },
    {
      role: "Junior Backend Developer Intern",
      company: "Little Drop Bootcamp",
      period: "July 2021 – June 2022",
      highlights: [
        "Developed and maintained backend services handling queries and daily API requests.",
        "Designed a relational database schema that reduced query response times by 30%.",
        "Built authentication flows including email verification and password reset functionality.",
      ],
    },
  ],
  education: {
    degree: "B.Sc. International Relations",
    institution: "Obafemi Awolowo University, Ile-Ife",
  },
  certifications: [
    "BeTechified Backend Development Certificate (2026)",
    "Back-End Development & APIs v8 (2021)",
  ],
  projects: [
    {
      name: "Retail Inventory & Expiry Management API",
      kind: "REST API",
      period: "2026",
      description:
        "A REST API for managing retail products, inventory levels, expiry dates, stock alerts, and case-insensitive SKU uniqueness.",
      details: [
        "Models everyday inventory workflows, including expiry visibility and stock monitoring.",
        "Designed around clear REST resources and reliable product lookup.",
      ],
      ux: "Helps retail teams check stock, spot approaching expiry dates, and keep product records consistent.",
      system:
        "The API models products, inventory quantities, expiry dates, and case-insensitive SKU lookups.",
      stack: ["Node.js", "Express", "JavaScript", "REST API"],
      url: "https://github.com/adigson/retail-inventory-expiry-management-api",
      caseStudyUrl:
        "https://github.com/adigson/retail-inventory-expiry-management-api/blob/main/docs/case-study.md",
    },
    {
      name: "CRUD API / Todo API",
      kind: "Backend API",
      period: "2026",
      description:
        "A learning project demonstrating core create, read, update, and delete workflows with Node.js and Express.",
      details: [
        "Practices resource-oriented endpoint design and request validation.",
        "Uses a lightweight in-memory data store to keep the example approachable.",
      ],
      ux: "A simple task flow demonstrates creating, viewing, updating, and deleting todo records.",
      system:
        "Node.js and Express REST endpoints operate on an in-memory data store for CRUD practice.",
      stack: ["Node.js", "Express", "JavaScript", "REST"],
      url: "https://github.com/adigson/week3-crud-api",
      caseStudyUrl: null,
    },
    {
      name: "URL Shortener",
      kind: "API project",
      period: "Learning project",
      description:
        "A freeCodeCamp-based project exploring URL validation, short codes, and redirect behaviour.",
      details: [
        "A forked learning project, presented here as practice rather than original production software.",
      ],
      ux: "Explores turning a long destination into a shorter link that can be shared.",
      system:
        "A learning exercise around URL validation, short codes, and HTTP redirect behaviour.",
      stack: ["JavaScript", "Node.js", "API"],
      url: "https://github.com/adigson/boilerplate-project-urlshortener",
      caseStudyUrl: null,
    },
  ],
};
