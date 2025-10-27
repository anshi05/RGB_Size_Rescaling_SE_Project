/**
 * @file components/ui/command.tsx
 * @description This file contains the Command component and its sub-components, providing a command menu or searchable interface using `cmdk`.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'

/**
 * @overview The root Command component, built on `cmdk`'s CommandPrimitive.
 * It provides a highly performant and accessible command menu interface.
 * 
 * @see https://cmdk.paco.me/
 * 
 * @param {object} props - The properties for the Command component.
 * @param {string} [props.className] - Optional CSS class names to apply to the command root.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Command root component.
 */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

/**
 * @overview The CommandDialog component.
 * Wraps the `Command` component within a `Dialog` to create a modal command menu.
 * 
 * @param {object} props - The properties for the CommandDialog component.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the command dialog.
 * @augments DialogProps
 * 
 * @returns {JSX.Element} The Command dialog component.
 */
const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * @overview The CommandInput component, built on `cmdk`'s CommandPrimitive.Input.
 * Provides an input field for searching command items.
 * 
 * @param {object} props - The properties for the CommandInput component.
 * @param {string} [props.className] - Optional CSS class names to apply to the input field.
 * @param {React.Ref<HTMLInputElement>} ref - Ref to the underlying HTMLInputElement.
 * 
 * @returns {JSX.Element} The Command input component.
 */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

/**
 * @overview The CommandList component, built on `cmdk`'s CommandPrimitive.List.
 * Renders a scrollable list of command items.
 * 
 * @param {object} props - The properties for the CommandList component.
 * @param {string} [props.className] - Optional CSS class names to apply to the list.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Command list component.
 */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

/**
 * @overview The CommandEmpty component, built on `cmdk`'s CommandPrimitive.Empty.
 * Displays a message when no command items match the search query.
 * 
 * @param {object} props - The properties for the CommandEmpty component.
 * @param {string} [props.className] - Optional CSS class names to apply to the empty state message.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Command empty state component.
 */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

/**
 * @overview The CommandGroup component, built on `cmdk`'s CommandPrimitive.Group.
 * Organizes related command items under a common heading.
 * 
 * @param {object} props - The properties for the CommandGroup component.
 * @param {string} [props.className] - Optional CSS class names to apply to the group container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Command group component.
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

/**
 * @overview The CommandSeparator component, built on `cmdk`'s CommandPrimitive.Separator.
 * Provides a visual separator between command groups or items.
 * 
 * @param {object} props - The properties for the CommandSeparator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Command separator component.
 */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

/**
 * @overview The CommandItem component, built on `cmdk`'s CommandPrimitive.Item.
 * Represents an individual, selectable command within the command menu.
 * 
 * @param {object} props - The properties for the CommandItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Command item component.
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className,
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

/**
 * @overview The CommandShortcut component.
 * Displays a keyboard shortcut associated with a command item.
 * 
 * @param {object} props - The properties for the CommandShortcut component.
 * @param {string} [props.className] - Optional CSS class names to apply to the shortcut text.
 * 
 * @returns {JSX.Element} The Command shortcut component.
 */
const CommandShortcut = ({
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
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
