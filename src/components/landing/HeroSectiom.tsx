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
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        navigation={true}
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
      <Button
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-lg z-40 hover:bg-gray-200 transition-colors duration-300"
        onClick={() =>
          smoothScrollToSection("#filtertrip", {
            offset: 0,
            duration: 1.2,
            onStart: () => console.log("Scroll started"),
            onComplete: () => console.log("Scroll completed")
          })
        }
      >
        Explore More
      </Button>
    </div>
  );
};

export default HeroSection;
