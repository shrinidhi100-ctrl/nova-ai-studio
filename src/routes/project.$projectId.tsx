import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  ArrowUp,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Eye,
  File as FileIcon,
  Folder,
  Loader2,
  Rocket,
  Save,
  Square,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppHeader, RequireAuth } from "@/components/nova/AppChrome";
import { CodeEditor } from "@/components/nova/CodeEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buildTree, extractFiles, stripFileBlocks, type FileNode } from "@/lib/files";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/project/$projectId")({
  head: () => ({
    meta: [
      { title: "Studio — Nova Studio AI" },
      { name: "description", content: "Chat with Nova's agents, edit the generated code and preview your app live." },
      { property: "og:title", content: "Studio — Nova Studio AI" },
      { property: "og:description", content: "Build and edit your app in the Nova studio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Studio />
    </RequireAuth>
  ),
});

type ProjectFile = { path: string; content: string; language: string };

function Tree({
  nodes,
  active,
  onSelect,
  depth = 0,
}: {
  nodes: FileNode[];
  active: string | null;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.path}>
          {node.children ? (
            <details open>
              <summary
                className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                style={{ paddingLeft: 8 + depth * 12 }}
              >
                <ChevronRight className="size-3 transition-transform [details[open]>summary>&]:rotate-90" />
                <Folder className="size-3.5" />
                {node.name}
              </summary>
              <Tree nodes={node.children} active={active} onSelect={onSelect} depth={depth + 1} />
            </details>
          ) : (
            <button
              onClick={() => onSelect(node.path)}
              className={cn(
                "flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-xs transition-colors",
                active === node.path
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              style={{ paddingLeft: 20 + depth * 12 }}
            >
              <FileIcon className="size-3.5 shrink-0" />
              <span className="truncate">{node.name}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

function buildPreview(files: ProjectFile[]) {
  const html = files.find((f) => f.path.endsWith(".html"));
  const css = files.filter((f) => f.path.endsWith(".css")).map((f) => f.content).join("\n");
  if (html) {
    return html.content.replace("</head>", `<style>${css}</style></head>`);
  }
  const list = files
    .map(
      (f) =>
        `<li><code>${f.path.replace(/</g, "&lt;")}</code><span>${f.content.split("\n").length} lines</span></li>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;font-family:ui-sans-serif,system-ui;background:#0b0b14;color:#e8e8f0;padding:32px}
    h1{font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:#8b8ba7;margin:0 0 20px}
    ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}
    li{display:flex;justify-content:space-between;gap:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;font-size:13px}
    span{color:#8b8ba7}
    p{color:#8b8ba7;font-size:13px}
  </style></head><body><h1>Project output</h1>${
    files.length ? `<ul>${list}</ul>` : "<p>Ask Nova to build something — generated files appear here.</p>"
  }</body></html>`;
}

function Studio() {
  const { projectId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("Project");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const savedRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: () => toast.error("The agent hit an error. Please try again."),
  });

  const busy = status === "streaming" || status === "submitted";

  // Load project, history and files
  useEffect(() => {
    if (!user) return;
    void (async () => {
      const [{ data: project }, { data: history }, { data: stored }] = await Promise.all([
        supabase.from("projects").select("name, description").eq("id", projectId).maybeSingle(),
        supabase
          .from("messages")
          .select("id, role, content")
          .eq("project_id", projectId)
          .order("created_at", { ascending: true }),
        supabase
          .from("project_files")
          .select("path, content, language")
          .eq("project_id", projectId)
          .order("path", { ascending: true }),
      ]);

      if (!project) {
        toast.error("Project not found");
        navigate({ to: "/dashboard" });
        return;
      }
      setProjectName(project.name);
      setFiles((stored as ProjectFile[]) ?? []);
      setActivePath((stored as ProjectFile[])?.[0]?.path ?? null);
      if (history?.length) {
        setMessages(
          history.map((m) => ({
            id: m.id as string,
            role: m.role === "user" ? ("user" as const) : ("assistant" as const),
            parts: [{ type: "text" as const, text: m.content as string }],
          })),
        );
        savedRef.current = history.length;
      }
      setLoading(false);
    })();
  }, [projectId, user, navigate, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const textOf = (m: (typeof messages)[number]) =>
    m.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("")
      .trim();

  // Persist new messages + generated files once a turn completes
  useEffect(() => {
    if (busy || !user || loading) return;
    const unsaved = messages.slice(savedRef.current);
    if (unsaved.length === 0) return;
    savedRef.current = messages.length;

    void (async () => {
      const rows = unsaved
        .map((m) => ({
          project_id: projectId,
          user_id: user.id,
          role: m.role,
          content: textOf(m),
        }))
        .filter((r) => r.content.length > 0);
      if (rows.length) await supabase.from("messages").insert(rows);

      const generated = unsaved
        .filter((m) => m.role === "assistant")
        .flatMap((m) => extractFiles(textOf(m)));
      if (generated.length === 0) return;

      const { error } = await supabase.from("project_files").upsert(
        generated.map((f) => ({
          project_id: projectId,
          user_id: user.id,
          path: f.path,
          content: f.content,
          language: f.language,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "project_id,path" },
      );
      if (error) {
        toast.error("Could not save generated files");
        return;
      }
      setFiles((prev) => {
        const next = new Map(prev.map((f) => [f.path, f]));
        for (const f of generated) next.set(f.path, f);
        return [...next.values()].sort((a, b) => a.path.localeCompare(b.path));
      });
      setActivePath((prev) => prev ?? generated[0]?.path ?? null);
      await supabase.from("projects").update({ updated_at: new Date().toISOString() }).eq("id", projectId);
      toast.success(`${generated.length} file${generated.length > 1 ? "s" : ""} written`);
    })();
  }, [busy, messages, user, projectId, loading]);

  const tree = useMemo(() => buildTree(files.map((f) => f.path)), [files]);
  const activeFile = files.find((f) => f.path === activePath) ?? null;
  const preview = useMemo(() => buildPreview(files), [files]);

  async function saveActive() {
    if (!activeFile || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("project_files")
      .update({ content: activeFile.content, updated_at: new Date().toISOString() })
      .eq("project_id", projectId)
      .eq("path", activeFile.path);
    setSaving(false);
    if (error) toast.error("Could not save the file");
    else toast.success("Saved");
  }

  function submit() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    void sendMessage({ text }, { body: { projectName } });
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader>
        <span className="truncate text-sm font-medium">{projectName}</span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {files.length} file{files.length === 1 ? "" : "s"}
        </span>
      </AppHeader>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* File tree */}
        <aside className="hidden min-h-0 flex-col border-r border-border/50 bg-surface-1/40 lg:flex">
          <div className="flex items-center justify-between px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
            Files
          </div>
          <ScrollArea className="min-h-0 flex-1 pb-4">
            {files.length === 0 ? (
              <p className="px-4 text-xs text-muted-foreground">
                No files yet. Ask Nova to build a feature.
              </p>
            ) : (
              <Tree
                nodes={tree}
                active={activePath}
                onSelect={(p) => {
                  setActivePath(p);
                  setTab("code");
                }}
              />
            )}
          </ScrollArea>
          <div className="border-t border-border/50 p-3">
            <Button asChild variant="ghost" size="sm" className="w-full justify-start text-xs">
              <Link to="/dashboard">All projects</Link>
            </Button>
          </div>
        </aside>

        {/* Chat */}
        <section className="flex min-h-0 flex-col border-r border-border/50">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl space-y-5 px-4 py-6">
              {messages.length === 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-display text-base font-semibold">Tell Nova what to build</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Describe a screen, a feature or a fix. The Planner breaks it down, the Developer
                    writes the files, and the Reviewer explains the trade-offs.
                  </p>
                </div>
              )}
              {messages.map((m) => {
                const text = textOf(m);
                return (
                  <div
                    key={m.id}
                    className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        m.role === "user"
                          ? "gradient-brand text-primary-foreground"
                          : "glass text-foreground/90",
                      )}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose-nova">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {stripFileBlocks(text)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {busy && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> Agents are working…
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/50 p-3">
            <div className="glass flex items-end gap-2 rounded-2xl p-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={2}
                placeholder="Add a pricing page with three tiers…"
                className="min-h-0 resize-none border-0 bg-transparent focus-visible:ring-0"
              />
              {busy ? (
                <Button size="icon" variant="glass" onClick={() => stop()} aria-label="Stop">
                  <Square className="size-4" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  variant="hero"
                  onClick={submit}
                  disabled={!input.trim()}
                  aria-label="Send"
                >
                  <ArrowUp className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Preview / code */}
        <section className="flex min-h-0 flex-col">
          <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2">
            <div className="glass flex rounded-full p-1">
              {(["preview", "code"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize transition-colors",
                    tab === t ? "gradient-brand text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {t === "preview" ? <Eye className="size-3.5" /> : <Code2 className="size-3.5" />}
                  {t}
                </button>
              ))}
            </div>
            <span className="ml-1 truncate text-xs text-muted-foreground">
              {tab === "code" ? (activeFile?.path ?? "No file selected") : "Live output"}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              {tab === "code" && activeFile && (
                <Button size="sm" variant="glass" onClick={saveActive} disabled={saving}>
                  {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  Save
                </Button>
              )}
              <Button
                size="sm"
                variant="hero"
                onClick={() => toast.success("Deploy queued — your build will be live shortly.")}
              >
                <Rocket className="size-3.5" /> Deploy
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 bg-surface-1/40">
            {tab === "preview" ? (
              <iframe
                title="Live preview"
                srcDoc={preview}
                className="size-full border-0 bg-background"
                sandbox="allow-scripts"
              />
            ) : activeFile ? (
              <CodeEditor
                path={activeFile.path}
                value={activeFile.content}
                language={activeFile.language}
                onChange={(next) =>
                  setFiles((prev) =>
                    prev.map((f) => (f.path === activeFile.path ? { ...f, content: next } : f)),
                  )
                }
              />
            ) : (
              <div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">
                Generated files will open here.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
