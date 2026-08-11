import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

const Monaco = lazy(async () => {
  const mod = await import("@monaco-editor/react");
  return { default: mod.default };
});

function Fallback() {
  return (
    <div className="grid h-full place-items-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}

export function CodeEditor({
  path,
  value,
  language,
  onChange,
}: {
  path: string;
  value: string;
  language: string;
  onChange: (next: string) => void;
}) {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <Monaco
          key={path}
          height="100%"
          theme="vs-dark"
          language={language}
          value={value}
          onChange={(next) => onChange(next ?? "")}
          options={{
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            smoothScrolling: true,
            renderLineHighlight: "none",
            tabSize: 2,
          }}
        />
      </Suspense>
    </ClientOnly>
  );
}
