/**
 * @file components/ui/context-menu.tsx
 * @description This file contains the ContextMenu component and its sub-components, built using Radix UI's ContextMenu primitive, providing customizable context menus.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root ContextMenu component, built on Radix UI's ContextMenuPrimitive.Root.
 * It manages the open/closed state and positioning of a context menu.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/context-menu
 * 
 * @returns {JSX.Element} The ContextMenu root component.
 */
const ContextMenu = ContextMenuPrimitive.Root

/**
 * @overview The ContextMenuTrigger component, built on Radix UI's ContextMenuPrimitive.Trigger.
 * This component should wrap the element that, when right-clicked or long-pressed, opens the context menu.
 * 
 * @returns {JSX.Element} The ContextMenu trigger component.
 */
const ContextMenuTrigger = ContextMenuPrimitive.Trigger

/**
 * @overview The ContextMenuGroup component, built on Radix UI's ContextMenuPrimitive.Group.
 * Used to group related context menu items together.
 * 
 * @returns {JSX.Element} The ContextMenu group component.
 */
const ContextMenuGroup = ContextMenuPrimitive.Group

/**
 * @overview The ContextMenuPortal component, built on Radix UI's ContextMenuPrimitive.Portal.
 * This component renders its children into a new DOM subtree outside of the current component hierarchy,
 * typically to ensure the context menu overlays the entire page.
 * 
 * @returns {JSX.Element} The ContextMenu portal component.
 */
const ContextMenuPortal = ContextMenuPrimitive.Portal

/**
 * @overview The ContextMenuSub component, built on Radix UI's ContextMenuPrimitive.Sub.
 * Used for creating nested context menus (submenus).
 * 
 * @returns {JSX.Element} The ContextMenu sub-menu component.
 */
const ContextMenuSub = ContextMenuPrimitive.Sub

/**
 * @overview The ContextMenuRadioGroup component, built on Radix UI's ContextMenuPrimitive.RadioGroup.
 * Used to group ContextMenuRadioItem components, ensuring only one item within the group can be checked at a time.
 * 
 * @returns {JSX.Element} The ContextMenu radio group component.
 */
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

/**
 * @overview The ContextMenuSubTrigger component, built on Radix UI's ContextMenuPrimitive.SubTrigger.
 * A menu item that, when hovered over, opens a nested submenu (`ContextMenuSubContent`).
 * It includes a chevron icon to indicate the presence of a submenu.
 * 
 * @param {object} props - The properties for the ContextMenuSubTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the sub-trigger.
 * @param {boolean} [props.inset] - If true, applies left padding to visually indent the item.
 * @param {React.ReactNode} props.children - The content to display inside the sub-trigger.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu sub-trigger component.
 */
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

/**
 * @overview The ContextMenuSubContent component, built on Radix UI's ContextMenuPrimitive.SubContent.
 * The content area for a nested context menu (submenu), which appears when its `ContextMenuSubTrigger` is hovered.
 * 
 * @param {object} props - The properties for the ContextMenuSubContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the sub-menu content.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu sub-content component.
 */
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

/**
 * @overview The ContextMenuContent component, built on Radix UI's ContextMenuPrimitive.Content.
 * The main content area of the context menu, containing all menu items, labels, and separators.
 * It is rendered inside a `ContextMenuPortal` for correct layering.
 * 
 * @param {object} props - The properties for the ContextMenuContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu content component.
 */
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

/**
 * @overview The ContextMenuItem component, built on Radix UI's ContextMenuPrimitive.Item.
 * An individual, clickable item within the context menu.
 * 
 * @param {object} props - The properties for the ContextMenuItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the menu item.
 * @param {boolean} [props.inset] - If true, applies left padding to visually indent the item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu item component.
 */
const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

/**
 * @overview The ContextMenuCheckboxItem component, built on Radix UI's ContextMenuPrimitive.CheckboxItem.
 * A menu item that can be checked or unchecked, typically with a checkmark icon indicating its state.
 * 
 * @param {object} props - The properties for the ContextMenuCheckboxItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the checkbox item.
 * @param {React.ReactNode} props.children - The content to display next to the checkbox.
 * @param {boolean} [props.checked] - The checked state of the item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu checkbox item component.
 */
const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

/**
 * @overview The ContextMenuRadioItem component, built on Radix UI's ContextMenuPrimitive.RadioItem.
 * A menu item that can be selected from a group of radio items, indicating a single choice.
 * It includes a circle icon to indicate its selected state.
 * 
 * @param {object} props - The properties for the ContextMenuRadioItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the radio item.
 * @param {React.ReactNode} props.children - The content to display next to the radio icon.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu radio item component.
 */
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

/**
 * @overview The ContextMenuLabel component, built on Radix UI's ContextMenuPrimitive.Label.
 * A non-interactive label used to categorize or describe a group of context menu items.
 * 
 * @param {object} props - The properties for the ContextMenuLabel component.
 * @param {string} [props.className] - Optional CSS class names to apply to the label.
 * @param {boolean} [props.inset] - If true, applies left padding to visually indent the label.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu label component.
 */
const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-foreground',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

/**
 * @overview The ContextMenuSeparator component, built on Radix UI's ContextMenuPrimitive.Separator.
 * A visual separator used to divide groups of context menu items.
 * 
 * @param {object} props - The properties for the ContextMenuSeparator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ContextMenu separator component.
 */
const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

/**
 * @overview The ContextMenuShortcut component.
 * Displays a keyboard shortcut associated with a context menu item, usually aligned to the right.
 * 
 * @param {object} props - The properties for the ContextMenuShortcut component.
 * @param {string} [props.className] - Optional CSS class names to apply to the shortcut text.
 * 
 * @returns {JSX.Element} The ContextMenu shortcut component.
 */
const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
