import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100/50 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400",
        success:
          "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400",
        warning:
          "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100/50 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400",
        info:
          "border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-100/50 dark:border-sky-900/30 dark:bg-sky-950/20 dark:text-sky-400",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
