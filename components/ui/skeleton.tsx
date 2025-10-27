/**
 * @file components/ui/skeleton.tsx
 * @description This file contains the Skeleton component, used to display a placeholder preview of content before it fully loads.
 * @lastUpdated 2025-10-25
 */
import { cn } from '@/lib/utils'

/**
 * @overview The Skeleton component.
 * It provides a visual placeholder for content that is still loading, improving the perceived performance of the application.
 * The component displays a pulsating animated background.
 * 
 * @param {object} props - The properties for the Skeleton component.
 * @param {string} [props.className] - Optional CSS class names to apply to the skeleton div.
 * 
 * @returns {JSX.Element} The Skeleton component.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
