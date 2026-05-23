import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";

export default function BoardLoading() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-neutral-900 text-white">
      <Navbar username="" boardTitle="Loading..." />
      <div className="flex-1 w-full overflow-hidden p-4">
        <div className="flex gap-3 h-full overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex h-fit w-64 shrink-0 flex-col bg-neutral-900/90 rounded-xl p-3 gap-3 border border-neutral-800">
              <Skeleton className="h-6 w-32 bg-neutral-800 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-24 w-full bg-neutral-800 rounded-lg" />
                <Skeleton className="h-20 w-full bg-neutral-800 rounded-lg" />
                <Skeleton className="h-28 w-full bg-neutral-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
