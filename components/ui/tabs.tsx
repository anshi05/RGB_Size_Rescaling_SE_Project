/**
 * @file components/ui/tabs.tsx
 * @description This file contains the Tabs component and its sub-components, built using Radix UI's Tabs primitive, providing accessible and customizable tabbed interfaces.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

/**
 * @overview The root Tabs component, built on Radix UI's TabsPrimitive.Root.
 * It manages the active tab state and accessibility for a tabbed interface.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/tabs
 * 
 * @returns {JSX.Element} The Tabs root component.
 */
const Tabs = TabsPrimitive.Root

/**
 * @overview The TabsList component, built on Radix UI's TabsPrimitive.List.
 * A container for `TabsTrigger` components, typically displayed horizontally.
 * 
 * @param {object} props - The properties for the TabsList component.
 * @param {string} [props.className] - Optional CSS class names to apply to the list container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Tabs list component.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * @overview The TabsTrigger component, built on Radix UI's TabsPrimitive.Trigger.
 * An interactive button that, when activated, displays its associated `TabsContent` and marks itself as active.
 * 
 * @param {object} props - The properties for the TabsTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the trigger button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Tabs trigger component.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * @overview The TabsContent component, built on Radix UI's TabsPrimitive.Content.
 * The content area associated with a `TabsTrigger`. It is displayed only when its corresponding trigger is active.
 * 
 * @param {object} props - The properties for the TabsContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content area.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Tabs content component.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
