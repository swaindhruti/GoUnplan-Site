"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Button } from "../ui/button";
import { smoothScrollToSection } from "../global/Handlescroll";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const images = [
    "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg",
    "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
  ];

  return (
    <div className="h-screen w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        }}
        speed={1000}
        allowTouchMove={true}
        effect="slide"
        spaceBetween={0}
        centeredSlides={true}
        grabCursor={true}
        freeMode={false}
        watchSlidesProgress={true}
        // pagination={{
        //   clickable: true,
        //   dynamicBullets: true
        // }}
        // navigation={true}
        className="h-full w-full [&_.swiper-slide-active]:scale-100 [&_.swiper-slide]:transition-transform [&_.swiper-slide]:duration-1000"
        style={
          {
            //   "--swiper-theme-color": "#ffffff",
            //   "--swiper-navigation-size": "24px"
          }
        }
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative overflow-hidden">
            <Image
              src={image}
              alt={`Hero Image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              style={{
                objectFit: "cover"
              }}
              className="transition-transform duration-1000 ease-in-out"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-center">
        {" "}
        <Button
          onClick={() =>
            smoothScrollToSection("#filtertrip", {
              offset: 0,
              duration: 1.2,
              onStart: () => console.log("Scroll started"),
              onComplete: () => console.log("Scroll completed")
            })
          }
          className="bg-purple-600 font-poppins absolute bottom-10  z-40 flex justify-center hover:bg-purple-700 text-white px-10 py-8 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          size="lg"
        >
          Explore More
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
