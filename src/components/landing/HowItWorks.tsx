import { Square } from 'lucide-react';

import Image from 'next/image';

export const HowItWorksSection = () => {
  return (
    <div className="relative min-h-screen  flex items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
        <div className="relative hidden lg:block bg-purple-200">
          <Image
            src="https://ik.imagekit.io/bkt3emitco/pexels-rpnickson-2661176.jpg"
            alt="How it works background"
            fill
            className="object-cover object-center scale-80 shadow-lg "
            priority
          />
        </div>
        <div className="flex items-center justify-center bg-purple-200 px-6 py-16 lg:py-0">
          <div className="max-w-lg w-full text-center lg:text-left">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-black/20 rounded-full text-black text-xs sm:text-sm font-bold mb-6 border border-white/30 drop-shadow-lg">
              HOW IT WORKS
            </span>
            <h1 className="text-2xl font-bricolage leading-[1.05] tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium text-black  drop-shadow-2xl mb-8">
              Travel, <span className="text-purple-600">Simplified.</span>
            </h1>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 bg-white/20 flex items-center justify-center">
                  <Square className="w-full h-full text-transparent" />
                  <span className="absolute text-sm font-medium text-black">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-bricolage leading-[1.05] tracking-tighter font-normal text-black mb-1">
                    Explore trips designed by real hosts.
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 bg-white/20 flex items-center justify-center">
                  <Square className="w-full h-full text-transparent" />
                  <span className="absolute text-sm font-medium text-black">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-bricolage leading-[1.05] tracking-tighter font-normal text-black mb-1">
                    Match with people your age who vibe like you.
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 bg-white/20 flex items-center justify-center">
                  <Square className="w-full h-full text-transparent" />
                  <span className="absolute text-sm font-medium text-black">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bricolage leading-[1.05] tracking-tighter font-normal text-black mb-1">
                    Go. Experience. Belong.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Image with overlay */}
      </div>
    </div>
  );
};
