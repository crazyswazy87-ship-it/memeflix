import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonProfile() {
  return (
    <div className="dika">
      <Skeleton className=" h-70 w-95" />
      
       <Skeleton className="h-4 w-2/3" />

       <div className="fill">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-1/3" />
       </div>

      
       <Skeleton className="h-6 w-3/3 mt-5" />       
    </div>
  )
}
