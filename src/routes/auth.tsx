import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AnimatedBlobs } from "@/components/nova/AnimatedBlobs";
import { Logo } from "@/components/nova/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup", "forgot"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Nova Studio AI" },
      { name: "description", content: "Sign in or create your Nova Studio AI account to start building applications from plain language." },
      { property: "og:title", content: "Sign in — Nova Studio AI" },
      { property: "og:description", content: "Access your Nova Studio AI workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6c-.1 1.1-.9 2.8-2.5 3.9l-.1.2 3.6 2.8.3.1c2.3-2.2 3.6-5.3 3.6-8.9Z" />
      <path fill="#34A853" d="M12 24c3.3 0 6-1.1 8-2.9l-3.8-3c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-.2.1-3.7 2.9-.1.2C3.1 21.3 7.2 24 12 24Z" />
      <path fill="#FBBC05" d="M5.1 14.3c-.3-.8-.4-1.6-.4-2.3 0-.8.1-1.6.4-2.3v-.3L1.3 6.4l-.1.1A12 12 0 0 0 0 12c0 1.9.5 3.8 1.2 5.5l3.9-3.2Z" />
      <path fill="#EA4335" d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.3 0 12 0 7.2 0 3.1 2.7 1.2 6.5l3.9 3c1-2.9 3.7-4.8 6.9-4.8Z" />
    </svg>
  );
}

function AuthPage() {
  const { mode = "signin" } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const setMode = (next: "signin" | "signup" | "forgot") =>
    navigate({ to: "/auth", search: { mode: next } });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to Nova.");
        navigate({ to: "/dashboard" });
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your inbox.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  const title =
    mode === "signup" ? "Create your workspace" : mode === "forgot" ? "Reset your password" : "Welcome back";

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-16">
      <AnimatedBlobs dense />

      <Link
        to="/"
        className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass gradient-border relative w-full max-w-md rounded-3xl p-8"
      >
        <Logo />
        <h1 className="mt-7 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "forgot"
            ? "We'll email you a secure link to choose a new password."
            : "Build production applications from a single sentence."}
        </p>

        {mode !== "forgot" && (
          <>
            <Button
              type="button"
              variant="glass"
              size="lg"
              className="mt-7 w-full"
              onClick={onGoogle}
              disabled={busy}
            >
              <GoogleMark /> Continue with Google
            </Button>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
          )}

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "forgot" ? (
              <Mail className="size-4" />
            ) : null}
            {mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-foreground underline-offset-4 hover:underline">
                Sign in
              </button>
            </>
          ) : (
            <>
              New to Nova?{" "}
              <button onClick={() => setMode("signup")} className="text-foreground underline-offset-4 hover:underline">
                Create an account
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
