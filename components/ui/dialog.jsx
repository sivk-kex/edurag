"use client"

import React from "react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({
  open: false,
  setOpen: () => {},
})

function Dialog({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = React.useState(open || false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = React.useCallback(
    (value) => {
      setIsOpen(value)
      onOpenChange?.(value)
    },
    [onOpenChange],
  )

  return <DialogContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>{children}</DialogContext.Provider>
}

function DialogTrigger({ children, asChild = false, ...props }) {
  const { setOpen } = React.useContext(DialogContext)
  const Comp = asChild ? (
    React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e)
        setOpen(true)
      },
    })
  ) : (
    <button type="button" onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )

  return Comp
}

function DialogContent({ children, className, ...props }) {
  const { open, setOpen } = React.useContext(DialogContext)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div
        className={cn(
          "fixed z-50 grid w-full max-w-lg scale-100 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

function DialogFooter({ className, ...props }) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

function DialogTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
