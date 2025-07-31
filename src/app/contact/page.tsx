"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";
import { SectionLabel } from "@/components/landing/common";
import {
  submitContactForm,
  type ContactFormData,
} from "@/actions/common/contact";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData as ContactFormData);

      if (result.success) {
        setIsSubmitted(true);
        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        // Handle validation errors
        console.error("Form submission failed:", result.message);
        alert(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-purple-100">
      {/* Single Contact Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Enhanced Background Patterns */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full -translate-y-48 translate-x-48 opacity-20 animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300 rounded-full translate-y-40 -translate-x-40 opacity-15 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-100 rounded-full -translate-y-32 -translate-x-32 opacity-10 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-400 rounded-full translate-y-24 translate-x-24 opacity-10 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Floating Elements */}
          <div
            className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-3 h-3 bg-purple-500 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-2 h-2 bg-purple-300 rounded-full opacity-25 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-1 h-1 bg-purple-600 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          ></div>

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="mb-6">
                <SectionLabel label="Contact Us" />
              </div>
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 mb-6">
                Get in <span className="text-purple-600">Touch</span>
              </h1>
              <p className="text-lg md:text-xl font-roboto text-gray-600 max-w-2xl mx-auto">
                Ready to start your next adventure? Our travel experts are here
                to help you plan the perfect trip.
              </p>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1 space-y-6"
              >
                {/* Contact Methods */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-all duration-300 group h-32 flex items-center">
                    <div className="flex items-center gap-6 w-full">
                      <div className="bg-purple-100 p-4 rounded-xl group-hover:bg-purple-200 transition-colors duration-300 flex-shrink-0">
                        <Phone
                          className="w-7 h-7 text-purple-600"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-semibold text-gray-800 text-lg mb-1">
                          Call Us
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          24/7 Support
                        </p>
                        <p className="text-purple-600 font-semibold text-lg">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-all duration-300 group h-32 flex items-center">
                    <div className="flex items-center gap-6 w-full">
                      <div className="bg-purple-100 p-4 rounded-xl group-hover:bg-purple-200 transition-colors duration-300 flex-shrink-0">
                        <Mail
                          className="w-7 h-7 text-purple-600"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-semibold text-gray-800 text-lg mb-1">
                          Email Us
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Quick Response
                        </p>
                        <p className="text-purple-600 font-semibold text-lg">
                          support@unplan.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-all duration-300 group h-32 flex items-center">
                    <div className="flex items-center gap-6 w-full">
                      <div className="bg-purple-100 p-4 rounded-xl group-hover:bg-purple-200 transition-colors duration-300 flex-shrink-0">
                        <Clock
                          className="w-7 h-7 text-purple-600"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-semibold text-gray-800 text-lg mb-1">
                          Live Chat
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Instant Help
                        </p>
                        <p className="text-green-600 font-semibold text-lg">
                          Online Now
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-all duration-300 group h-32 flex items-center">
                    <div className="flex items-center gap-6 w-full">
                      <div className="bg-purple-100 p-4 rounded-xl group-hover:bg-purple-200 transition-colors duration-300 flex-shrink-0">
                        <MapPin
                          className="w-7 h-7 text-purple-600"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-semibold text-gray-800 text-lg mb-1">
                          Visit Us
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Main Office
                        </p>
                        <p className="text-purple-600 font-semibold text-lg">
                          123 Travel Street, Adventure City
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <MessageCircle
                        className="w-6 h-6 text-purple-600"
                        strokeWidth={2}
                      />
                    </div>
                    <h2 className="text-2xl font-playfair font-bold text-gray-800">
                      Send us a Message
                    </h2>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <CheckCircle
                        className="w-16 h-16 text-green-500 mx-auto mb-4"
                        strokeWidth={2}
                      />
                      <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600">
                        Thank you for reaching out. We&apos;ll get back to you
                        within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="booking">Booking Assistance</option>
                          <option value="custom">Custom Travel Plan</option>
                          <option value="support">Customer Support</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-3 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                          placeholder="Tell us about your travel plans or questions..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" strokeWidth={2} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
