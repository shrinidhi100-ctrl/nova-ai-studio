import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="gradient-brand glow relative grid size-8 place-items-center rounded-xl">
        <Sparkles className="size-4 text-primary-foreground" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="font-display text-[1.05rem] font-semibold tracking-tight">
          Nova <span className="gradient-text">Studio</span>
        </span>
      )}
    </span>
  );
}
