import React from "react"
import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn("flex", className)} aria-label="breadcrumb" {...props} />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("flex flex-wrap items-center gap-1.5", className)} {...props} />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? (
    React.cloneElement(props.children, { ref, ...props })
  ) : (
    <a ref={ref} className={cn("text-sm font-medium underline-offset-4 hover:underline", className)} {...props} />
  )

  return Comp
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm font-medium text-muted-foreground", className)}
    aria-current="page"
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-muted-foreground", className)} {...props}>
    /
  </span>
))
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }
