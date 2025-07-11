"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonials = [
  {
    id: 1,
    text: "An absolutely incredible experience! The attention to detail and personalized service made our Maldives trip unforgettable. Highly recommend!",
    name: "James Anderson",
    image: "/placeholder.svg?height=80&width=80"
  },
  {
    id: 2,
    text: "Outstanding service from start to finish. The team went above and beyond to ensure every aspect of our vacation was perfect. Five stars!",
    name: "Sarah Mitchell",
    image: "/placeholder.svg?height=80&width=80"
  },
  {
    id: 3,
    text: "Professional, reliable, and incredibly knowledgeable. They turned our dream vacation into reality with seamless planning and execution.",
    name: "Michael Chen",
    image: "/placeholder.svg?height=80&width=80"
  },
  {
    id: 4,
    text: "Exceptional quality and attention to customer satisfaction. The personalized approach made all the difference in our travel experience.",
    name: "Emily Rodriguez",
    image: "/placeholder.svg?height=80&width=80"
  },
  {
    id: 5,
    text: "Truly remarkable service! Every detail was carefully planned and executed flawlessly. We couldn't have asked for a better experience.",
    name: "David Thompson",
    image: "/placeholder.svg?height=80&width=80"
  }
];

export default function ReviewSection() {
  const slides = useMemo(
    () =>
      testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.id}>
          <div className="flex flex-col items-center justify-center px-4">
            <div className="mb-6 sm:mb-8">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto text-purple-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <blockquote className="text-base font-roboto sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl leading-relaxed">
              &quot;{testimonial.text}&quot;
            </blockquote>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden mb-3 sm:mb-4 border-4 border-white shadow-lg">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold font-roboto text-gray-900">
                {testimonial.name}
              </h4>
            </div>
          </div>
        </SwiperSlide>
      )),
    []
  );

  return (
    <section className="min-h-[80vh] sm:min-h-[70vh] lg:min-h-[60vh] bg-purple-500/[0.1] px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="flex justify-center mb-4 sm:mb-6">
              <Badge
                variant="outline"
                className="bg-white text-purple-600 text-sm sm:text-[16px] font-semibold tracking-wide uppercase rounded-full py-1.5 px-4 sm:py-2 sm:px-8"
              >
                TESTIMONIALS
              </Badge>
            </div>
            <h2 className="text-3xl font-playfair sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-12">
              Top Reviews
            </h2>
          </div>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false
            }}
            speed={800}
            allowTouchMove={true}
            className="w-full max-w-2xl mx-auto"
          >
            {slides}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
