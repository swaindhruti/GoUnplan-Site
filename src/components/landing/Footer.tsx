import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Globe,
  Shield,
  Users,
  Star,
  ArrowRight,
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-50 to-purple-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full shadow-md p-1">
                <Image
                  src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754613844/unplan_6_l0vcxr.png"
                  alt="GoUnplan Logo"
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-bricolage">GoUnplan</h3>
                <p className="text-sm text-purple-600 font-medium font-instrument">
                  Discover. Experience. Remember.
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 font-instrument leading-relaxed">
              Your gateway to extraordinary travel experiences. Connect with local hosts and
              discover hidden gems around the world.
            </p>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 font-instrument uppercase tracking-wide">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
                  { icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
                  { icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
                  { icon: Linkedin, href: '#', color: 'hover:bg-blue-700' },
                  { icon: Youtube, href: '#', color: 'hover:bg-red-600' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-2.5 bg-white rounded-lg shadow-sm ${social.color} hover:text-white transition-all duration-200 group`}
                  >
                    <social.icon className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 font-bricolage">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { name: 'Browse Trips', href: '/trips' },
                { name: 'My Trips', href: '/my-trips' },
                { name: 'Profile', href: '/profile' },
                { name: 'Chat', href: '/chat' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Support', href: '/support' },
                { name: 'Coming Soon', href: '/coming-soon' },
              ].map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-instrument group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* For Travelers & Hosts */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* For Travelers */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 font-bricolage mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  For Travelers
                </h4>
                <nav className="space-y-2">
                  {[
                    { name: 'Browse Trips', href: '/trips' },
                    { name: 'My Bookings', href: '/my-trips' },
                    { name: 'Trip Planning', href: '/trips' },
                    { name: 'Customer Support', href: '/support' },
                  ].map(link => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-gray-600 hover:text-purple-600 transition-colors font-instrument text-sm"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* For Hosts */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 font-bricolage mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  For Hosts
                </h4>
                <nav className="space-y-2">
                  {[
                    { name: 'Become a Host', href: '/dashboard/host' },
                    { name: 'Host Dashboard', href: '/dashboard/host' },
                    { name: 'Host Resources', href: '/support' },
                    { name: 'Host Support', href: '/support' },
                  ].map(link => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-gray-600 hover:text-purple-600 transition-colors font-instrument text-sm"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 font-bricolage mb-6">
              Get in Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-instrument text-sm">Mumbai, India</p>
                  <p className="font-instrument text-xs text-gray-500">Global Operations</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-instrument text-sm">hello@gounplan.com</p>
                  <p className="font-instrument text-xs text-gray-500">24/7 Support</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Phone className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-instrument text-sm">+91 98765 43210</p>
                  <p className="font-instrument text-xs text-gray-500">Call us anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, title: 'Secure Payments', desc: 'SSL Encrypted' },
              { icon: Users, title: '50K+ Travelers', desc: 'Happy Customers' },
              { icon: Globe, title: '100+ Destinations', desc: 'Worldwide' },
              {
                icon: Star,
                title: '4.9/5 Rating',
                desc: 'Customer Satisfaction',
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="p-3 bg-purple-100 rounded-full">
                  <item.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 font-bricolage text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 font-instrument">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-600 font-instrument text-sm">
              <span>© {currentYear} GoUnplan. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>in India</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                {
                  name: 'Privacy Policy',
                  href: 'https://drive.google.com/drive/folders/1dWzpb7yvPQYGFJnljtsBOu6wxzTdjxru?usp=sharing',
                  external: true,
                },
                {
                  name: 'Terms of Service',
                  href: 'https://drive.google.com/drive/folders/1dWzpb7yvPQYGFJnljtsBOu6wxzTdjxru?usp=sharing',
                  external: true,
                },
                {
                  name: 'Payment Policy',
                  href: 'https://drive.google.com/drive/folders/1dWzpb7yvPQYGFJnljtsBOu6wxzTdjxru?usp=sharing',
                  external: true,
                },
                {
                  name: 'Refund Policy',
                  href: 'https://drive.google.com/drive/folders/1dWzpb7yvPQYGFJnljtsBOu6wxzTdjxru?usp=sharing',
                  external: true,
                },
              ].map(link =>
                link.external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600 transition-colors font-instrument"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors font-instrument"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* Language/Currency */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button className="flex items-center gap-1 hover:text-purple-600 transition-colors font-instrument">
                <Globe className="h-4 w-4" />
                English (IN)
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
