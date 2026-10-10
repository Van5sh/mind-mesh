import { cn } from "@/lib/utils"

function PageLoader({
  label,
  className,
  fullHeight = true,
}: {
  label?: string
  className?: string
  fullHeight?: boolean
}) {
  return (
    <div
      data-slot="page-loader"
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3",
        fullHeight ? "py-24" : "py-10",
        className
      )}
    >
      <div className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-muted" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/40 [animation-duration:0.7s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}

export { PageLoader }
