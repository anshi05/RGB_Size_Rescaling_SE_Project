/**
 * @file components/ui/sidebar.tsx
 * @description This file provides a comprehensive Sidebar component system, offering various layouts, collapsible behaviors, and sub-components for navigation and content display.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { VariantProps, cva } from 'class-variance-authority'
import { PanelLeft } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * @constant {string} SIDEBAR_COOKIE_NAME - The name of the cookie used to store the sidebar's state (expanded/collapsed).
 */
const SIDEBAR_COOKIE_NAME = 'sidebar:state'
/**
 * @constant {number} SIDEBAR_COOKIE_MAX_AGE - The maximum age of the sidebar state cookie in seconds (7 days).
 */
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
/**
 * @constant {string} SIDEBAR_WIDTH - The default width of the sidebar when expanded on desktop.
 */
const SIDEBAR_WIDTH = '16rem'
/**
 * @constant {string} SIDEBAR_WIDTH_MOBILE - The width of the sidebar when opened on mobile.
 */
const SIDEBAR_WIDTH_MOBILE = '18rem'
/**
 * @constant {string} SIDEBAR_WIDTH_ICON - The width of the sidebar when collapsed to icon-only mode.
 */
const SIDEBAR_WIDTH_ICON = '3rem'
/**
 * @constant {string} SIDEBAR_KEYBOARD_SHORTCUT - The keyboard shortcut key to toggle the sidebar (e.g., 'b' for Ctrl+B or Cmd+B).
 */
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

/**
 * @typedef {object} SidebarContext
 * @property {('expanded' | 'collapsed')} state - The current state of the sidebar (expanded or collapsed).
 * @property {boolean} open - Indicates if the sidebar is currently open.
 * @property {(open: boolean) => void} setOpen - Function to set the open state of the sidebar.
 * @property {boolean} openMobile - Indicates if the mobile sidebar (Sheet) is currently open.
 * @property {(open: boolean) => void} setOpenMobile - Function to set the open state of the mobile sidebar.
 * @property {boolean} isMobile - Indicates if the current viewport is considered mobile.
 * @property {() => void} toggleSidebar - Function to toggle the sidebar's open/collapsed state.
 */
type SidebarContext = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

/**
 * @constant {React.Context<SidebarContext | null>} SidebarContext - React context for providing sidebar state and functions to its children.
 */
const SidebarContext = React.createContext<SidebarContext | null>(null)

/**
 * @overview Custom hook to access the sidebar context.
 * Throws an error if used outside of a `SidebarProvider`.
 * 
 * @returns {SidebarContext} The current sidebar context.
 * @throws {Error} If `useSidebar` is not used within a `SidebarProvider`.
 */
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

/**
 * @overview The SidebarProvider component.
 * This component provides the context for the entire sidebar system, managing its open/collapsed state,
 * mobile responsiveness, and keyboard shortcuts.
 * 
 * @param {object} props - The properties for the SidebarProvider component.
 * @param {boolean} [props.defaultOpen=true] - The initial open state of the sidebar on desktop.
 * @param {boolean} [props.open] - Controlled open state of the sidebar.
 * @param {(open: boolean) => void} [props.onOpenChange] - Callback fired when the open state changes.
 * @param {string} [props.className] - Optional CSS class names to apply to the provider's root div.
 * @param {React.CSSProperties} [props.style] - Optional inline CSS styles.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the sidebar system.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarProvider component.
 */
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open],
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? 'expanded' : 'collapsed'

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      ],
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar',
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  },
)
SidebarProvider.displayName = 'SidebarProvider'

/**
 * @overview The Sidebar component.
 * This component renders the main sidebar layout, which can be positioned on the left or right,
 * have different visual variants (sidebar, floating, inset), and various collapsible behaviors.
 * It adapts its rendering based on whether the device is mobile or desktop.
 * 
 * @param {object} props - The properties for the Sidebar component.
 * @param {('left' | 'right')} [props.side='left'] - The side of the screen the sidebar appears on.
 * @param {('sidebar' | 'floating' | 'inset')} [props.variant='sidebar'] - The visual style variant of the sidebar.
 * @param {('offcanvas' | 'icon' | 'none')} [props.collapsible='offcanvas'] - The collapsible behavior of the sidebar.
 * @param {string} [props.className] - Optional CSS class names to apply to the sidebar container.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the sidebar.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Sidebar component.
 */
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left' | 'right'
    variant?: 'sidebar' | 'floating' | 'inset'
    collapsible?: 'offcanvas' | 'icon' | 'none'
  }
