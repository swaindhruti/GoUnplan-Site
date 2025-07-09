import { Check } from "lucide-react";
import { FindPackagesButton, SectionLabel } from "./common";

export default function AboutUs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white min-h-screen flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752080697/16304260_travel5_xedcst.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 mx-auto max-w-4xl w-full px-6 py-16 flex flex-col items-center justify-center">
        <SectionLabel label="About Us" />

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-extrabold text-white leading-tight text-center mt-6">
          Your Journey, <span className="text-purple-300">Our Passion</span>
        </h2>

        <p className="text-base md:text-lg font-roboto text-white/90 leading-relaxed text-center mt-6">
          GoUnplan isn’t just a travel company — it’s a movement to make travel
          more personal, inspiring, and meaningful. We help turn your travel
          dreams into reality by blending expert planning with the freedom to
          explore. Whether you’re a solo backpacker, a couple seeking romance,
          or a family in search of adventure, we’re here to craft journeys that
          resonate with your unique style.
          <br className="hidden sm:block" />
          <span className="block mt-4">
            From spontaneous weekend getaways to immersive cultural expeditions,
            we believe travel should go beyond checklists. Our team brings years
            of experience, insider access, and local knowledge to design every
            itinerary with care. We don’t just book trips — we design
            experiences that leave you with stories worth telling.
          </span>
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            "Budget-Friendly",
            "Luxurious Getaways",
            "Trusted Local Guides"
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm"
            >
              <Check className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-800">{item}</span>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <FindPackagesButton label="Find Packages" />
        </div>
      </div>
    </section>
  );
}
