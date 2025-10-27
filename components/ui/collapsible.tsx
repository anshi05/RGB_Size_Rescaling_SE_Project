/**
 * @file components/ui/collapsible.tsx
 * @description This file contains the Collapsible component and its sub-components, built using Radix UI's Collapsible primitive.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

/**
 * @overview The root Collapsible component, built on Radix UI's CollapsiblePrimitive.Root.
 * It manages the open/closed state of its content.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/collapsible
 * 
 * @returns {JSX.Element} The Collapsible root component.
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * @overview The CollapsibleTrigger component, built on Radix UI's CollapsiblePrimitive.CollapsibleTrigger.
 * This component should wrap the interactive element that toggles the visibility of the `CollapsibleContent`.
 * 
 * @returns {JSX.Element} The Collapsible trigger component.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * @overview The CollapsibleContent component, built on Radix UI's CollapsiblePrimitive.CollapsibleContent.
 * This component contains the content that can be expanded or collapsed by the `CollapsibleTrigger`.
 * 
 * @returns {JSX.Element} The Collapsible content component.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
