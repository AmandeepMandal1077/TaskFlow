import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col text-white">
      <div className="h-14 border-b border-neutral-800 bg-neutral-900 flex items-center px-4">
        <Skeleton className="h-8 w-8 rounded bg-neutral-800 mr-4" />
        <Skeleton className="h-6 w-32 bg-neutral-800" />
      </div>
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <Skeleton className="h-10 w-64 bg-neutral-800 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-xl bg-neutral-800" />
          <Skeleton className="h-40 rounded-xl bg-neutral-800" />
          <Skeleton className="h-40 rounded-xl bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
