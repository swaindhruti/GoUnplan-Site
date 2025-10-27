"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { SectionLabel } from "./common";

const testimonials = [
  {
    id: 1,
    text: "ADidn’t know 4 strangers could feel like home.",
    name: "Arjun, Manali",
    role: "Adventure Enthusiast",
    rating: 5,
    image:
      "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752687713/44654751_9058421_vdjhyw.svg",
    destination: "Maldives Paradise"
  },
  {
    id: 2,
    text: "Earned enough from one trip to fund my next one.",
    name: "Mitali, Host, Gokarna",
    role: "Travel Blogger",
    rating: 5,
    image:
      "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752687713/44654751_9058421_vdjhyw.svg",
    destination: "Swiss Alps Adventure"
  },
  {
    id: 3,
    text: "It’s not a trip, it’s a travel family.",
    name: "Tanvi, Meghalaya",
    role: "Business Executive",
    rating: 5,
    image:
      "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752687713/44654751_9058421_vdjhyw.svg",
    destination: "Japanese Cultural Tour"
  },
  
];

export default function ReviewSection() {
  const slides = useMemo(
    () =>
      testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.id}>
          <div className="flex flex-col  items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Quote Icon */}
            {/* <div className="mb-6 sm:mb-8">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
              </div>
            </div> */}

            {/* Testimonial Text */}
            <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-purple-100">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
              </div>
            <blockquote className="text-base sm:text-lg lg:text-xl xl:text-2xl font-instrument text-gray-700 mb-6 sm:mb-8 lg:mb-10 max-w-4xl leading-relaxed text-center italic">
              &quot;{testimonial.text}&quot;
            </blockquote>

            {/* Rating Stars */}
            {/* <div className="flex items-center gap-1 mb-4 sm:mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400 fill-purple-400"
                />
              ))}
            </div> */}

            {/* Destination Badge */}
            {/* <div className="mb-6 sm:mb-8">
              <Badge className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 text-xs sm:text-sm font-semibold">
                {testimonial.destination}
              </Badge>
            </div> */}

            {/* Author Info */}
            <div className="flex flex-col items-center">
              
              <div className="text-center">
                <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold font-bricolage leading-[1.05] tracking-tighter text-gray-900 mb-1">
                  {testimonial.name}
                </h4>
                {/* <p className="text-sm sm:text-base text-purple-600 font-medium font-instrument">
                  {testimonial.role}
                </p> */}
              </div>
            </div>
          </div>
        </SwiperSlide>
      )),
    []
  );

  return (
    <section className="min-h-screen bg-purple-500/[0.05] justify-center px-4 sm:px-6 md:px-20  py-10 md:py-20 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="flex justify-center mb-6 sm:mb-8">
            <SectionLabel label="Community Stories" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-bricolage leading-[1.05] tracking-tighter text-gray-900 mb-4 sm:mb-6 ">
            From Strangers to
            <span className="block text-purple-600">Stories</span>
          </h2>
          {/* <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-instrument max-w-3xl mx-auto leading-relaxed">
            Discover authentic experiences from real travelers who have embarked
            on unforgettable journeys with us
          </p> */}
        </div>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            speed={1000}
            allowTouchMove={true}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            className="w-full max-w-4xl mx-auto"
          >
            {slides}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
