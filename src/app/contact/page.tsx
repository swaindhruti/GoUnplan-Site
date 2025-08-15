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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  Contact Support
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                Get in <span className="text-purple-600">Touch</span>
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                Ready to start your next adventure? Our travel experts are here to help you plan the perfect trip.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-4 rounded-full">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-full">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bricolage font-semibold text-gray-900 text-base mb-1">
                      Call Us
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 font-instrument">
                      24/7 Support
                    </p>
                    <p className="text-purple-600 font-semibold text-base font-instrument">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-full">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bricolage font-semibold text-gray-900 text-base mb-1">
                      Email Us
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 font-instrument">
                      Quick Response
                    </p>
                    <p className="text-green-600 font-semibold text-base font-instrument">
                      support@unplan.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bricolage font-semibold text-gray-900 text-base mb-1">
                      Live Chat
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 font-instrument">
                      Instant Help
                    </p>
                    <p className="text-emerald-600 font-semibold text-base font-instrument">
                      Online Now
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-full">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bricolage font-semibold text-gray-900 text-base mb-1">
                      Visit Us
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 font-instrument">
                      Main Office
                    </p>
                    <p className="text-amber-600 font-semibold text-base font-instrument">
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 font-bricolage">
                  Send us a Message
                </h2>
              </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={2} />
                      </div>
                      <h3 className="text-2xl font-bricolage font-bold text-gray-900 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 font-instrument">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700 mb-2 font-instrument"
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
                            className="w-full h-11 px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-purple-100 focus:ring-2 transition-all duration-200 font-instrument"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2 font-instrument"
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
                            className="w-full h-11 px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-purple-100 focus:ring-2 transition-all duration-200 font-instrument"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-semibold text-gray-700 mb-2 font-instrument"
                        >
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full h-11 px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-purple-100 focus:ring-2 transition-all duration-200 font-instrument"
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
                          className="block text-sm font-semibold text-gray-700 mb-2 font-instrument"
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
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-purple-100 focus:ring-2 transition-all duration-200 resize-none font-instrument"
                          placeholder="Tell us about your travel plans or questions..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-instrument flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Sending Message...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="w-4 h-4" strokeWidth={2} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
