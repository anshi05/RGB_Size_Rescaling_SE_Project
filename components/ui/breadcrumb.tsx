/**
 * @file components/ui/breadcrumb.tsx
 * @description This file contains the Breadcrumb component and its sub-components, used for navigation trails.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root Breadcrumb component.
 * It provides context to a user's location within the application's hierarchy.
 * 
 * @param {object} props - The properties for the Breadcrumb component.
 * @param {React.ReactNode} [props.separator] - Optional separator to be used between breadcrumb items.
 * @param {React.Ref<HTMLElement>} ref - Ref to the underlying HTMLElement.
 * 
 * @returns {JSX.Element} The Breadcrumb root component.
 */
const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = 'Breadcrumb'

/**
 * @overview The BreadcrumbList component.
 * It renders an ordered list of breadcrumb items.
 * 
 * @param {object} props - The properties for the BreadcrumbList component.
 * @param {string} [props.className] - Optional CSS class names to apply to the list.
 * @param {React.Ref<HTMLOListElement>} ref - Ref to the underlying HTMLOListElement.
 * 
 * @returns {JSX.Element} The Breadcrumb list component.
 */
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
    <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className,
    )}
    {...props}
  />
))
BreadcrumbList.displayName = 'BreadcrumbList'

/**
 * @overview The BreadcrumbItem component.
 * An individual item within the breadcrumb list.
 * 
 * @param {object} props - The properties for the BreadcrumbItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the list item.
 * @param {React.Ref<HTMLLIElement>} ref - Ref to the underlying HTMLLIElement.
 * 
 * @returns {JSX.Element} The Breadcrumb item component.
 */
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
    <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

/**
 * @overview The BreadcrumbLink component.
 * A clickable link within a breadcrumb item.
 * 
 * @param {object} props - The properties for the BreadcrumbLink component.
 * @param {boolean} [props.asChild] - If true, the component will render its child as a trigger without enforcing a DOM element.
 * @param {string} [props.className] - Optional CSS class names to apply to the link.
 * @param {React.Ref<HTMLAnchorElement>} ref - Ref to the underlying HTMLAnchorElement.
 * 
 * @returns {JSX.Element} The Breadcrumb link component.
 */
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

/**
 * @overview The BreadcrumbPage component.
 * Represents the current page in the breadcrumb trail, typically not clickable.
 * 
 * @param {object} props - The properties for the BreadcrumbPage component.
 * @param {string} [props.className] - Optional CSS class names to apply to the page indicator.
 * @param {React.Ref<HTMLSpanElement>} ref - Ref to the underlying HTMLSpanElement.
 * 
 * @returns {JSX.Element} The Breadcrumb page component.
 */
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
    <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

/**
 * @overview The BreadcrumbSeparator component.
 * A visual separator between breadcrumb items.
 * 
 * @param {object} props - The properties for the BreadcrumbSeparator component.
 * @param {React.ReactNode} [props.children] - Optional custom separator content (defaults to ChevronRight icon).
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * 
 * @returns {JSX.Element} The Breadcrumb separator component.
 */
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
    <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:w-3.5 [&>svg]:h-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

/**
 * @overview The BreadcrumbEllipsis component.
 * Used to indicate collapsed breadcrumb items, representing more links.
 * 
 * @param {object} props - The properties for the BreadcrumbEllipsis component.
 * @param {string} [props.className] - Optional CSS class names to apply to the ellipsis.
 * 
 * @returns {JSX.Element} The Breadcrumb ellipsis component.
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
    <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
