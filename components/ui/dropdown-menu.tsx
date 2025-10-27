/**
 * @file components/ui/dropdown-menu.tsx
 * @description This file contains the DropdownMenu component and its sub-components, built using Radix UI's DropdownMenu primitive, providing accessible and customizable dropdown menus.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root DropdownMenu component, built on Radix UI's DropdownMenuPrimitive.Root.
 * It manages the open/closed state of its content, which appears as a dropdown menu.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/dropdown-menu
 * 
 * @returns {JSX.Element} The DropdownMenu root component.
 */
const DropdownMenu = DropdownMenuPrimitive.Root

/**
 * @overview The DropdownMenuTrigger component, built on Radix UI's DropdownMenuPrimitive.Trigger.
 * This component should wrap the interactive element that opens or closes the dropdown menu when interacted with.
 * 
 * @returns {JSX.Element} The DropdownMenu trigger component.
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

/**
 * @overview The DropdownMenuGroup component, built on Radix UI's DropdownMenuPrimitive.Group.
 * Used to group related dropdown menu items together within the dropdown content.
 * 
 * @returns {JSX.Element} The DropdownMenu group component.
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group

/**
 * @overview The DropdownMenuPortal component, built on Radix UI's DropdownMenuPrimitive.Portal.
 * This component renders its children into a new DOM subtree outside of the current component hierarchy,
 * typically to ensure the dropdown menu overlays the entire page.
 * 
 * @returns {JSX.Element} The DropdownMenu portal component.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

/**
 * @overview The DropdownMenuSub component, built on Radix UI's DropdownMenuPrimitive.Sub.
 * A component that enables nesting of dropdown menus.
 * 
 * @returns {JSX.Element} The DropdownMenu sub-menu component.
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub

/**
 * @overview The DropdownMenuRadioGroup component, built on Radix UI's DropdownMenuPrimitive.RadioGroup.
 * A component that manages the checked state for a group of `DropdownMenuRadioItem` components, ensuring only one radio item can be selected at a time within the group.
 * 
 * @returns {JSX.Element} The DropdownMenu radio group component.
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/**
 * @overview The DropdownMenuSubTrigger component, built on Radix UI's DropdownMenuPrimitive.SubTrigger.
 * This component should wrap the interactive element that, when hovered or clicked, opens a submenu (`DropdownMenuSubContent`).
 * It includes a right-chevron icon to indicate the presence of a submenu.
 * 
 * @param {object} props - The properties for the DropdownMenuSubTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the sub-trigger button.
 * @param {boolean} [props.inset] - If true, applies an inset style (left padding) to the trigger.
 * @param {React.ReactNode} props.children - The content to display inside the sub-trigger button.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu sub-trigger component.
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

/**
 * @overview The DropdownMenuSubContent component, built on Radix UI's DropdownMenuPrimitive.SubContent.
 * The collapsible content area for a submenu, which appears when its `DropdownMenuSubTrigger` is activated.
 * It includes entry/exit animations.
 * 
 * @param {object} props - The properties for the DropdownMenuSubContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the sub-content area.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu sub-content component.
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

/**
 * @overview The DropdownMenuContent component, built on Radix UI's DropdownMenuPrimitive.Content.
 * This component contains the main content of the dropdown menu.
 * It is rendered inside a `DropdownMenuPortal` and animated for entrance/exit.
 * 
 * @param {object} props - The properties for the DropdownMenuContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {number} [props.sideOffset=4] - The distance in pixels between the content and the trigger.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu content component.
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

/**
 * @overview The DropdownMenuItem component, built on Radix UI's DropdownMenuPrimitive.Item.
 * An individual, selectable option within a dropdown menu.
 * 
 * @param {object} props - The properties for the DropdownMenuItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the menu item.
 * @param {boolean} [props.inset] - If true, applies an inset style (left padding) to the menu item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu item component.
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

/**
 * @overview The DropdownMenuCheckboxItem component, built on Radix UI's DropdownMenuPrimitive.CheckboxItem.
 * A menu item that can be checked or unchecked, typically displaying a checkbox icon.
 * 
 * @param {object} props - The properties for the DropdownMenuCheckboxItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the checkbox item.
 * @param {React.ReactNode} props.children - The content to display next to the checkbox.
 * @param {boolean} [props.checked] - The controlled checked state of the checkbox item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu checkbox item component.
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

/**
 * @overview The DropdownMenuRadioItem component, built on Radix UI's DropdownMenuPrimitive.RadioItem.
 * A menu item that can be selected from a group of mutually exclusive options, typically displaying a radio button icon.
 * 
 * @param {object} props - The properties for the DropdownMenuRadioItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the radio item.
 * @param {React.ReactNode} props.children - The content to display next to the radio button.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu radio item component.
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

/**
 * @overview The DropdownMenuLabel component, built on Radix UI's DropdownMenuPrimitive.Label.
 * A non-interactive label used to categorize or describe a group of menu items within the dropdown content.
 * 
 * @param {object} props - The properties for the DropdownMenuLabel component.
 * @param {string} [props.className] - Optional CSS class names to apply to the label.
 * @param {boolean} [props.inset] - If true, applies an inset style (left padding) to the label.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu label component.
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

/**
 * @overview The DropdownMenuSeparator component, built on Radix UI's DropdownMenuPrimitive.Separator.
 * A visual separator used to divide groups of menu items within the dropdown content.
 * 
 * @param {object} props - The properties for the DropdownMenuSeparator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The DropdownMenu separator component.
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

/**
 * @overview The DropdownMenuShortcut component.
 * A component used to display a keyboard shortcut associated with a menu item. It's purely presentational.
 * 
 * @param {object} props - The properties for the DropdownMenuShortcut component.
 * @param {string} [props.className] - Optional CSS class names to apply to the shortcut text.
 * 
 * @returns {JSX.Element} The DropdownMenu shortcut component.
 */
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
