import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "../class_names";
import { controlFrame, fieldInset } from "./control_frame";
import { IconButton } from "./IconButton";

/** Every framed field is 36px tall, the height of the buttons beside it, with 15px text. */
const inputVariants = {
  default: [
    controlFrame.md,
    fieldInset.md,
    "w-full min-w-0 border border-charcoal-border-strong bg-charcoal-card",
    "text-control text-cream transition-colors outline-none",
    "placeholder:text-cream-muted hover:border-charcoal-active focus:border-cream-muted",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-danger",
  ],
  address: [
    controlFrame.md,
    "w-full min-w-0 border border-transparent bg-cream/7 px-2 text-center focus:text-left",
    "text-control text-cream-bright outline-none transition-colors",
    "placeholder:text-cream-muted hover:bg-cream/10 focus:bg-cream/12",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  toolbar: [
    controlFrame.md,
    "w-full min-w-0 border border-cream/7 bg-transparent px-2",
    "text-control text-cream outline-none transition-colors placeholder:text-cream-muted",
    "hover:bg-cream/3 focus:bg-cream/4",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  title: [
    controlFrame.md,
    "-mx-2 w-[calc(100%+var(--spacing)*4)] min-w-0 border border-transparent bg-transparent px-2",
    "text-page font-semibold text-cream-bright outline-none transition-colors",
    "placeholder:text-cream-muted hover:border-charcoal-border",
    "focus:border-charcoal-border-strong focus:bg-charcoal-card",
    "disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger",
  ],
  smoke: [
    controlFrame.md,
    fieldInset.md,
    "w-full min-w-0 border border-white/18 bg-white/6",
    "text-art-white outline-none placeholder:text-cream-muted",
    "focus:border-white/55",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  compact: [
    controlFrame.sm,
    fieldInset.sm,
    "w-full min-w-0 border border-charcoal-border-strong bg-charcoal-card",
    "text-caption text-cream transition-colors outline-none",
    "placeholder:text-cream-muted hover:border-charcoal-active focus:border-cream-muted",
    "disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger",
  ],
  bare: [
    "w-full min-w-0 bg-transparent text-control text-cream outline-none placeholder:text-cream-muted",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
} as const;

type InputProps = React.ComponentProps<"input"> & {
  /**
   * default is the framed 36px field; compact is the 27px one for a row of small controls. Its
   * height and corners are fixed: never set them with className. title renames something in place in a header:
   * `<Input variant="title" aria-label="Space name" value={name} onChange={…} />`.
   */
  variant?: keyof typeof inputVariants;
  /** Sizes a password field and its eye together. */
  containerClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, variant = "default", ...props }, ref) => {
    const [revealed, setRevealed] = React.useState(false);
    const password = type === "password";
    const field = (
      <input
        type={password && revealed ? "text" : type}
        data-slot="input"
        data-variant={variant}
        className={cn(inputVariants[variant], className, password && "pr-8")}
        ref={ref}
        {...props}
      />
    );
    if (!password) return field;
    const Icon = revealed ? EyeOff : Eye;
    return (
      <div className={cn("relative w-full min-w-0", containerClassName)}>
        {field}
        <span className="absolute inset-y-0 right-1 flex items-center">
          <IconButton
            label={revealed ? "Hide password" : "Show password"}
            variant="quiet"
            size="sm"
            disabled={props.disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setRevealed(!revealed)}
          >
            <Icon aria-hidden="true" />
          </IconButton>
        </span>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