>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === 'none') {
      return (
        <div
          className={cn(
            'flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            'duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear',
            'group-data-[collapsible=offcanvas]:w-0',
            'group-data-[side=right]:rotate-180',
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
          )}
        />
        <div
          className={cn(
            'duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex',
            side === 'left'
              ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
              : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
            // Adjust the padding for floating and inset variants.
            variant === 'floating' || variant === 'inset'
              ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  },
)
Sidebar.displayName = 'Sidebar'

/**
 * @overview The SidebarTrigger component.
 * A button that, when clicked, toggles the sidebar's visibility or collapsed state.
 * It typically displays an icon like `PanelLeft`.
 * 
 * @param {object} props - The properties for the SidebarTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @param {Function} [props.onClick] - Optional click handler to be executed before the sidebar toggle.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The SidebarTrigger component.
 */
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = 'SidebarTrigger'

/**
 * @overview The SidebarRail component.
 * A draggable handle that allows users to resize or toggle the sidebar, particularly in collapsible modes.
 * It has a hidden visual indicator that appears on hover.
 * 
 * @param {object} props - The properties for the SidebarRail component.
 * @param {string} [props.className] - Optional CSS class names to apply to the rail.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The SidebarRail component.
 */
const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = 'SidebarRail'

/**
 * @overview The SidebarInset component.
 * This component is intended to wrap the main content area when the sidebar has an 'inset' variant.
 * It provides responsive styling for the content area to adjust to the sidebar's presence.
 * 
 * @param {object} props - The properties for the SidebarInset component.
 * @param {string} [props.className] - Optional CSS class names to apply to the main content element.
 * @param {React.Ref<HTMLElement>} ref - Ref to the underlying HTMLMainElement.
 * 
 * @returns {JSX.Element} The SidebarInset component.
 */
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'main'>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        'relative flex min-h-svh flex-1 flex-col bg-background',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        className,
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = 'SidebarInset'

/**
 * @overview The SidebarInput component.
 * A styled input field specifically designed for use within the sidebar, often for search or filtering.
 * 
 * @param {object} props - The properties for the SidebarInput component.
 * @param {string} [props.className] - Optional CSS class names to apply to the input element.
 * @param {React.Ref<HTMLInputElement>} ref - Ref to the underlying HTMLInputElement.
 * 
 * @returns {JSX.Element} The SidebarInput component.
 */
const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        'h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        className,
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = 'SidebarInput'

/**
 * @overview The SidebarHeader component.
 * A container for the header section of the sidebar, typically holding titles, logos, or controls.
 * 
 * @param {object} props - The properties for the SidebarHeader component.
 * @param {string} [props.className] - Optional CSS class names to apply to the header div.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarHeader component.
 */
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = 'SidebarHeader'

/**
 * @overview The SidebarFooter component.
 * A container for the footer section of the sidebar, typically holding action buttons or metadata.
 * 
 * @param {object} props - The properties for the SidebarFooter component.
 * @param {string} [props.className] - Optional CSS class names to apply to the footer div.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarFooter component.
 */
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = 'SidebarFooter'

/**
 * @overview The SidebarSeparator component.
 * A visual separator used to divide sections within the sidebar, typically a horizontal line.
 * 
 * @param {object} props - The properties for the SidebarSeparator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarSeparator component.
 */
const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn('mx-2 w-auto bg-sidebar-border', className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = 'SidebarSeparator'

/**
 * @overview The SidebarContent component.
 * The main scrollable content area of the sidebar, where menu items, groups, and other components are rendered.
 * 
 * @param {object} props - The properties for the SidebarContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content div.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarContent component.
 */
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = 'SidebarContent'

/**
 * @overview The SidebarGroup component.
 * A container for grouping related menu items or other content within the sidebar.
 * 
 * @param {object} props - The properties for the SidebarGroup component.
 * @param {string} [props.className] - Optional CSS class names to apply to the group div.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarGroup component.
 */
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = 'SidebarGroup'

/**
 * @overview The SidebarGroupLabel component.
 * A label for a `SidebarGroup`, typically displayed as a heading for the group.
 * 
 * @param {object} props - The properties for the SidebarGroupLabel component.
 * @param {string} [props.className] - Optional CSS class names to apply to the label.
 * @param {boolean} [props.asChild=false] - If true, the component will render its child as a slot, passing its props down.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarGroupLabel component.
 */
const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        'duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

/**
 * @overview The SidebarGroupAction component.
 * A button typically displayed within a `SidebarGroupLabel`, often used for actions related to the group.
 * 
 * @param {object} props - The properties for the SidebarGroupAction component.
 * @param {string} [props.className] - Optional CSS class names to apply to the action button.
 * @param {boolean} [props.asChild=false] - If true, the component will render its child as a slot, passing its props down.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The SidebarGroupAction component.
 */
const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = 'SidebarGroupAction'

/**
 * @overview The SidebarGroupContent component.
 * A container for the actual content within a `SidebarGroup`, such as menu items.
 * 
 * @param {object} props - The properties for the SidebarGroupContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content div.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarGroupContent component.
 */
const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn('w-full text-sm', className)}
    {...props}
  />
))
SidebarGroupContent.displayName = 'SidebarGroupContent'

