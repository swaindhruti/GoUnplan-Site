// import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

export default function BookingPageLoading() {
  return (
    // <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
    //   <section className="bg-gradient-to-b from-gray-800 to-transparent text-white py-16 px-4 text-center rounded-lg shadow-lg">
    //     <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
    //     <Skeleton className="h-5 w-1/3 mx-auto mb-4" />
    //   </section>
    //   <section>
    //     <Skeleton className="h-6 w-48 mb-4" />
    //     <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
    //       <div className="space-y-2">
    //         <Skeleton className="h-4 w-3/4" />
    //         <Skeleton className="h-4 w-2/3" />
    //         <Skeleton className="h-4 w-1/2" />
    //       </div>
    //       <div className="space-y-2">
    //         <Skeleton className="h-4 w-3/4" />
    //         <Skeleton className="h-4 w-2/3" />
    //         <Skeleton className="h-4 w-1/2" />
    //       </div>
    //     </div>
    //   </section>
    //   <div>
    //     <div className="flex gap-4 mb-6">
    //       <Skeleton className="h-8 w-24" />
    //       <Skeleton className="h-8 w-36" />
    //       <Skeleton className="h-8 w-20" />
    //     </div>

    //     <div className="space-y-4">
    //       {[1, 2, 3].map((_, i) => (
    //         <div key={i} className=" rounded-lg p-6 space-y-3">
    //           <Skeleton className="h-5 w-2/3" />
    //           <Skeleton className="h-4 w-full" />
    //           <Skeleton className="h-4 w-1/2" />
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div className="grid md:grid-cols-2 gap-6">
    //     <div className="p-6 border rounded-lg space-y-4">
    //       <Skeleton className="h-8 w-32" />
    //       <Skeleton className="h-4 w-48" />
    //       <Skeleton className="h-4 w-52" />
    //       <Skeleton className="h-4 w-40" />
    //       <div className="flex gap-2 flex-wrap">
    //         <Skeleton className="h-4 w-16" />
    //         <Skeleton className="h-4 w-20" />
    //       </div>
    //       <Skeleton className="h-10 w-full" />
    //       <Skeleton className="h-10 w-full" />
    //     </div>
    //     <div className="p-6 border rounded-lg space-y-4">
    //       <Skeleton className="h-6 w-40" />
    //       <div className="flex items-center gap-4">
    //         <Skeleton className="h-12 w-12 rounded-full" />
    //         <div className="space-y-1">
    //           <Skeleton className="h-4 w-32" />
    //           <Skeleton className="h-4 w-24" />
    //           <Skeleton className="h-4 w-28" />
    //           <Skeleton className="h-4 w-36" />
    //         </div>
    //       </div>
    //       <Skeleton className="h-4 w-full" />
    //       <Skeleton className="h-4 w-3/4" />
    //       <Skeleton className="h-4 w-1/2" />
    //       <Skeleton className="h-6 w-24" />
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="h-12 w-12 text-purple-600 animate-spin" aria-label="Loading" />
      <p className="text-xl font-bold font-instrument text-black">Redirecting to Payment...</p>
    </div>
  );
}
