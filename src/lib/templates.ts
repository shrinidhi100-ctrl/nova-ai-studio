export type Template = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  accent: "violet" | "blue" | "cyan";
  prompt: string;
};

export const TEMPLATES: Template[] = [
  {
    slug: "landing-page",
    name: "Landing Page",
    tagline: "Hero, features, pricing, FAQ and footer",
    category: "Marketing",
    accent: "violet",
    prompt: "Build a high-converting product landing page with hero, features, pricing and FAQ.",
  },
  {
    slug: "portfolio",
    name: "Portfolio",
    tagline: "Case studies with an editorial layout",
    category: "Marketing",
    accent: "cyan",
    prompt: "Build a designer portfolio with project case studies and a contact form.",
  },
  {
    slug: "crm",
    name: "CRM",
    tagline: "Pipeline, contacts and deal stages",
    category: "Business",
    accent: "blue",
    prompt: "Build a CRM with a kanban deal pipeline, contact records and activity timeline.",
  },
  {
    slug: "erp",
    name: "ERP",
    tagline: "Inventory, purchasing and reporting",
    category: "Business",
    accent: "violet",
    prompt: "Build an ERP module for inventory, purchase orders and supplier reporting.",
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    tagline: "KPI cards, charts and data tables",
    category: "Analytics",
    accent: "cyan",
    prompt: "Build an analytics dashboard with KPI cards, charts and a filterable data table.",
  },
  {
    slug: "saas",
    name: "SaaS Starter",
    tagline: "Auth, billing and workspace settings",
    category: "Business",
    accent: "blue",
    prompt: "Build a SaaS starter with authentication, subscription billing and workspace settings.",
  },
  {
    slug: "ecommerce",
    name: "Ecommerce",
    tagline: "Catalog, cart and checkout",
    category: "Commerce",
    accent: "violet",
    prompt: "Build an ecommerce storefront with product catalog, cart and checkout.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    tagline: "Appointments and patient records",
    category: "Vertical",
    accent: "cyan",
    prompt: "Build a clinic app with appointment booking and patient records.",
  },
  {
    slug: "finance",
    name: "Finance",
    tagline: "Portfolio tracking and statements",
    category: "Vertical",
    accent: "blue",
    prompt: "Build a personal finance app with account balances, transactions and budgets.",
  },
  {
    slug: "restaurant",
    name: "Restaurant",
    tagline: "Menu, reservations and orders",
    category: "Vertical",
    accent: "violet",
    prompt: "Build a restaurant site with menu, reservations and online ordering.",
  },
  {
    slug: "education",
    name: "Education",
    tagline: "Courses, lessons and progress",
    category: "Vertical",
    accent: "cyan",
    prompt: "Build a learning platform with courses, lessons and student progress tracking.",
  },
  {
    slug: "agency",
    name: "Agency",
    tagline: "Services, work and enquiries",
    category: "Marketing",
    accent: "blue",
    prompt: "Build a creative agency site with services, selected work and an enquiry form.",
  },
];

export type Agent = {
  id: string;
  name: string;
  role: string;
  accent: "violet" | "blue" | "cyan";
};

export const AGENTS: Agent[] = [
  { id: "planner", name: "Planner", role: "Designs the architecture and task graph", accent: "violet" },
  { id: "designer", name: "Designer", role: "Creates the UI, layout and design tokens", accent: "cyan" },
  { id: "developer", name: "Developer", role: "Writes application and API code", accent: "blue" },
  { id: "debugger", name: "Debugger", role: "Reproduces and fixes runtime errors", accent: "violet" },
  { id: "reviewer", name: "Reviewer", role: "Improves quality, types and structure", accent: "cyan" },
  { id: "tester", name: "Tester", role: "Generates unit and integration tests", accent: "blue" },
  { id: "devops", name: "DevOps", role: "Handles builds, env and deployment", accent: "violet" },
];