/**
 * @overview The SidebarMenu component.
 * An unordered list (`<ul>`) used for displaying a collection of `SidebarMenuItem` components.
 * 
 * @param {object} props - The properties for the SidebarMenu component.
 * @param {string} [props.className] - Optional CSS class names to apply to the ul element.
 * @param {React.Ref<HTMLUListElement>} ref - Ref to the underlying HTMLUListElement.
 * 
 * @returns {JSX.Element} The SidebarMenu component.
 */
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn('flex w-full min-w-0 flex-col gap-1', className)}
    {...props}
  />
))
SidebarMenu.displayName = 'SidebarMenu'

/**
 * @overview The SidebarMenuItem component.
 * An individual list item (`<li>`) within a `SidebarMenu`, typically containing a `SidebarMenuButton`.
 * 
 * @param {object} props - The properties for the SidebarMenuItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the li element.
 * @param {React.Ref<HTMLLIElement>} ref - Ref to the underlying HTMLLIElement.
 * 
 * @returns {JSX.Element} The SidebarMenuItem component.
 */
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn('group/menu-item relative', className)}
    {...props}
  />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'

/**
 * @overview Defines the visual variants for the SidebarMenuButton component, including different styles and sizes, using `cva` (class-variance-authority).
 * It provides common styling for menu buttons within the sidebar.
 * 
 * @constant {Function} sidebarMenuButtonVariants - A function that generates Tailwind CSS classes for the menu button.
 * @property {object} variants - Defines the available variants for the menu button.
 * @property {object} variants.variant - Specifies the visual style of the button.
 * @property {string} variants.variant.default - Default styling for a menu button.
 * @property {string} variants.variant.outline - Outline styling for a menu button.
 * @property {object} variants.size - Specifies the size of the button.
 * @property {string} variants.size.default - Default size for the button.
 * @property {string} variants.size.sm - Small size for the button.
 * @property {string} variants.size.lg - Large size for the button.
 * @property {object} defaultVariants - Defines the default variant and size for the menu button.
 * @property {string} defaultVariants.variant - The default visual variant for menu buttons (e.g., 'default').
 * @property {string} defaultVariants.size - The default size for menu buttons (e.g., 'default').
 */
