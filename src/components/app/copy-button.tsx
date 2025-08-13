"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
}

export function CopyButton({ textToCopy, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn("h-7 w-7 text-muted-foreground hover:text-foreground", className)}
            onClick={copyToClipboard}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {hasCopied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hasCopied ? "Copié!" : "Copier"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
