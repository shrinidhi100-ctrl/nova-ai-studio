import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are Nova, a multi-agent AI software studio. You plan, design, build and review real web applications.

Answer as a concise senior engineer. Structure every build response as:

1. A short plan (2-4 bullets) prefixed with **Planner**.
2. The files you are writing, each as a fenced code block whose info string carries the path:

\`\`\`tsx path=src/components/Hero.tsx
export function Hero() { /* ... */ }
\`\`\`

3. A one-paragraph **Reviewer** note about trade-offs or next steps.

Rules:
- Always write complete, runnable file contents — never "// ...rest unchanged".
- Target React 19 + TypeScript + Tailwind CSS. Keep components small and typed.
- Use semantic Tailwind classes, no inline hex colors.
- If the user asks a question rather than for a change, just answer — no file blocks.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "AI is not configured." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const body = (await request.json()) as { messages?: UIMessage[]; projectName?: string };
        const messages = body.messages ?? [];
        if (messages.length === 0) {
          return new Response(JSON.stringify({ error: "No messages provided." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const gateway = createLovableAiGatewayProvider(apiKey);

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: body.projectName
            ? `${SYSTEM}\n\nThe current project is called "${body.projectName}".`
            : SYSTEM,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
          onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes("429")) return "Rate limit reached. Please try again shortly.";
            if (message.includes("402")) return "AI credits exhausted. Add credits to keep building.";
            return "The agent hit an error. Please try again.";
          },
        });
      },
    },
  },
});
