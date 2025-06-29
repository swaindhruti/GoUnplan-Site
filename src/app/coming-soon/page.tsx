"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Globe, MapPin, Calendar, Star } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Redirect to coming-soon page when this page is loaded
  useEffect(() => {
    router.replace("/coming-soon");
  }, [router]);

  // The rest of your component will only be rendered if the redirect doesn't happen immediately
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-purple-700">Unplan</div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a
              href="#destinations"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Destinations
            </a>
            <a
              href="#experiences"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Experiences
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              About Us
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-16 md:py-20 lg:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Travel without boundaries
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-xl">
                Discover spontaneous adventures tailored to your style.
                Experience authentic journeys crafted by local hosts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-6 text-lg">
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/host">
                  <Button
                    variant="outline"
                    className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50 px-8 py-6 text-lg"
                  >
                    Become a Host
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Travel adventure"
                    height={400}
                    width={600}
                    className="rounded-lg w-full object-cover h-80 md:h-96"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100 hidden md:block">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Trusted by 10,000+
                      </p>
                      <p className="text-xs text-gray-600">
                        Happy travelers worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Unplan?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The perfect blend of spontaneity and careful planning for
              unforgettable travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Unique Destinations
              </h3>
              <p className="text-gray-600">
                Discover hidden gems and extraordinary places you won&apos;t
                find in typical travel guides.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Local Expertise
              </h3>
              <p className="text-gray-600">
                Connect with passionate local hosts who share authentic
                experiences and insider knowledge.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Flexible Planning
              </h3>
              <p className="text-gray-600">
                Enjoy the freedom to customize your journey while having the
                security of experienced guides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start your adventure?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers discovering the world in a new way with
            Unplan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Create Account
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                className="text-white border-white bg-purple-600 px-8 py-6 text-lg"
              >
                Explore Trips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-purple-700 mb-4">
                Unplan
              </h3>
              <p className="text-gray-600">
                Travel with vibe. Discover authentic experiences crafted by
                locals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2024 Unplan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
