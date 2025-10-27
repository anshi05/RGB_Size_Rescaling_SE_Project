/**
 * @file components/ui/table.tsx
 * @description This file contains the Table component and its sub-components, providing a semantic and accessible way to display tabular data.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * @overview The root Table component.
 * It renders a native `<table>` element with an `overflow-auto` wrapper for responsiveness.
 * 
 * @param {object} props - The properties for the Table component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table element.
 * @param {React.Ref<HTMLTableElement>} ref - Ref to the underlying HTMLTableElement.
 * 
 * @returns {JSX.Element} The Table root component.
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

/**
 * @overview The TableHeader component.
 * Renders a native `<thead>` element, typically used for table column headers.
 * 
 * @param {object} props - The properties for the TableHeader component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table header section.
 * @param {React.Ref<HTMLTableSectionElement>} ref - Ref to the underlying HTMLTableSectionElement.
 * 
 * @returns {JSX.Element} The TableHeader component.
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

/**
 * @overview The TableBody component.
 * Renders a native `<tbody>` element, used for the main content rows of the table.
 * 
 * @param {object} props - The properties for the TableBody component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table body section.
 * @param {React.Ref<HTMLTableSectionElement>} ref - Ref to the underlying HTMLTableSectionElement.
 * 
 * @returns {JSX.Element} The TableBody component.
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

/**
 * @overview The TableFooter component.
 * Renders a native `<tfoot>` element, typically used for summarizing columns or providing additional information at the bottom of the table.
 * 
 * @param {object} props - The properties for the TableFooter component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table footer section.
 * @param {React.Ref<HTMLTableSectionElement>} ref - Ref to the underlying HTMLTableSectionElement.
 * 
 * @returns {JSX.Element} The TableFooter component.
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

/**
 * @overview The TableRow component.
 * Renders a native `<tr>` element, representing a row of data in the table.
 * It includes styling for transitions and hover states.
 * 
 * @param {object} props - The properties for the TableRow component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table row.
 * @param {React.Ref<HTMLTableRowElement>} ref - Ref to the underlying HTMLTableRowElement.
 * 
 * @returns {JSX.Element} The TableRow component.
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

/**
 * @overview The TableHead component.
 * Renders a native `<th>` element, representing a header cell in the table.
 * 
 * @param {object} props - The properties for the TableHead component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table header cell.
 * @param {React.Ref<HTMLTableCellElement>} ref - Ref to the underlying HTMLTableCellElement.
 * 
 * @returns {JSX.Element} The TableHead component.
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

/**
 * @overview The TableCell component.
 * Renders a native `<td>` element, representing a data cell in the table.
 * 
 * @param {object} props - The properties for the TableCell component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table cell.
 * @param {React.Ref<HTMLTableCellElement>} ref - Ref to the underlying HTMLTableCellElement.
 * 
 * @returns {JSX.Element} The TableCell component.
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

/**
 * @overview The TableCaption component.
 * Renders a native `<caption>` element, providing a descriptive caption for the table.
 * 
 * @param {object} props - The properties for the TableCaption component.
 * @param {string} [props.className] - Optional CSS class names to apply to the table caption.
 * @param {React.Ref<HTMLTableCaptionElement>} ref - Ref to the underlying HTMLTableCaptionElement.
 * 
 * @returns {JSX.Element} The TableCaption component.
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
