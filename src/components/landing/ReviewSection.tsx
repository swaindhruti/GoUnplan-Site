"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    id: 1,
    text: "An absolutely incredible experience! The attention to detail and personalized service made our Maldives trip unforgettable. Highly recommend!",
    name: "James Anderson",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    text: "Outstanding service from start to finish. The team went above and beyond to ensure every aspect of our vacation was perfect. Five stars!",
    name: "Sarah Mitchell",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    text: "Professional, reliable, and incredibly knowledgeable. They turned our dream vacation into reality with seamless planning and execution.",
    name: "Michael Chen",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    text: "Exceptional quality and attention to customer satisfaction. The personalized approach made all the difference in our travel experience.",
    name: "Emily Rodriguez",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    text: "Truly remarkable service! Every detail was carefully planned and executed flawlessly. We couldn't have asked for a better experience.",
    name: "David Thompson",
    image: "/placeholder.svg?height=80&width=80",
  },
];

export default function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="min-h-[30vh] bg-purple-500/[0.1] px-10 py-16">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div>
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="bg-white text-purple-600 text-[16px] font-semibold tracking-wide uppercase rounded-full py-2 px-8"
              >
                TESTIMONIALS
              </Badge>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-12 pt-6">
              Top Reviews
            </h2>
          </div>

          {/* Testimonial Content */}
          <div className="relative min-h-[40vh] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                {/* Quote Icon */}
                <div className="mb-8">
                  <svg
                    className="w-12 h-12 mx-auto text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <blockquote className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl leading-relaxed">
                  &quot;{currentTestimonial.text}&quot;
                </blockquote>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                    <Image
                      src={currentTestimonial.image || "/placeholder.svg"}
                      alt={currentTestimonial.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {currentTestimonial.name}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
