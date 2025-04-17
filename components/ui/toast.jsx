"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext({})

function Toast({ className, variant = "default", ...props }) {
  const { dismissToast } = React.useContext(ToastContext)

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
        {
          "border-destructive bg-destructive text-destructive-foreground": variant === "destructive",
          "border-border bg-background text-foreground": variant === "default",
        },
        className,
      )}
      {...props}
    />
  )
}

function ToastClose(props) {
  const { dismissToast } = React.useContext(ToastContext)

  return (
    <button
      className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      onClick={() => dismissToast()}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  )
}

function ToastDescription({ className, ...props }) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const dismissToast = React.useCallback(() => {
    setToasts([])
  }, [])

  return <ToastContext.Provider value={{ toasts, setToasts, dismissToast }}>{children}</ToastContext.Provider>
}

function ToastTitle({ className, ...props }) {
  return <div className={cn("text-sm font-medium", className)} {...props} />
}

function ToastViewport(props) {
  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      {...props}
    />
  )
}

export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport }
