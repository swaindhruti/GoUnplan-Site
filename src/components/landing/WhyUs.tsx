import { CheckSquare, MessagesSquare, Compass, Handshake, LockKeyhole } from 'lucide-react';
import Image from 'next/image';

export const WhyUsSection = () => {
  return (
    <div className="relative min-h-screen   flex items-stretch bg-gradient-to-l from-purple-100 via-purple-200 to-purple-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen ">
        {/* Left: Image with overlay */}
        <div className="relative hidden lg:block">
          <Image
            src="https://ik.imagekit.io/bkt3emitco/pexels-quang-nguyen-vinh-222549-2133369.jpg"
            alt="Why us background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Right: Solid color with text */}
        <div className="flex items-center justify-center bg-purple-700 px-6 py-16 lg:py-0">
          <div className="max-w-lg w-full text-center lg:text-left">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-bold mb-6 border border-white/40 drop-shadow-lg">
              WHY US
            </span>
            <h1 className="text-2xl font-bricolage sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium text-white leading-[1.05] tracking-tighter drop-shadow-2xl mb-8">
              Why We&apos;re
              <br />
              Different
            </h1>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    Verified hosts you can trust
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <MessagesSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    {` Community > packages`}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    Every trip handcrafted
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <Handshake className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    Match with travelers like you
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <LockKeyhole className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    Safe, secure, transparent
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
