import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <>
    <Card className="w-full max-w-xs mt-5 post-card">
      <CardHeader>
      <div className="flex w-fit items-center gap-0 pl-0 b-topper">
        <Skeleton className=" wavy-circle-sign user-prof" />
        <div className="flex gap-12 align-middle">
          <Skeleton className="h-5 w-[190px]" />
          <Skeleton className="h-5 w-[90px]" />
        </div>
      </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full " />
      </CardContent>
        <div className="flex gap-9 ml-8 mt-2">
          <Skeleton className="h-3 w-[190px]" />
          <Skeleton className="h-3 w-[90px]" />
        </div>
    </Card>

    <Card className="w-full max-w-xs mt-5 post-card">
      <CardHeader>
      <div className="flex w-fit items-center gap-0 pl-0 b-topper">
        <Skeleton className=" wavy-circle-sign user-prof" />
        <div className="flex gap-12 align-middle">
          <Skeleton className="h-5 w-[190px]" />
          <Skeleton className="h-5 w-[90px]" />
        </div>
      </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full " />
      </CardContent>
        <div className="flex gap-9  ml-8 mt-2">
          <Skeleton className="h-3 w-[190px]" />
          <Skeleton className="h-3 w-[90px]" />
        </div>
    </Card>

    </>
  )
}
