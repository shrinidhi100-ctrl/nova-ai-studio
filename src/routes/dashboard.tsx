import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Loader2, Plus, Search, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppHeader, RequireAuth } from "@/components/nova/AppChrome";
import { AnimatedBlobs } from "@/components/nova/AnimatedBlobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your projects — Nova Studio AI" },
      { name: "description", content: "Manage, star and open every application you have built with Nova Studio AI." },
      { property: "og:title", content: "Your projects — Nova Studio AI" },
      { property: "og:description", content: "Your Nova Studio AI workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
});

type Project = {
  id: string;
  name: string;
  description: string | null;
  template: string | null;
  is_starred: boolean;
  updated_at: string;
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", template: "" });

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, template, is_starred, updated_at")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });
      if (error) toast.error("Could not load your projects");
      setProjects((data as Project[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  async function createProject() {
    if (!user || !form.name.trim()) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        template: form.template || null,
      })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error("Could not create the project");
      return;
    }
    setOpen(false);
    navigate({ to: "/project/$projectId", params: { projectId: data.id } });
  }

  async function toggleStar(p: Project) {
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_starred: !x.is_starred } : x)));
    await supabase.from("projects").update({ is_starred: !p.is_starred }).eq("id", p.id);
  }

  async function remove(p: Project) {
    setProjects((prev) => prev.filter((x) => x.id !== p.id));
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) toast.error("Could not delete the project");
  }

  const filtered = projects.filter((p) =>
    (p.name + (p.description ?? "")).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen">
      <AnimatedBlobs />
      <AppHeader />

      <main className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Projects</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Everything you've built. Open one to keep going.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects"
                className="w-52 pl-9"
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="size-4" /> New project
                </Button>
              </DialogTrigger>
              <DialogContent className="glass sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create a project</DialogTitle>
                  <DialogDescription>
                    Give Nova a name and a sentence about what you want to build.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    autoFocus
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Project name"
                  />
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="A booking app for a yoga studio with class schedules and payments…"
                    rows={3}
                  />
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATES.slice(0, 6).map((t) => (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, template: form.template === t.slug ? "" : t.slug })
                        }
                        className={cn(
                          "rounded-full border border-border px-3 py-1 text-xs transition-colors",
                          form.template === t.slug
                            ? "gradient-brand text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="hero"
                    onClick={createProject}
                    disabled={creating || !form.name.trim()}
                  >
                    {creating && <Loader2 className="size-4 animate-spin" />} Create project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="mt-16 grid place-items-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass mt-10 rounded-3xl px-6 py-20 text-center">
            <h2 className="text-lg font-semibold">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Start from a blank prompt or pick a template — your first app is about ninety seconds away.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="hero" onClick={() => setOpen(true)}>
                <Plus className="size-4" /> New project
              </Button>
              <Button asChild variant="glass">
                <Link to="/templates">Browse templates</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <div className="glass group relative h-full rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1">
                  <Link
                    to="/project/$projectId"
                    params={{ projectId: p.id }}
                    className="block"
                  >
                    <h3 className="pr-16 font-display text-base font-semibold">{p.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {p.description ?? "No description yet."}
                    </p>
                    <p className="mt-6 text-xs text-muted-foreground">
                      Updated {new Date(p.updated_at).toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button size="icon" variant="ghost" onClick={() => toggleStar(p)} aria-label="Star">
                      <Star
                        className={cn("size-4", p.is_starred && "fill-current")}
                        style={p.is_starred ? { color: "var(--cyan)" } : undefined}
                      />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p)} aria-label="Delete">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
