import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Blocks,
  Bot,
  Boxes,
  Check,
  Code2,
  FileUp,
  GitBranch,
  Rocket,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/nova/Logo";
import { AGENTS, TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <p className="gradient-text text-xs font-semibold uppercase tracking-[0.24em]">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{title}</h2>
        <p className="mt-4 text-muted-foreground">{sub}</p>
      </div>
    </Reveal>
  );
}

const FEATURES = [
  { icon: Bot, title: "Agent orchestration", body: "Planner, Designer, Developer and Tester collaborate on every prompt." },
  { icon: Code2, title: "Real code, real repo", body: "Full file tree, Monaco editor, diffs and search — never a black box." },
  { icon: Zap, title: "Streaming generation", body: "Watch files appear token by token with instant live preview refresh." },
  { icon: FileUp, title: "Any input", body: "PDFs, spreadsheets, ZIPs, Figma exports and screenshots become working UI." },
  { icon: GitBranch, title: "Versioning built in", body: "Every turn is a restorable checkpoint with a readable activity timeline." },
  { icon: Rocket, title: "Ship in one click", body: "Deploy, push to GitHub or export a clean ZIP of the whole project." },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-28">
      <SectionHeading
        eyebrow="Capabilities"
        title="An IDE, a team and a deploy pipeline in one prompt box"
        sub="Nova keeps the speed of prompting without giving up the control of real engineering."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <div className="glass group h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
              <span className="grid size-11 place-items-center rounded-xl bg-surface-2/70 transition-colors group-hover:gradient-brand">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Agents() {
  return (
    <section id="agents" className="relative mx-auto max-w-6xl px-4 py-28">
      <SectionHeading
        eyebrow="Multi-agent"
        title="Seven specialists, one conversation"
        sub="Each prompt is routed to the agent best suited for it, and they hand work to each other."
      />
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AGENTS.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.05}>
            <div className="glass h-full rounded-2xl p-5">
              <span
                className="mb-4 block h-1 w-10 rounded-full"
                style={{ background: `var(--${a.accent})` }}
              />
              <h3 className="font-display text-base font-semibold">{a.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{a.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function TemplateStrip() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-28">
      <SectionHeading
        eyebrow="Templates"
        title="Start from a proven foundation"
        sub="Twelve production starters you can steer with plain language from the first second."
      />
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPLATES.slice(0, 8).map((t, i) => (
          <Reveal key={t.slug} delay={i * 0.04}>
            <Link
              to="/templates"
              className="glass block h-full rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1"
            >
              <Boxes className="size-5" style={{ color: `var(--${t.accent})` }} />
              <h3 className="mt-4 font-display text-base font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="mt-8 text-center">
          <Button asChild variant="glass" size="lg">
            <Link to="/templates">Browse all templates</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "For trying Nova out",
    features: ["3 projects", "100 AI credits / month", "Live preview & code editor", "ZIP export"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    note: "For solo builders shipping weekly",
    features: [
      "Unlimited projects",
      "5,000 AI credits / month",
      "Priority agent queue",
      "GitHub sync & one-click deploy",
      "Full version history",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$79",
    note: "For teams building together",
    features: [
      "Everything in Pro",
      "Shared workspaces",
      "Comments & permissions",
      "Custom AI models",
      "Audit log & SSO",
    ],
    cta: "Start team trial",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-4 py-28">
      <SectionHeading
        eyebrow="Pricing"
        title="Pay for output, not seats you don't use"
        sub="Every plan includes the full studio. Upgrade when you need more credits and collaboration."
      />
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div
              className={cn(
                "glass relative flex h-full flex-col rounded-3xl p-7",
                p.highlight && "gradient-border shadow-[var(--shadow-glow)]",
              )}
            >
              {p.highlight && (
                <span className="gradient-brand absolute -top-3 left-7 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
              <p className="mt-6 font-display text-4xl font-semibold">
                {p.price}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0" style={{ color: "var(--cyan)" }} />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant={p.highlight ? "hero" : "glass"} size="lg" className="mt-7">
                <Link to="/auth" search={{ mode: "signup" }}>
                  {p.cta}
                </Link>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const QUOTES = [
  {
    quote:
      "We replaced a two-week discovery build with a Tuesday afternoon. The generated code passed our review with almost no edits.",
    name: "Marta Halvorsen",
    role: "Head of Product, Fieldwire",
  },
  {
    quote:
      "The agent split is the trick. Watching the Reviewer clean up after the Developer is genuinely how our team works.",
    name: "Dev Raghunathan",
    role: "Staff Engineer, Lumen Labs",
  },
  {
    quote:
      "I sketched a dashboard on paper, photographed it, and had a working React app before my coffee cooled.",
    name: "Ayo Bankole",
    role: "Founder, Northbridge",
  },
];

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-28">
      <SectionHeading
        eyebrow="Teams"
        title="Trusted where the code actually ships"
        sub="Nova is used by product teams who still review every pull request."
      />
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.name} delay={i * 0.08}>
            <figure className="glass flex h-full flex-col justify-between rounded-2xl p-6">
              <blockquote className="text-sm leading-relaxed text-foreground/90">“{q.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="gradient-brand grid size-9 place-items-center rounded-full font-display text-xs font-semibold text-primary-foreground">
                  {q.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-sm font-medium">{q.name}</span>
                  <span className="block text-xs text-muted-foreground">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Do I own the code Nova generates?",
    a: "Yes. Every project is yours — export it as a ZIP, push it to your own GitHub repository, or deploy it wherever you like.",
  },
  {
    q: "Can Nova work with an existing codebase?",
    a: "Upload a ZIP of your project and Nova indexes the file tree, then edits, refactors and debugs in place rather than starting over.",
  },
  {
    q: "What can it understand besides text?",
    a: "Screenshots, hand sketches, Figma exports, SVGs, PDFs, Word documents and spreadsheets all become context for generation.",
  },
  {
    q: "How is my data protected?",
    a: "Projects are private by default with row-level access rules, role-based permissions and validated, rate-limited APIs.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "Generation pauses instead of failing silently. Your projects, files and history stay fully available and editable.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-4 py-28">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        sub="Everything people ask before their first build."
      />
      <Reveal delay={0.08}>
        <Accordion type="single" collapsible className="glass mt-12 rounded-2xl px-5">
          {FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border/50">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 pb-28">
      <Reveal>
        <div className="glass gradient-border relative overflow-hidden rounded-3xl px-6 py-16 text-center">
          <div
            aria-hidden
            className="animate-blob absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[110px]"
            style={{ background: "var(--violet)" }}
          />
          <h2 className="relative text-3xl font-semibold sm:text-4xl">
            Describe it. <span className="gradient-text">Nova builds it.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Your first project takes about ninety seconds — from a sentence to a running app.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/auth" search={{ mode: "signup" }}>
                Start building free
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <Link to="/templates" className="transition-colors hover:text-foreground">
            Templates
          </Link>
          <Link to="/auth" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Nova Studio AI</p>
      </div>
    </footer>
  );
}

export const TrustIcons = { Blocks, ShieldCheck, Users };
