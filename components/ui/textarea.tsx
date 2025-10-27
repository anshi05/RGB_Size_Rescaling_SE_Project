/**
 * @file components/ui/textarea.tsx
 * @description This file contains the Textarea component, providing a styled and accessible multi-line text input field.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * @overview The Textarea component.
 * It renders a native `<textarea>` element, providing a multi-line text input field with customizable styling.
 * 
 * @param {object} props - The properties for the Textarea component.
 * @param {string} [props.className] - Optional CSS class names to apply to the textarea.
 * @param {React.Ref<HTMLTextAreaElement>} ref - Ref to the underlying HTMLTextAreaElement.
 * 
 * @returns {JSX.Element} The Textarea component.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
