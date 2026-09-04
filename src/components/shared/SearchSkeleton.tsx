import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonSearch() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-full reeds" />
      </div>
     
    </div>
  )
}

