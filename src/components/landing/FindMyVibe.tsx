'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PrimaryButton, SectionLabel } from './common';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const vibeDescriptions: Record<string, string> = {
  Cultural:
    'Immerse yourself in local traditions, art, and history for a truly authentic experience.',
  Adventure: 'Thrilling activities and wild landscapes for adrenaline seekers.',
  Relaxation: 'Unwind in serene destinations designed for peace and comfort.',
  Nature: 'Explore breathtaking natural wonders and scenic escapes.',
};

export const FindMyVibe = () => {
  const router = useRouter();
  const [myVibes, setMyVibes] = useState(false);

  const vibes = [
    {
      label: 'Cultural',
      src: 'https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791020/pexels-emre-simsek-27565013-33041565_uqwqch.jpg',
    },
    {
      label: 'Adventure',
      src: 'https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791121/pexels-marius-mann-772581-33021041_fvxvqj.jpg',
    },
    {
      label: 'Relaxation',
      src: 'https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791236/pexels-kubra-ercan-2154019843-33019785_qdfrky.jpg',
    },
    {
      label: 'Nature',
      src: 'https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791316/pexels-ishahidsultan-33048368_vwox3l.jpg',
    },
  ];

  const handleVibeClick = (vibeLabel: string) => {
    router.push(`/trips?vibe=${encodeURIComponent(vibeLabel)}`);
  };

  const handleVibeButtonClick = () => {
    setMyVibes(true);
  };

  return (
    <div id="find-my-vibe" className="bg-purple-500/[0.05] relative min-h-screen w-full ">
      {myVibes && (
        <div className="w-screen flex justify-center -mt-3 lg:-mt-6 pt-6 lg:pt-12">
          <SectionLabel label="Choose Your Vibe!" />
        </div>
      )}
      <div
        id="vibes"
        className=" justify-center px-4 sm:px-6 py-10 md:py-20 flex flex-col lg:flex-row items-center gap-16 relative"
      >
        <div
          className={`relative w-full lg:w-1/4 flex flex-col items-center ${
            myVibes ? 'h-full justify-center' : 'gap-y-16'
          }`}
        >
          {' '}
          {!myVibes && (
            <div className="space-y-4 max-w-md text-center lg:text-left mt-16">
              <SectionLabel label="Choose Your Vibe!" />
              <h1 className="text-3xl max-md:justify-center flex sm:text-4xl lg:text-5xl font-bricolage leading-[1.05] tracking-tighter font-bold text-gray-900 ">
                Pick Your
                <br />
                <span className="text-gray-800 ml-3">Vibe</span>
              </h1>
              <p className="text-[15px] sm:text-[16px] mb-8 font-instrument text-gray-600">
                Join us as we explore the wonders of the globe, one incredible journey at a time.
              </p>
              <div onClick={handleVibeButtonClick} className="flex justify-center lg:justify-start">
                <PrimaryButton label="Find your Vibe" />
              </div>
            </div>
          )}
          <div
            onClick={() => handleVibeClick('Adventure')}
            className={`w-full cursor-pointer ${
              myVibes ? 'flex-1 min-h-[400px]' : 'h-[140px] sm:h-[190px] md:h-[240px] '
            } relative group`}
          >
            <Image
              src="https://ik.imagekit.io/bkt3emitco/f94c5898fcc5227a6b969b303bf8a1b6.jpg"
              alt="Adventure"
              fill
              className="object-cover rounded-[60px] sm:rounded-[80px] shadow-lg"
            />

            <div
              className={`absolute inset-0 rounded-[60px] sm:rounded-[80px] bg-black/40 backdrop-blur-md ${
                myVibes ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } transition-opacity flex flex-col justify-center items-center px-6`}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bricolage leading-[1.05] tracking-tighter font-semibold text-white mb-2">
                Adventure
              </div>
              <div className="text-base sm:text-lg text-white/90 font-instrument text-center">
                {vibeDescriptions['Adventure']}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-16">
          {vibes.map((vibe, index) => (
            <div
              key={index}
              onClick={() => handleVibeClick(vibe.label)}
              className="relative h-[140px] sm:h-[190px] md:h-[240px] w-full rounded-[60px] sm:rounded-[80px] overflow-hidden shadow-lg cursor-pointer hover:scale-[102%] duration-300 transition-transform group"
            >
              <Image src={vibe.src} alt={vibe.label} fill className="object-cover" />
              <div
                className={`absolute inset-0 rounded-[60px] sm:rounded-[80px] bg-black/40 backdrop-blur-md ${
                  myVibes ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity flex flex-col justify-center items-center px-6`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bricolage leading-[1.05] tracking-tighter font-semibold text-white mb-2">
                  {vibe.label}
                </div>
                <div className="text-base sm:text-lg text-white/90 font-instrument text-center">
                  {vibeDescriptions[vibe.label]}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/trips')}
          className="flex mb-4 items-center group rounded-full  font-poppins absolute bottom-0 gap-2 px-6 py-5 text-lg font-medium text-purple-500 hover:text-purple-600 hover:bg-purple-50 border-purple-500 cursor-pointer  transition-all duration-200"
        >
          View All Vibes
          <ArrowRight className="w-5 group-hover:translate-x-1 -ml-1 h-5" />
        </Button>
      </div>
    </div>
  );
};
