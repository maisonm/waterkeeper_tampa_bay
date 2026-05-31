import { ErrorBoundary, getErrorMessage, type FallbackProps } from "react-error-boundary"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type SectionErrorBoundaryProps = {
  children: ReactNode
  sectionName?: string
  className?: string
}

type SectionFallbackProps = FallbackProps & {
  sectionName?: string
  className?: string
}

const SectionFallback = ({
  error,
  resetErrorBoundary,
  sectionName,
  className,
}: SectionFallbackProps) => {
  const title = sectionName ? `${sectionName} failed to load` : "This section failed to load"
  const message = getErrorMessage(error) ?? "Something went wrong. Please try again."

  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center",
        className,
      )}
    >
      <AlertCircle className="size-8 text-destructive" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  )
}

export const SectionErrorBoundary = ({
  children,
  sectionName,
  className,
}: SectionErrorBoundaryProps) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={(props) => (
          <SectionFallback {...props} sectionName={sectionName} className={className} />
        )}
        onError={(error, info) => {
          const label = sectionName ?? "Dashboard section"
          console.error(`${label} error:`, error, info.componentStack)
        }}
      >
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
)
