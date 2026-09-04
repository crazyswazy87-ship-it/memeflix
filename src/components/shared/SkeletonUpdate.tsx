import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonUpdate() {
  return (
    <div className="gee">
      <Skeleton className=" wavy-circle-xxl "/>
      
      <Skeleton className="h-4 w-1/3 mt-7" />
      <Skeleton className="h-6 w-3/3 mt-2" />

      <Skeleton className="h-4 w-1/3 mt-8" />
      <Skeleton className="h-6 w-3/3 mt-2" />

      <Skeleton className="h-4 w-1/3 mt-8" />
      <Skeleton className="h-6 w-3/3 mt-2" />

      <Skeleton className="h-4 w-1/3 mt-8" />
      <Skeleton className="h-6 w-3/3 mt-2" />       
    </div>
  )
}