const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/**
 * @overview The SidebarMenuButton component.
 * A styled button component for use within `SidebarMenu`.
 * It supports different variants, sizes, active states, and optional tooltips.
 * 
 * @param {object} props - The properties for the SidebarMenuButton component.
 * @param {boolean} [props.asChild=false] - If true, the component will render its child as a slot, passing its props down.
 * @param {boolean} [props.isActive=false] - If true, the button will be styled as active.
 * @param {('default' | 'outline')} [props.variant='default'] - The visual style variant of the button.
 * @param {('default' | 'sm' | 'lg')} [props.size='default'] - The size variant of the button.
 * @param {string | React.ComponentProps<typeof TooltipContent>} [props.tooltip] - Optional tooltip content for the button. Can be a string or `TooltipContent` props.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The SidebarMenuButton component.
 */
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === 'string') {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== 'collapsed' || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  },
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

/**
 * @overview The SidebarMenuAction component.
 * A button component for actions related to a `SidebarMenuItem`, typically displayed on hover.
 * 
 * @param {object} props - The properties for the SidebarMenuAction component.
 * @param {string} [props.className] - Optional CSS class names to apply to the action button.
 * @param {boolean} [props.asChild=false] - If true, the component will render its child as a slot, passing its props down.
 * @param {boolean} [props.showOnHover=false] - If true, the action button will only be visible on hover of the parent `SidebarMenuItem`.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The SidebarMenuAction component.
 */
const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        'absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0',
        className,
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = 'SidebarMenuAction'

/**
 * @overview The SidebarMenuBadge component.
 * A small badge component for displaying counts or status within a `SidebarMenuItem`.
 * 
 * @param {object} props - The properties for the SidebarMenuBadge component.
 * @param {string} [props.className] - Optional CSS class names to apply to the badge.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarMenuBadge component.
 */
const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      'absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none',
      'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      className,
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

/**
 * @overview The SidebarMenuSkeleton component.
 * A skeleton loading state for menu items within the sidebar, providing a visual placeholder while content is loading.
 * 
 * @param {object} props - The properties for the SidebarMenuSkeleton component.
 * @param {string} [props.className] - Optional CSS class names to apply to the skeleton container.
 * @param {boolean} [props.showIcon=false] - If true, displays a placeholder icon within the skeleton.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The SidebarMenuSkeleton component.
 */
const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn('rounded-md h-8 flex gap-2 px-2 items-center', className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

/**
 * @overview The SidebarMenuSub component.
 * An unordered list (`<ul>`) used for displaying nested menu items, typically indented and with a visual border.
 * 
 * @param {object} props - The properties for the SidebarMenuSub component.
 * @param {string} [props.className] - Optional CSS class names to apply to the ul element.
 * @param {React.Ref<HTMLUListElement>} ref - Ref to the underlying HTMLUListElement.
 * 
 * @returns {JSX.Element} The SidebarMenuSub component.
 */
const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
      className,
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = 'SidebarMenuSub'

/**
 * @overview The SidebarMenuSubItem component.
 * An individual list item (`<li>`) within a `SidebarMenuSub`, used for nested menu items.
 * 
 * @param {object} props - The properties for the SidebarMenuSubItem component.
 * @param {React.Ref<HTMLLIElement>} ref - Ref to the underlying HTMLLIElement.
 * 
 * @returns {JSX.Element} The SidebarMenuSubItem component.
 */
const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

/**
 * @overview The SidebarMenuSubButton component.
 * A styled anchor (`<a>`) or button component for use within `SidebarMenuSub`.
 * It supports different sizes, active states, and behaves as a navigation link.
 * 
 * @param {object} props - The properties for the SidebarMenuSubButton component.
 * @param {boolean} [props.asChild=false] - If true, the component will render its child as a slot, passing its props down.
 * @param {('sm' | 'md')} [props.size='md'] - The size variant of the button.
 * @param {boolean} [props.isActive] - If true, the button will be styled as active.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @param {React.Ref<HTMLAnchorElement>} ref - Ref to the underlying HTMLAnchorElement.
 * 
 * @returns {JSX.Element} The SidebarMenuSubButton component.
 */
const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean
    size?: 'sm' | 'md'
    isActive?: boolean
  }
>(({ asChild = false, size = 'md', isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
