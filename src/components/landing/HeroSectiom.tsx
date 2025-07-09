"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Button } from "../ui/button";
import { smoothScrollToSection } from "../global/Handlescroll";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const slides = [
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg",
      text: (
        <>
          your journey’s <span className="highlight-wavy">love language</span>
        </>
      )
    },
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg",
      text: (
        <>
          <span className="highlight-circle">crafted</span> for explorers
        </>
      )
    },
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752100073/pietro-de-grandi-T7K4aEPoGGk-unsplash_n0hci9.jpg",
      text: (
        <>
          slow travel is the new{" "}
          <span className="highlight-stroke">luxury</span>
        </>
      )
    },
    {
      image:
        "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752100078/sergey-pesterev-_VqyrvQi6do-unsplash_ugusf9.jpg",
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

            {/* Overlay Text */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold leading-tight drop-shadow-xl max-w-[90%] sm:max-w-3xl md:max-w-4xl">
                {slide.text}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Explore Button */}
      <div className="absolute bottom-6 sm:bottom-10 w-full z-40 flex justify-center">
        <Button
          onClick={() =>
            smoothScrollToSection("#filtertrip", {
              offset: 0,
              duration: 1.2,
              onStart: () => console.log("Scroll started"),
              onComplete: () => console.log("Scroll completed")
            })
          }
          className="bg-purple-600 font-poppins hover:bg-purple-700 text-white px-6 py-4 sm:px-10 sm:py-5 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          size="lg"
        >
          Explore More
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
