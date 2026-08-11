import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/nova/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "signin" } });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <>{children}</>;
}

export function AppHeader({ children }: { children?: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const name = profile?.display_name ?? user?.email ?? "You";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-surface-1/70 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-4">
        <Link to="/dashboard">
          <Logo compact />
        </Link>
        <div className="flex flex-1 items-center gap-3 overflow-hidden">{children}</div>

        <span className="glass hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
          <Sparkles className="size-3" style={{ color: "var(--cyan)" }} />
          {profile?.credits ?? 0} credits
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} alt={name} /> : null}
                <AvatarFallback className="gradient-brand text-xs text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate font-normal">
              <span className="block text-sm font-medium">{profile?.display_name ?? "Builder"}</span>
              <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard">Projects</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/templates">Templates</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
