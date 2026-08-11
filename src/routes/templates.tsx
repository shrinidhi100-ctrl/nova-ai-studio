import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Boxes, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppHeader, RequireAuth } from "@/components/nova/AppChrome";
import { AnimatedBlobs } from "@/components/nova/AnimatedBlobs";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/templates";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Nova Studio AI" },
      {
        name: "description",
        content:
          "Twelve production-ready starters — SaaS dashboards, storefronts, chat apps and more — that Nova Studio AI can extend from your first prompt.",
      },
      { property: "og:title", content: "Templates — Nova Studio AI" },
      {
        property: "og:description",
        content: "Production-ready starters you can steer with plain language.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Templates />
    </RequireAuth>
  ),
});

function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);

  async function start(slug: string, name: string, tagline: string) {
    if (!user) return;
    setBusy(slug);
    const { data, error } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name, description: tagline, template: slug })
      .select("id")
      .single();
    setBusy(null);
    if (error || !data) {
      toast.error("Could not start from this template");
      return;
    }
    navigate({ to: "/project/$projectId", params: { projectId: data.id } });
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBlobs />
      <AppHeader />

      <main className="relative mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Templates</h1>
        <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
          Pick a foundation. Nova scaffolds it, then you steer the rest in conversation.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="glass flex h-full flex-col rounded-2xl p-5"
            >
              <Boxes className="size-5" style={{ color: `var(--${t.accent})` }} />
              <h2 className="mt-4 font-display text-base font-semibold">{t.name}</h2>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{t.tagline}</p>
              <div className="mt-4">
                <span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                  {t.category}
                </span>
              </div>

              <Button
                variant="glass"
                className="mt-5"
                disabled={busy === t.slug}
                onClick={() => start(t.slug, t.name, t.tagline)}
              >
                {busy === t.slug && <Loader2 className="size-4 animate-spin" />} Use template
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
