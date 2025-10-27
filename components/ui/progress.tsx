/**
 * @file components/ui/progress.tsx
 * @description This file contains the Progress component, built using Radix UI's Progress primitive, providing a visual indicator of progress.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

/**
 * @overview The Progress component, built on Radix UI's ProgressPrimitive.Root.
 * It provides a visual indicator of the completion progress of a task, typically a horizontal bar.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/progress
 * 
 * @param {object} props - The properties for the Progress component.
 * @param {string} [props.className] - Optional CSS class names to apply to the progress root.
 * @param {number} [props.value] - The current progress value (0-100).
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Progress component.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
