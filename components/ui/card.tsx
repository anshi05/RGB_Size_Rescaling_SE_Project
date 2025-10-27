/**
 * @file components/ui/card.tsx
 * @description This file contains the Card component and its sub-components, used for grouping related content.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * @overview The Card component.
 * A flexible container component used for grouping related content and actions.
 * 
 * @param {object} props - The properties for the Card component.
 * @param {string} [props.className] - Optional CSS class names to apply to the card container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Card component.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className,
    )}
    {...props}
  />
))
Card.displayName = 'Card'

/**
 * @overview The CardHeader component.
 * Provides a styled header area for the Card, typically containing a title and description.
 * 
 * @param {object} props - The properties for the CardHeader component.
 * @param {string} [props.className] - Optional CSS class names to apply to the header.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Card header component.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

/**
 * @overview The CardTitle component.
 * Displays the main title within a CardHeader.
 * 
 * @param {object} props - The properties for the CardTitle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the title.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Card title component.
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

/**
 * @overview The CardDescription component.
 * Provides supplementary information or a subtitle within a CardHeader.
 * 
 * @param {object} props - The properties for the CardDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Card description component.
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * @overview The CardContent component.
 * The main content area of the Card.
 * 
 * @param {object} props - The properties for the CardContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content area.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Card content component.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

/**
 * @overview The CardFooter component.
 * Provides a styled footer area for the Card, typically containing action buttons.
 * 
 * @param {object} props - The properties for the CardFooter component.
 * @param {string} [props.className] - Optional CSS class names to apply to the footer.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Card footer component.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
