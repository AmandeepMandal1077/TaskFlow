import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <Navbar username="" boardTitle="Dashboard" />
      <main className="flex-1 max-w-7xl mx-auto w-full p-8">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-8 w-8 rounded-md bg-neutral-800" />
          <Skeleton className="h-8 w-48 rounded-md bg-neutral-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl bg-neutral-800" />
          ))}
        </div>
      </main>
    </div>
  );
}
