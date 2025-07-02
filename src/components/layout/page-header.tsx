import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function PageHeader() {
  return (
    <header className="bg-yellow-300 border-b-4 border-black">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-3xl font-black text-black uppercase flex items-center"
          >
            <ChevronLeft className="h-6 w-6 mr-1" strokeWidth={2.5} />
            UNPLAN
          </motion.div>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signin">
            <Button className="text-black bg-white border-3 border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
