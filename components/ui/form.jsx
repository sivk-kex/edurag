import React from "react"
import { cn } from "@/lib/utils"

const Form = ({ className, ...props }) => <form className={cn("space-y-6", className)} {...props} />
Form.displayName = "Form"

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-2", className)} {...props} />
))
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
    {children}
  </p>
))
FormMessage.displayName = "FormMessage"

const FormField = ({ control, name, render }) => {
  return render({
    field: {
      name,
      value: "",
      onChange: () => {},
      onBlur: () => {},
      ref: () => {},
    },
    fieldState: { error: null },
    formState: { errors: {} },
  })
}

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }
