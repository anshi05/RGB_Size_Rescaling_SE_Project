/**
 * @file hooks/use-toast.ts
 * @author Anshi
 * @description Custom hook for managing and displaying toast notifications.
 * @lastUpdated 2025-10-25
 */
'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

/**
 * @constant {number} TOAST_LIMIT - The maximum number of toasts to display at any given time.
 */
const TOAST_LIMIT = 1
/**
 * @constant {number} TOAST_REMOVE_DELAY - The delay in milliseconds before a dismissed toast is removed from the DOM.
 * @note This value was changed by the user in a previous step from 1,000,000ms to 1,000ms.
 */
const TOAST_REMOVE_DELAY = 1000

/**
 * @typedef {object} ToasterToast
 * @property {string} id - A unique identifier for the toast.
 * @property {React.ReactNode} [title] - The title of the toast.
 * @property {React.ReactNode} [description] - The description text of the toast.
 * @property {ToastActionElement} [action] - An optional action button for the toast.
 * @augments ToastProps
 */
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * @constant {object} actionTypes - Defines the types of actions that can be dispatched to the toast reducer.
 * @property {string} ADD_TOAST - Action type for adding a new toast.
 * @property {string} UPDATE_TOAST - Action type for updating an existing toast.
 * @property {string} DISMISS_TOAST - Action type for dismissing a toast (triggers exit animation).
 * @property {string} REMOVE_TOAST - Action type for removing a toast from the DOM (after dismissal).
 */
const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

/**
 * @overview Generates a unique ID for toast notifications.
 * It increments a global counter and ensures the ID is a string.
 * 
 * @returns {string} A unique string ID for a toast.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

/**
 * @typedef {object} Action
 * @description Represents an action that can be dispatched to modify the toast state.
 * @property {string} type - The type of action (e.g., 'ADD_TOAST', 'UPDATE_TOAST').
 * @property {ToasterToast} [toast] - The toast object (for ADD_TOAST and UPDATE_TOAST).
 * @property {string} [toastId] - The ID of the toast to target (for DISMISS_TOAST and REMOVE_TOAST).
 */
type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

/**
 * @interface State
 * @description Represents the state structure managed by the toast reducer.
 * @property {ToasterToast[]} toasts - An array of active toast notifications.
 */
interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * @overview Adds a toast's ID to a queue for eventual removal after a delay.
 * This prevents toasts from being removed immediately after dismissal animation starts.
 * 
 * @param {string} toastId - The unique ID of the toast to be added to the remove queue.
 * 
 * @returns {void}
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return // If already in queue, do nothing
  }

  // Set a timeout to remove the toast from the state after a specified delay
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * @overview Reducer function for managing the state of toast notifications.
 * It handles adding, updating, dismissing, and removing toasts based on dispatched actions.
 * 
 * @param {State} state - The current state of toast notifications.
 * @param {Action} action - The action to be performed on the toast state.
 * 
 * @returns {State} The new state after applying the action.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        // Add the new toast to the beginning of the array, limiting to TOAST_LIMIT
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        // Update an existing toast by merging its new properties
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        // Mark the toast(s) as not open, triggering animation
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [], // Remove all toasts if no specific ID is provided
        }
      }
      // Filter out the toast with the matching ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

/**
 * @constant {Array<Function>} listeners - An array of functions (setState dispatchers) that are notified when the global toast state changes.
 */
const listeners: Array<(state: State) => void> = []

/**
 * @var {State} memoryState - The current global state of toast notifications, initialized as an empty array of toasts.
 * This state is updated by the `dispatch` function and accessed by `useToast`.
 */
let memoryState: State = { toasts: [] }

/**
 * @overview Dispatches an action to the toast reducer, updating the global toast state
 * and notifying all registered listeners.
 * 
 * @param {Action} action - The action object to dispatch, which specifies the type of state change.
 * 
 * @returns {void}
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action) // Update the global state using the reducer
  // Notify all registered listeners about the state change
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * @typedef {Omit<ToasterToast, 'id'>} Toast
 * @description Represents a toast notification without the `id` property, used when creating new toasts.
 */
type Toast = Omit<ToasterToast, 'id'>

/**
 * @overview Creates and displays a new toast notification.
 * It generates a unique ID, dispatches an 'ADD_TOAST' action,
 * and returns an object with the toast's ID and functions to dismiss or update it.
 * 
 * @param {Toast} props - The properties for the toast notification (e.g., title, description, action).
 * 
 * @returns {{id: string, dismiss: Function, update: Function}} An object containing the toast's ID and control functions.
 */
function toast({ ...props }: Toast) {
  const id = genId()

  /**
   * @overview Updates an existing toast notification with new properties.
   * 
   * @param {ToasterToast} props - The new properties to apply to the toast.
   * 
   * @returns {void}
   */
  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  /**
   * @overview Dismisses the toast notification, triggering its exit animation.
   * 
   * @returns {void}
   */
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  // Dispatch the action to add the new toast to the state
  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      // Callback to dismiss the toast when its `open` state changes to false
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * @overview A custom React hook for interacting with the global toast notification system.
 * It provides access to the current list of active toasts and functions to create or dismiss toasts.
 * 
 * @returns {{toasts: ToasterToast[], toast: Function, dismiss: Function}} An object containing the current toasts array,
 * a function to create new toasts, and a function to dismiss existing toasts.
 */
function useToast() {
  // State to hold the current list of toasts, initialized with the global memoryState
  const [state, setState] = React.useState<State>(memoryState)

  // Effect hook to subscribe and unsubscribe to state changes.
  React.useEffect(() => {
    listeners.push(setState) // Add current component's setState to listeners
    return () => {
      // Cleanup: remove setState from listeners on unmount
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state]) // Rerun effect if state reference changes (though setState is stable)

  return {
    ...state,
    toast, // Function to create new toasts
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }), // Function to dismiss toasts
  }
}

export { useToast, toast }
