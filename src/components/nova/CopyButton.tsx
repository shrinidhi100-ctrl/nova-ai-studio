import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  className,
  size = "sm",
  variant = "glass",
}: {
  value: string;
  label?: string | null;
  className?: string;
  size?: "sm" | "icon";
  variant?: "glass" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.error("Clipboard is unavailable in this browser");
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={copy}
      className={cn(className)}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {label ? (copied ? "Copied" : label) : null}
    </Button>
  );
}
