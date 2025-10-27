/**
 * @file components/ui/pagination.tsx
 * @description This file contains the Pagination component and its sub-components, providing a navigation system for dividing content into separate pages.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/button'

/**
 * @overview The root Pagination component.
 * It provides an accessible navigation structure for paginated content, ensuring proper `aria` attributes.
 * 
 * @param {object} props - The properties for the Pagination component.
 * @param {string} [props.className] - Optional CSS class names to apply to the navigation element.
 * 
 * @returns {JSX.Element} The Pagination root component.
 */
const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

/**
 * @overview The PaginationContent component.
 * A container for pagination items (links, previous/next buttons, ellipses).
 * 
 * @param {object} props - The properties for the PaginationContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the unordered list.
 * @param {React.Ref<HTMLUListElement>} ref - Ref to the underlying HTMLUListElement.
 * 
 * @returns {JSX.Element} The Pagination content component.
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

/**
 * @overview The PaginationItem component.
 * A wrapper for individual pagination elements like links or buttons.
 * 
 * @param {object} props - The properties for the PaginationItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the list item.
 * @param {React.Ref<HTMLLIElement>} ref - Ref to the underlying HTMLLIElement.
 * 
 * @returns {JSX.Element} The Pagination item component.
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

/**
 * @typedef {object} PaginationLinkProps
 * @property {boolean} [isActive] - Indicates if the link represents the current active page.
 * @augments Pick<ButtonProps, 'size'>
 * @augments React.ComponentProps<'a'>
 */
type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

/**
 * @overview The PaginationLink component.
 * A clickable link for navigating to a specific page, styled as a button.
 * It dynamically changes its appearance based on whether it's the active page.
 * 
 * @param {object} props - The properties for the PaginationLink component.
 * @param {string} [props.className] - Optional CSS class names to apply to the link.
 * @param {boolean} [props.isActive] - If true, the link will be styled as the active page.
 * @param {ButtonProps['size']} [props.size='icon'] - The size of the button.
 * 
 * @returns {JSX.Element} The Pagination link component.
 */
const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

/**
 * @overview The PaginationPrevious component.
 * A button/link to navigate to the previous page in the pagination sequence.
 * 
 * @param {object} props - The properties for the PaginationPrevious component.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @augments React.ComponentProps<typeof PaginationLink>
 * 
 * @returns {JSX.Element} The Pagination previous button component.
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

/**
 * @overview The PaginationNext component.
 * A button/link to navigate to the next page in the pagination sequence.
 * 
 * @param {object} props - The properties for the PaginationNext component.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @augments React.ComponentProps<typeof PaginationLink>
 * 
 * @returns {JSX.Element} The Pagination next button component.
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

/**
 * @overview The PaginationEllipsis component.
 * Represents a placeholder for omitted page numbers in a long pagination sequence.
 * 
 * @param {object} props - The properties for the PaginationEllipsis component.
 * @param {string} [props.className] - Optional CSS class names to apply to the ellipsis span.
 * 
 * @returns {JSX.Element} The Pagination ellipsis component.
 */
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
