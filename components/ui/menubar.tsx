/**
 * @file components/ui/menubar.tsx
 * @description This file contains the Menubar component and its sub-components, built using Radix UI's Menubar primitive, providing accessible and customizable menu bars.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { Check, ChevronRight, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The MenubarMenu component, built on Radix UI's MenubarPrimitive.Menu.
 * It acts as a wrapper for individual menu items within the Menubar, managing their open/closed state.
 * 
 * @returns {JSX.Element} The Menubar menu component.
 */
const MenubarMenu = MenubarPrimitive.Menu

/**
 * @overview The MenubarGroup component, built on Radix UI's MenubarPrimitive.Group.
 * Used to group related menubar items together within a menu.
 * 
 * @returns {JSX.Element} The Menubar group component.
 */
const MenubarGroup = MenubarPrimitive.Group

/**
 * @overview The MenubarPortal component, built on Radix UI's MenubarPrimitive.Portal.
 * This component renders its children into a new DOM subtree outside of the current component hierarchy,
 * typically to ensure menu content overlays the entire page.
 * 
 * @returns {JSX.Element} The Menubar portal component.
 */
const MenubarPortal = MenubarPrimitive.Portal

/**
 * @overview The MenubarSub component, built on Radix UI's MenubarPrimitive.Sub.
 * Used for creating nested menus (submenus) within a menubar item.
 * 
 * @returns {JSX.Element} The Menubar sub-menu component.
 */
const MenubarSub = MenubarPrimitive.Sub

/**
 * @overview The MenubarRadioGroup component, built on Radix UI's MenubarPrimitive.RadioGroup.
 * Used to group MenubarRadioItem components, ensuring only one item within the group can be checked at a time.
 * 
 * @returns {JSX.Element} The Menubar radio group component.
 */
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

/**
 * @overview The root Menubar component, built on Radix UI's MenubarPrimitive.Root.
 * It provides an accessible and customizable menu bar, typically used for application-level navigation.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/menubar
 * 
 * @param {object} props - The properties for the Menubar component.
 * @param {string} [props.className] - Optional CSS class names to apply to the menubar container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar root component.
 */
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      'flex h-10 items-center space-x-1 rounded-md border bg-background p-1',
      className,
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

/**
 * @overview The MenubarTrigger component, built on Radix UI's MenubarPrimitive.Trigger.
 * This component should wrap the interactive element that, when clicked, opens a dropdown menu within the menubar.
 * 
 * @param {object} props - The properties for the MenubarTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the trigger button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Menubar trigger component.
 */
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      className,
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

/**
 * @overview The MenubarSubTrigger component, built on Radix UI's MenubarPrimitive.SubTrigger.
 * A menubar item that, when hovered over, opens a nested submenu (`MenubarSubContent`).
 * It includes a chevron icon to indicate the presence of a submenu.
 * 
 * @param {object} props - The properties for the MenubarSubTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the sub-trigger.
 * @param {boolean} [props.inset] - If true, applies left padding to visually indent the item.
 * @param {React.ReactNode} props.children - The content to display inside the sub-trigger.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar sub-trigger component.
 */
const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
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
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

/**
 * @overview The MenubarSubContent component, built on Radix UI's MenubarPrimitive.SubContent.
 * The content area for a nested menubar (submenu), which appears when its `MenubarSubTrigger` is hovered.
 * 
 * @param {object} props - The properties for the MenubarSubContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the sub-menu content.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar sub-content component.
 */
const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

/**
 * @overview The MenubarContent component, built on Radix UI's MenubarPrimitive.Content.
 * The main content area of a menubar menu, containing all menu items, labels, and separators.
 * It is rendered inside a `MenubarPortal` for correct layering.
 * 
 * @param {object} props - The properties for the MenubarContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {('start' | 'center' | 'end')} [props.align='start'] - The alignment of the content relative to the trigger.
 * @param {number} [props.alignOffset=-4] - The offset along the align axis.
 * @param {number} [props.sideOffset=8] - The distance in pixels between the content and the trigger.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar content component.
 */
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref,
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  ),
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

/**
 * @overview The MenubarItem component, built on Radix UI's MenubarPrimitive.Item.
 * An individual, clickable item within a menubar menu.
 * 
 * @param {object} props - The properties for the MenubarItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the menu item.
 * @param {boolean} [props.inset] - If true, applies left padding to visually indent the item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar item component.
 */
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

/**
 * @overview The MenubarCheckboxItem component, built on Radix UI's MenubarPrimitive.CheckboxItem.
 * A menubar item that can be checked or unchecked, typically with a checkmark icon indicating its state.
 * 
 * @param {object} props - The properties for the MenubarCheckboxItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the checkbox item.
 * @param {React.ReactNode} props.children - The content to display next to the checkbox.
 * @param {boolean} [props.checked] - The checked state of the item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar checkbox item component.
 */
const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

/**
 * @overview The MenubarRadioItem component, built on Radix UI's MenubarPrimitive.RadioItem.
 * A menubar item that can be selected from a group of radio items, indicating a single choice.
 * It includes a circle icon to indicate its selected state.
 * 
 * @param {object} props - The properties for the MenubarRadioItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the radio item.
 * @param {React.ReactNode} props.children - The content to display next to the radio icon.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar radio item component.
 */
const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

/**
 * @overview The MenubarLabel component, built on Radix UI's MenubarPrimitive.Label.
 * A non-interactive label used to categorize or describe a group of menubar items.
 * 
 * @param {object} props - The properties for the MenubarLabel component.
 * @param {string} [props.className] - Optional CSS class names to apply to the label.
 * @param {boolean} [props.inset] - If true, applies left padding to visually indent the label.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar label component.
 */
const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

/**
 * @overview The MenubarSeparator component, built on Radix UI's MenubarPrimitive.Separator.
 * A visual separator used to divide groups of menubar items within a menu.
 * 
 * @param {object} props - The properties for the MenubarSeparator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Menubar separator component.
 */
const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

/**
 * @overview The MenubarShortcut component.
 * Displays a keyboard shortcut associated with a menubar item, usually aligned to the right.
 * 
 * @param {object} props - The properties for the MenubarShortcut component.
 * @param {string} [props.className] - Optional CSS class names to apply to the shortcut text.
 * 
 * @returns {JSX.Element} The Menubar shortcut component.
 */
const MenubarShortcut = ({
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
MenubarShortcut.displayName = 'MenubarShortcut'

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
