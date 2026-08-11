import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedBlobs } from "@/components/nova/AnimatedBlobs";
import { Nav } from "@/components/landing/Nav";
import { StudioMockup } from "@/components/landing/StudioMockup";
import {
  Agents,
  CTA,
  FAQ,
  Features,
  Footer,
  Pricing,
  TemplateStrip,
  Testimonials,
} from "@/components/landing/Sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova Studio AI — Describe an app, watch it get built" },
      {
        name: "description",
        content:
          "Nova Studio AI turns natural language into production applications with multi-agent generation, a real code editor, live preview and one-click deploy.",
      },
      { property: "og:title", content: "Nova Studio AI — Describe an app, watch it get built" },
      {
        property: "og:description",
        content:
          "Multi-agent AI development studio with live preview, Monaco editor, templates and one-click deploy.",
      },
    ],
  }),
  component: Landing,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBlobs dense />
      <Nav />

      <main className="relative">
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-40 text-center sm:pt-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
          >
            <Sparkles className="size-3.5" style={{ color: "var(--cyan)" }} />
            Seven specialist agents now ship together
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl"
          >
            Say what you want.
            <br />
            <span className="gradient-text">Nova writes the whole app.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground"
          >
            A multi-agent studio that plans, designs, codes, tests and deploys — with the real file
            tree and live preview open the entire time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease }}
            className="mt-9 flex justify-center"
          >
            <Button asChild variant="hero" size="lg">
              <Link to="/auth" search={{ mode: "signup" }}>
                Start building free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="mt-20 [perspective:1400px]">
            <StudioMockup />
          </div>
        </section>

        <Features />
        <Agents />
        <TemplateStrip />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
