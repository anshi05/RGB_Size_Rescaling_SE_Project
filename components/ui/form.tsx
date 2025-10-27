/**
 * @file components/ui/form.tsx
 * @description This file provides a robust and accessible form building solution, integrating with `react-hook-form` and Radix UI components for enhanced validation and state management.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

/**
 * @overview The root Form component, powered by `react-hook-form`'s `FormProvider`.
 * It sets up the form context, allowing all descendant form elements to access form state and methods.
 * 
 * @see https://react-hook-form.com/api/useformcontext/
 * 
 * @returns {JSX.Element} The Form context provider component.
 */
const Form = FormProvider

/**
 * @typedef {object} FormFieldContextValue
 * @property {TName} name - The name of the form field, typically matching the schema.
 * @template {FieldValues} TFieldValues - The type of the form values.
 * @template {FieldPath<TFieldValues>} TName - The name of the field within the form values.
 */
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

/**
 * @overview The FormField component, wrapping `react-hook-form`'s `Controller`.
 * It connects individual form inputs to the form state, managing their value, validation, and rendering logic.
 * 
 * @param {object} props - The properties for the FormField component.
 * @augments ControllerProps<TFieldValues, TName>
 * @template {FieldValues} TFieldValues - The type of the form values.
 * @template {FieldPath<TFieldValues>} TName - The name of the field within the form values.
 * 
 * @returns {JSX.Element} The FormField component providing field context.
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

/**
 * @overview A hook to access the current form field's state and properties.
 * Must be used within a `<FormField>` component.
 * 
 * @throws {Error} If used outside of a `<FormField>` component.
 * @returns {object} An object containing the field's ID, name, and validation state.
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

/**
 * @typedef {object} FormItemContextValue
 * @property {string} id - A unique ID for the form item.
 */
type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

/**
 * @overview The FormItem component.
 * A wrapper component for individual form fields, providing a consistent layout for labels, inputs, descriptions, and error messages.
 * It automatically generates unique IDs for accessibility.
 * 
 * @param {object} props - The properties for the FormItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the item container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The FormItem component.
 */
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

/**
 * @overview The FormLabel component, built on Radix UI's LabelPrimitive.Root and integrated with `useFormField`.
 * It provides an accessible label for form controls, automatically associating with the correct input field and displaying error states.
 * 
 * @param {object} props - The properties for the FormLabel component.
 * @param {string} [props.className] - Optional CSS class names to apply to the label.
 * @param {React.Ref<HTMLLabelElement>} ref - Ref to the underlying HTMLLabelElement.
 * 
 * @returns {JSX.Element} The FormLabel component.
 */
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

/**
 * @overview The FormControl component, built on Radix UI's Slot and integrated with `useFormField`.
 * It acts as a wrapper for the actual form input component, ensuring accessibility attributes are correctly applied based on the form field's state.
 * 
 * @param {object} props - The properties for the FormControl component.
 * @param {React.Ref<HTMLElement>} ref - Ref to the underlying HTML element (can be any element when `asChild` is used).
 * 
 * @returns {JSX.Element} The FormControl component.
 */
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

/**
 * @overview The FormDescription component.
 * Provides supplementary descriptive text for a form field, enhancing user understanding.
 * 
 * @param {object} props - The properties for the FormDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description text.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The FormDescription component.
 */
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

/**
 * @overview The FormMessage component.
 * Displays validation error messages for a form field.
 * It automatically retrieves the error message from the form state and renders it.
 * 
 * @param {object} props - The properties for the FormMessage component.
 * @param {string} [props.className] - Optional CSS class names to apply to the message text.
 * @param {React.ReactNode} [props.children] - Optional custom content to display instead of the error message.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element | null} The FormMessage component or null if there's no error message.
 */
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
