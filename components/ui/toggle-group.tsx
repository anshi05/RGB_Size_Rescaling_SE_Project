/**
 * @file components/ui/toggle-group.tsx
 * @description This file contains the ToggleGroup component and its sub-components, built using Radix UI's ToggleGroup primitive, providing a set of two-state buttons that can be toggled on or off.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { toggleVariants } from '@/components/ui/toggle'

/**
 * @overview Context for the ToggleGroup, providing default variant and size props to its children.
 * @typedef {object} ToggleGroupContext
 * @property {string} [size='default'] - The size variant for the toggles.
 * @property {string} [variant='default'] - The visual style variant for the toggles.
 */
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: 'default',
  variant: 'default',
})

/**
 * @overview The root ToggleGroup component, built on Radix UI's ToggleGroupPrimitive.Root.
 * It manages the checked state for a group of two-state buttons, ensuring proper accessibility and styling.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/toggle-group
 * 
 * @param {object} props - The properties for the ToggleGroup component.
 * @param {string} [props.className] - Optional CSS class names to apply to the toggle group container.
 * @param {('default' | 'outline')} [props.variant='default'] - The visual style variant for all child `ToggleGroupItem` components.
 * @param {('default' | 'sm' | 'lg' | 'icon')} [props.size='default'] - The size variant for all child `ToggleGroupItem` components.
 * @param {React.ReactNode} props.children - The child `ToggleGroupItem` components to be rendered within the group.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ToggleGroup root component.
 */
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

/**
 * @overview The ToggleGroupItem component, built on Radix UI's ToggleGroupPrimitive.Item.
 * An individual two-state button within a `ToggleGroup`. It inherits `variant` and `size` from `ToggleGroupContext` if not explicitly provided.
 * 
 * @param {object} props - The properties for the ToggleGroupItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the toggle item button.
 * @param {React.ReactNode} props.children - The content to display inside the toggle item.
 * @param {('default' | 'outline')} [props.variant] - The visual style variant for this specific toggle item, overriding the context.
 * @param {('default' | 'sm' | 'lg' | 'icon')} [props.size] - The size variant for this specific toggle item, overriding the context.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The ToggleGroup item component.
 */
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
