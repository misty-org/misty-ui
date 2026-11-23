import * as React from "react";

import { cn } from "../class_names";

const textareaVariants = {
  default: [
    "flex field-sizing-content min-h-16 w-full rounded-lg border border-charcoal-border-strong",
    "bg-charcoal-card px-2.5 py-1.5 text-control text-cream transition-colors outline-none",
    "placeholder:text-cream-muted hover:border-charcoal-active focus:border-cream-muted",
    "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
  ],
  code: [
    "flex field-sizing-content min-h-16 w-full rounded-lg border border-charcoal-border-strong",
    "bg-charcoal-card px-2.5 py-1.5 font-mono text-meta text-cream transition-colors outline-none",
    "overflow-x-auto whitespace-pre [tab-size:2]",
    "placeholder:font-sans placeholder:text-cream-muted",
    "hover:border-charcoal-active focus:border-cream-muted",
    "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
  ],
  composer: [
    "w-full resize-none overflow-x-hidden bg-transparent text-cream caret-cream outline-none",
    "placeholder:text-cream-muted disabled:cursor-not-allowed disabled:opacity-50",
  ],
} as const;

type TextareaProps = React.ComponentProps<"textarea"> & {
  /** default for prose, code for config and command editors, composer inside a composer. */
  variant?: keyof typeof textareaVariants;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const code = variant === "code";
    return (
      <textarea
        data-slot="textarea"
        data-variant={variant}
        spellCheck={code ? false : undefined}
        autoCapitalize={code ? "off" : undefined}
        autoCorrect={code ? "off" : undefined}
        wrap={code ? "off" : undefined}
        className={cn(textareaVariants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
