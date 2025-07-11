"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "What services do you offer?",
    answer:
      "We offer comprehensive travel planning services including destination research, accommodation booking, flight arrangements, activity planning, and 24/7 customer support throughout your journey."
  },
  {
    id: 2,
    question: "How far in advance should I book my trip?",
    answer:
      "We recommend booking at least 2-3 months in advance for domestic trips and 4-6 months for international destinations. This ensures better availability and pricing for flights and accommodations."
  },
  {
    id: 3,
    question: "Do you offer travel insurance?",
    answer:
      "Yes, we partner with leading insurance providers to offer comprehensive travel insurance options. We can help you choose the right coverage based on your destination, trip duration, and activities planned."
  },
  {
    id: 4,
    question: "What happens if I need to cancel or modify my booking?",
    answer:
      "Our flexible booking policies allow for modifications and cancellations with varying terms depending on the service provider. We'll work with you to minimize any fees and find the best solution for your situation."
  },
  {
    id: 5,
    question: "Do you provide 24/7 customer support during travel?",
    answer:
      "We provide round-the-clock support during your trip. Our emergency hotline is available 24/7 to assist with any issues, changes, or emergencies that may arise during your travels."
  },
  {
    id: 6,
    question: "Can you help with visa and passport requirements?",
    answer:
      "Yes, we provide guidance on visa requirements, passport validity, and necessary documentation for your destination. We can also assist with visa application processes and connect you with relevant services."
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="min-h-[50vh] bg-purple-500/[0.1] px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="flex justify-center mb-4 sm:mb-6">
              <Badge
                variant="outline"
                className="bg-white font-montserrat text-purple-600 text-sm sm:text-[16px] font-semibold tracking-wide uppercase rounded-full py-1.5 px-4 sm:py-2 sm:px-8"
              >
                FAQ
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl font-playfair md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg font-roboto text-gray-600 max-w-2xl mx-auto px-4">
              Find answers to common questions about our services and booking
              process
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: faq.id * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-base font-playfair sm:text-lg lg:text-xl font-semibold text-gray-900 pr-3 sm:pr-4 leading-tight">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
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
                      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-5 lg:pb-6 pt-2">
                        <p className="text-sm font-roboto sm:text-base text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
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
            className="text-center mt-8 sm:mt-10 lg:mt-12"
          >
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Still have questions? We&apos;re here to help!
            </p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors duration-200 text-sm sm:text-base">
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
