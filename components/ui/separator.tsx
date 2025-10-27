import * as React from "react"
import { cn } from "@/lib/utils"

export function Separator({ className }: { className?: string }) {
  return <div className={cn("my-4 h-[1px] w-full bg-muted", className)} />
}
