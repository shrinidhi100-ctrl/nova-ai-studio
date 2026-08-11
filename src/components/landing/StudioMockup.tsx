import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Monitor, Smartphone, Tablet, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { agent: "Planner", text: "Mapping routes, data model and auth boundaries…" },
  { agent: "Designer", text: "Generating tokens, dark theme and component variants…" },
  { agent: "Developer", text: "Writing dashboard.tsx, api/orders.ts and schema.sql…" },
  { agent: "Tester", text: "Adding 14 unit tests. All green." },
];

const FILES = ["app/layout.tsx", "app/dashboard.tsx", "components/kpi-card.tsx", "lib/db.ts"];

export function StudioMockup() {
  const [step, setStep] = useState(0);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (STEPS.length + 1)), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="glass gradient-border relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl shadow-[var(--shadow-panel)]"
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full" style={{ background: "var(--cyan)" }} />
        <span className="size-2.5 rounded-full" style={{ background: "var(--violet)" }} />
        <span className="ml-3 font-mono text-xs text-muted-foreground">nova://studio/orders-dashboard</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr]">
        <div className="border-border/60 p-4 md:border-r">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Conversation</p>
          <div className="rounded-2xl bg-surface-2/60 p-3 text-sm">
            Build an orders dashboard with revenue charts and CSV export.
          </div>
          <div className="mt-3 space-y-2">
            {STEPS.map((s, i) => (
              <div
                key={s.agent}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-500",
                  i < step ? "opacity-100" : "opacity-25",
                )}
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md gradient-brand">
                  <Check className="size-3 text-primary-foreground" strokeWidth={3} />
                </span>
                <span>
                  <span className="gradient-text font-medium">{s.agent}</span>{" "}
                  <span className="text-muted-foreground">{s.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Live preview</p>
            <div className="flex items-center gap-1 rounded-lg bg-surface-2/60 p-1">
              {(
                [
                  ["desktop", Monitor],
                  ["tablet", Tablet],
                  ["mobile", Smartphone],
                ] as const
              ).map(([key, Icon]) => (
                <button
                  key={key}
                  aria-label={`${key} preview`}
                  onClick={() => setDevice(key)}
                  className={cn(
                    "grid size-7 place-items-center rounded-md transition-colors",
                    device === key ? "bg-primary/25 text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
            <div
              className={cn(
                "mx-auto transition-all duration-500",
                device === "desktop" ? "w-full" : device === "tablet" ? "w-[78%]" : "w-[46%]",
              )}
            >
              <div className="mb-2 grid grid-cols-3 gap-2">
                {["Revenue", "Orders", "Churn"].map((k, i) => (
                  <div key={k} className="rounded-lg bg-surface-2/70 p-2">
                    <p className="text-[0.6rem] text-muted-foreground">{k}</p>
                    <p className="font-display text-sm">{["$48.2k", "1,284", "1.4%"][i]}</p>
                  </div>
                ))}
              </div>
              <div className="flex h-24 items-end gap-1.5 rounded-lg bg-surface-2/40 p-2">
                {[38, 62, 45, 80, 55, 92, 70, 100, 64, 84].map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ height: 4 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.6 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-sm gradient-brand"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {FILES.map((f) => (
              <span
                key={f}
                className="rounded-md bg-surface-2/60 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface-2/40 px-3 py-2 font-mono text-[0.65rem] text-muted-foreground">
            <Terminal className="size-3.5" />
            build succeeded in 812ms — 0 errors
          </div>
        </div>
      </div>
    </motion.div>
  );
}
