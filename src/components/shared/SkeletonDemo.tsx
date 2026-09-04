import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="london">
      <span className="hellen mt-3">Notifications</span>
      <div className="flex items-center gap-4">
        <Skeleton className=" wavy-circle " />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[350px]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
       <Skeleton className=" wavy-circle " />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[350px]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className=" wavy-circle " />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[350px]" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className=" wavy-circle " />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[350px]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className=" wavy-circle " />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[350px]" />
        </div>
      </div>
     
    </div>
  )
}
