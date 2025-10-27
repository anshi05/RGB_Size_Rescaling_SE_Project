/**
 * @file components/ui/select.tsx
 * @description This file contains the Select component and its sub-components, built using Radix UI's Select primitive, providing accessible and customizable dropdown selection menus.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root Select component, built on Radix UI's SelectPrimitive.Root.
 * It manages the open/closed state and value of a custom dropdown select.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/select
 * 
 * @returns {JSX.Element} The Select root component.
 */
const Select = SelectPrimitive.Root

/**
 * @overview The SelectGroup component, built on Radix UI's SelectPrimitive.Group.
 * Used to group related select items together within the dropdown content.
 * 
 * @returns {JSX.Element} The Select group component.
 */
const SelectGroup = SelectPrimitive.Group

/**
 * @overview The SelectValue component, built on Radix UI's SelectPrimitive.Value.
 * This component displays the currently selected value of the select input.
 * 
 * @returns {JSX.Element} The Select value component.
 */
const SelectValue = SelectPrimitive.Value

/**
 * @overview The SelectTrigger component, built on Radix UI's SelectPrimitive.Trigger.
 * This component should wrap the interactive element that, when clicked, opens the select dropdown.
 * It includes a chevron icon to indicate its dropdown functionality.
 * 
 * @param {object} props - The properties for the SelectTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the trigger button.
 * @param {React.ReactNode} props.children - The content to display inside the trigger (usually a `SelectValue`).
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Select trigger component.
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * @overview The SelectScrollUpButton component, built on Radix UI's SelectPrimitive.ScrollUpButton.
 * A button displayed at the top of the select content when there are more items to scroll up to.
 * It includes an up-chevron icon.
 * 
 * @param {object} props - The properties for the SelectScrollUpButton component.
 * @param {string} [props.className] - Optional CSS class names to apply to the scroll up button.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Select scroll up button component.
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

/**
 * @overview The SelectScrollDownButton component, built on Radix UI's SelectPrimitive.ScrollDownButton.
 * A button displayed at the bottom of the select content when there are more items to scroll down to.
 * It includes a down-chevron icon.
 * 
 * @param {object} props - The properties for the SelectScrollDownButton component.
 * @param {string} [props.className] - Optional CSS class names to apply to the scroll down button.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Select scroll down button component.
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

/**
 * @overview The SelectContent component, built on Radix UI's SelectPrimitive.Content.
 * This component contains the scrollable list of `SelectItem` components that appear when the `SelectTrigger` is open.
 * It handles positioning, animations, and rendering within a portal.
 * 
 * @param {object} props - The properties for the SelectContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.ReactNode} props.children - The child elements (typically `SelectGroup` and `SelectItem` components) to be rendered within the content.
 * @param {('popper' | 'item')} [props.position='popper'] - The positioning strategy for the content.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Select content component.
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * @overview The SelectLabel component, built on Radix UI's SelectPrimitive.Label.
 * A non-interactive label used to categorize or describe a group of select items within the dropdown content.
 * 
 * @param {object} props - The properties for the SelectLabel component.
 * @param {string} [props.className] - Optional CSS class names to apply to the label.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Select label component.
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * @overview The SelectItem component, built on Radix UI's SelectPrimitive.Item.
 * An individual, selectable option within the select dropdown. It includes a checkmark icon for visual feedback.
 * 
 * @param {object} props - The properties for the SelectItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the select item.
 * @param {React.ReactNode} props.children - The content to display inside the select item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Select item component.
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * @overview The SelectSeparator component, built on Radix UI's SelectPrimitive.Separator.
 * A visual separator used to divide groups of select items within the dropdown content.
 * 
 * @param {object} props - The properties for the SelectSeparator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Select separator component.
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
