import { Skeleton } from "@/components/ui/skeleton"
import Loader from "./Loader"

export function OccupationsSkeleton() {
  return (
    <div className="djchat slider-wrapper">
      

      <div className="flex items-center gap-1 flex-column gicha">
        <Skeleton className=" wavy-circle " />
        <Skeleton className="h-2 w-[65px]" />
      </div>

      <div className="flex items-center gap-1 flex-row gichan">
        <Skeleton className=" wavy-circle " />
        <Skeleton className="h-2 w-[65px]" />
      </div>

      <div className="flex items-center gap-1 flex-column gicha">
        <Skeleton className=" wavy-circle " />
        <Skeleton className="h-2 w-[65px]" />
      </div>

      <div className="flex items-center gap-1 flex-row gichan">
        <Skeleton className=" wavy-circle " />
        <Skeleton className="h-2 w-[65px]" />
      </div>
      <Loader />

    </div>
  )
}
