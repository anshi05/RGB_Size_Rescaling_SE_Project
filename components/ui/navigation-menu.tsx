/**
 * @file components/ui/navigation-menu.tsx
 * @description This file contains the NavigationMenu component and its sub-components, built using Radix UI's NavigationMenu primitive, providing accessible and customizable navigation menus.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root NavigationMenu component, built on Radix UI's NavigationMenuPrimitive.Root.
 * It manages the state and behavior of a collection of navigational links.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/navigation-menu
 * 
 * @param {object} props - The properties for the NavigationMenu component.
 * @param {string} [props.className] - Optional CSS class names to apply to the navigation menu container.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the navigation menu.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The NavigationMenu root component.
 */
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

/**
 * @overview The NavigationMenuList component, built on Radix UI's NavigationMenuPrimitive.List.
 * It renders an unordered list of navigation menu items.
 * 
 * @param {object} props - The properties for the NavigationMenuList component.
 * @param {string} [props.className] - Optional CSS class names to apply to the list.
 * @param {React.Ref<HTMLUListElement>} ref - Ref to the underlying HTMLUListElement.
 * 
 * @returns {JSX.Element} The NavigationMenu list component.
 */
const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className,
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

/**
 * @overview The NavigationMenuItem component, built on Radix UI's NavigationMenuPrimitive.Item.
 * An individual item within the navigation menu list.
 * 
 * @returns {JSX.Element} The NavigationMenu item component.
 */
const NavigationMenuItem = NavigationMenuPrimitive.Item

/**
 * @overview Defines the visual styles for the NavigationMenuTrigger component using `cva` (class-variance-authority).
 * It provides common styling for navigation menu triggers, including hover, focus, and open states.
 * 
 * @constant {Function} navigationMenuTriggerStyle - A function that generates Tailwind CSS classes for the trigger.
 */
const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
)

/**
 * @overview The NavigationMenuTrigger component, built on Radix UI's NavigationMenuPrimitive.Trigger.
 * This component should wrap the interactive element that, when hovered or clicked, opens a submenu (`NavigationMenuContent`).
 * It includes an animated chevron icon to indicate the open/closed state.
 * 
 * @param {object} props - The properties for the NavigationMenuTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the trigger button.
 * @param {React.ReactNode} props.children - The content to display inside the trigger button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The NavigationMenu trigger component.
 */
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

/**
 * @overview The NavigationMenuContent component, built on Radix UI's NavigationMenuPrimitive.Content.
 * The collapsible content area for a navigation menu item, which appears when its `NavigationMenuTrigger` is activated.
 * It includes entry/exit animations.
 * 
 * @param {object} props - The properties for the NavigationMenuContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content area.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The NavigationMenu content component.
 */
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

/**
 * @overview The NavigationMenuLink component, built on Radix UI's NavigationMenuPrimitive.Link.
 * A component that renders a navigation link within the menu.
 * 
 * @returns {JSX.Element} The NavigationMenu link component.
 */
const NavigationMenuLink = NavigationMenuPrimitive.Link

/**
 * @overview The NavigationMenuViewport component, built on Radix UI's NavigationMenuPrimitive.Viewport.
 * This component acts as the container for the `NavigationMenuContent`, handling its positioning and overflow.
 * It also applies animations for showing/hiding the content.
 * 
 * @param {object} props - The properties for the NavigationMenuViewport component.
 * @param {string} [props.className] - Optional CSS class names to apply to the viewport container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The NavigationMenu viewport component.
 */
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

/**
 * @overview The NavigationMenuIndicator component, built on Radix UI's NavigationMenuPrimitive.Indicator.
 * A visual indicator that highlights the currently active navigation menu item.
 * It includes animations for its appearance and disappearance.
 * 
 * @param {object} props - The properties for the NavigationMenuIndicator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the indicator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The NavigationMenu indicator component.
 */
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
