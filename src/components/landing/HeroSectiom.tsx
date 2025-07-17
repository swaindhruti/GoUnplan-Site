"use client";

import React from "react";
import Image from "next/image";
/* import { Swiper, SwiperSlide } from "swiper/modules"; */
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Button } from "../ui/button";
import { handleScroll } from "../global/Handlescroll";
import { ChevronDown } from "lucide-react";
import Header from "./Header";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";

export const HeroSection = () => {
  const slides = [
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752778417/1192092_zgldao.jpg",
      text: (
        <>
          your journey&apos;s{" "}
          <span className="highlight-wavy">love language</span>
        </>
      )
    },
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752787155/1510615_zvcpjw.jpg",
      text: (
        <>
          <span className="highlight-circle">crafted</span> for explorers
        </>
      )
    },
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752788073/pexels-cristian-s-575448225-18041997_fnpdvo.jpg",
      text: (
        <>
          slow travel is the new{" "}
          <span className="highlight-stroke">luxury</span>
        </>
      )
    },
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752787550/pexels-faruktokluoglu-12823547_jui5dt.jpg",
      text: (
        <>
          powered by stories,{" "}
          <span className="highlight-oval">backed by locals</span>
        </>
      )
    }
  ];

  return (
    <div className="relative w-full h-screen min-h-[600px]">
      <Header />
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        }}
        speed={1000}
        effect="slide"
        centeredSlides
        className="h-full w-full [&_.swiper-slide-active]:scale-100 [&_.swiper-slide]:transition-transform [&_.swiper-slide]:duration-1000"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative overflow-hidden">
            <Image
              src={slide.image}
              alt={`Hero Image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover transition-transform duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold leading-tight drop-shadow-xl max-w-[90%] sm:max-w-3xl md:max-w-4xl">
                {slide.text}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-6 sm:bottom-10 w-full z-40 flex justify-center">
        <Button
          onClick={() =>
            handleScroll({
              location: "#filtertrip",
              duration: 1.5,
              ease: "power3.inOut"
            })
          }
          className="group relative bg-black/50 font-montserrat backdrop-blur-xl border border-white/20 text-white px-8 py-4 sm:px-10 sm:py-6 rounded-full text-sm sm:text-base font-medium tracking-wide transition-all duration-500 hover:bg-black/30 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20 active:scale-95"
          size="lg"
        >
          <span className="relative z-10 flex items-center">
            Explore More
            <motion.div
              className="ml-3 flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                y: [0, 4, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </span>

          {/* Elegant hover effect overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-400/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Button>
      </div>
    </div>
  );
};
