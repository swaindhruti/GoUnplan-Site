'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { handleScroll } from '@/components/global/Handlescroll';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dbnfkkfov/video/upload/v1764694095/WhatsApp_Video_2025-12-02_at_22.14.37_kib51z.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Text Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bricolage font-bold leading-[1.05] tracking-tighter drop-shadow-xl max-w-[90%] sm:max-w-3xl md:max-w-4xl">
          your journey&apos;s <span className="highlight-wavy">love language</span>
        </h2>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 w-full z-40 flex justify-center">
        <Button
          onClick={() =>
            handleScroll({
              location: '#filtertrip',
              duration: 1.5,
              ease: 'power3.inOut',
            })
          }
          className="group relative bg-black/50 font-instrument backdrop-blur-xl border border-white/20 text-white px-8 py-4 sm:px-10 sm:py-6 rounded-full text-sm sm:text-base font-medium tracking-wide transition-all duration-500 hover:bg-black/30 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20 active:scale-95"
          size="lg"
        >
          <span className="relative z-10 flex items-center">
            Explore More
            <motion.div
              className="ml-3 flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                y: [0, 4, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </span>

          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-400/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Button>
      </div>
    </div>
  );
};
