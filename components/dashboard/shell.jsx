import { cn } from "@/lib/utils"
import { DashboardNav } from "@/components/dashboard/nav"

export function DashboardShell({ children, className, ...props }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardNav />
      <main className="flex w-full flex-col overflow-hidden">
        <div className="container flex-1 space-y-4 p-8 pt-6">
          <div className="flex-1 space-y-4">
            <div className={cn("flex flex-col space-y-6", className)} {...props}>
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
