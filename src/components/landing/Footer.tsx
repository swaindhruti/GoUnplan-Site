import Image from "next/image";

export const Footer = () => (
  <footer className="w-full bg-white ">
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
      {/* Logo Only */}
      <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-6 md:mb-0">
        <div className="bg-white rounded-full shadow-lg ">
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754613844/unplan_6_l0vcxr.png"
            alt="GoUnplan Logo"
            width={90}
            height={90}
            className="rounded-full object-cover"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 w-full md:w-auto">
        <a
          href="#about"
          className="font-instrument text-gray-700 hover:text-purple-700 transition font-medium text-base md:text-lg"
        >
          About Us
        </a>
        <a
          href="#destinations"
          className="font-instrument text-gray-700 hover:text-purple-700 transition font-medium text-base md:text-lg"
        >
          Destinations
        </a>
        <a
          href="#hosts"
          className="font-instrument text-gray-700 hover:text-purple-700 transition font-medium text-base md:text-lg"
        >
          Hosts
        </a>
        <a
          href="#contact"
          className="font-instrument text-gray-700 hover:text-purple-700 transition font-medium text-base md:text-lg"
        >
          Contact
        </a>
      </nav>
    </div>
    <div className="text-center text-xs md:text-sm text-gray-400 font-instrument py-4 border-t border-purple-100 bg-white">
      © {new Date().getFullYear()} GoUnplan. All rights reserved.
    </div>
  </footer>
);
