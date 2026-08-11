export type GeneratedFile = { path: string; content: string; language: string };

const LANGS: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  json: "json",
  css: "css",
  html: "html",
  md: "markdown",
  sql: "sql",
};

export function languageForPath(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return LANGS[ext] ?? "plaintext";
}

/**
 * Extracts files written by the agent in the form:
 *
 * ```tsx path=src/components/Hero.tsx
 * ...code...
 * ```
 */
export function extractFiles(text: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const re = /```[a-zA-Z0-9]*\s+path=([^\s`]+)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const path = (match[1] ?? "").trim().replace(/^\.?\//, "");
    const content = (match[2] ?? "").replace(/\s+$/, "");
    if (!path) continue;
    files.push({ path, content, language: languageForPath(path) });
  }
  return files;
}

/** Chat text with the file blocks collapsed into short summaries. */
export function stripFileBlocks(text: string) {
  return text.replace(/```[a-zA-Z0-9]*\s+path=([^\s`]+)\n[\s\S]*?```/g, (_m, p: string) => `\`${p}\``);
}

export type FileNode = {
  name: string;
  path: string;
  children?: FileNode[];
};

export function buildTree(paths: string[]): FileNode[] {
  const root: FileNode[] = [];
  for (const full of [...paths].sort()) {
    const parts = full.split("/");
    let level = root;
    let acc = "";
    parts.forEach((part, i) => {
      acc = acc ? `${acc}/${part}` : part;
      const isLeaf = i === parts.length - 1;
      let node = level.find((n) => n.name === part && !!n.children === !isLeaf);
      if (!node) {
        node = isLeaf ? { name: part, path: acc } : { name: part, path: acc, children: [] };
        level.push(node);
      }
      if (!isLeaf) level = node.children!;
    });
  }
  return root;
}
