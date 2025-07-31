"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionLabel } from "./common";
import { useRouter } from "next/navigation";

const faqs = [
  {
    id: 1,
    question: "What services do you offer?",
    answer:
      "We offer comprehensive travel planning services including destination research, accommodation booking, flight arrangements, activity planning, and 24/7 customer support throughout your journey.",
  },
  {
    id: 2,
    question: "How far in advance should I book my trip?",
    answer:
      "We recommend booking at least 2-3 months in advance for domestic trips and 4-6 months for international destinations. This ensures better availability and pricing for flights and accommodations.",
  },
  {
    id: 3,
    question: "Do you offer travel insurance?",
    answer:
      "Yes, we partner with leading insurance providers to offer comprehensive travel insurance options. We can help you choose the right coverage based on your destination, trip duration, and activities planned.",
  },
  {
    id: 4,
    question: "What happens if I need to cancel or modify my booking?",
    answer:
      "Our flexible booking policies allow for modifications and cancellations with varying terms depending on the service provider. We'll work with you to minimize any fees and find the best solution for your situation.",
  },
  {
    id: 5,
    question: "Do you provide 24/7 customer support during travel?",
    answer:
      "We provide round-the-clock support during your trip. Our emergency hotline is available 24/7 to assist with any issues, changes, or emergencies that may arise during your travels.",
  },
  {
    id: 6,
    question: "Can you help with visa and passport requirements?",
    answer:
      "Yes, we provide guidance on visa requirements, passport validity, and necessary documentation for your destination. We can also assist with visa application processes and connect you with relevant services.",
  },
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const router = useRouter();

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContactClick = () => {
    router.push("/contact");
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-purple-100 min-h-screen flex flex-col items-center px-6 py-16"
    >
      {/* Section Header */}
      <div className="w-full text-center mb-12">
        <SectionLabel label="FAQ" />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-extrabold text-gray-800 leading-tight mb-6">
            Frequently Asked <span className="text-purple-600">Questions</span>
          </h2>
          <p className="text-base md:text-lg font-roboto text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Find answers to common questions about our services and booking
            process. Can&apos;t find what you&apos;re looking for? We&apos;re
            here to help!
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-purple-50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                    <HelpCircle
                      className="w-6 h-6 text-purple-600"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-lg font-playfair md:text-xl font-semibold text-gray-900 leading-tight pr-4">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0 bg-purple-100 p-2 rounded-xl group-hover:bg-purple-200 transition-colors duration-300"
                >
                  <ChevronDown
                    className="w-5 h-5 text-purple-600"
                    strokeWidth={2.5}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openItems.includes(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2">
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                        <p className="text-base font-roboto text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-white border border-purple-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-base font-roboto text-gray-600 mb-6 max-w-md mx-auto">
              We&apos;re here to help! Our travel experts are ready to answer
              any questions and help you plan your perfect trip.
            </p>
            <button
              onClick={handleContactClick}
              className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-purple-700 transition-all duration-300 flex items-center gap-3 group mx-auto"
            >
              Contact Us
              <svg
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
