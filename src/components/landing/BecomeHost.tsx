import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Become a Host — GoUnplan',
  description:
    'Earn while you travel. Share your local stories, set your own dates & price, get verified and earn whenever a traveler joins.',
};

export default function BecomeAHostPage() {
  return (
    <main className="min-h-screen bg-purple-50">
      <div className="">
        <div className="bg-white  overflow-hidden">
          <div className="grid grid-cols-1 h-screen lg:grid-cols-2">
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 backdrop-blur-sm rounded-full text-purple-600 text-xs sm:text-sm font-bold mb-6 border border-white/40 drop-shadow-lg">
                  BECOME A HOST
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bricolage font-semibold text-gray-900 leading-tight mb-4">
                  Earn While You Travel.
                </h1>

                <p className="font-roboto text text-gray-700 text-base sm:text-lg mb-6">
                  Join hundreds of explorers designing unforgettable trips. Share your local
                  stories, bring people together, and earn every time someone joins your experience.
                </p>

                {/* Bullet list */}
                <ul className="space-y-3 mb-8">
                  <li className="flex gap-3">
                    <Image
                      src="https://ik.imagekit.io/bkt3emitco/5395ee6d3c930e2d9bdda711a3fbf785.jpg"
                      height={20}
                      width={20}
                      alt="bullet point"
                    />
                    <div className="font-roboto  text-gray-700">
                      Share your local stories and secret trails.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Image
                      src="https://ik.imagekit.io/bkt3emitco/5395ee6d3c930e2d9bdda711a3fbf785.jpg"
                      height={20}
                      width={20}
                      alt="bullet point"
                    />
                    <div className="font-roboto  text-gray-700">
                      Set your own dates, group size, and price.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Image
                      src="https://ik.imagekit.io/bkt3emitco/5395ee6d3c930e2d9bdda711a3fbf785.jpg"
                      height={20}
                      width={20}
                      alt="bullet point"
                    />
                    <div className="font-roboto  text-gray-700">
                      Get verified and listed on our platform.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Image
                      src="https://ik.imagekit.io/bkt3emitco/5395ee6d3c930e2d9bdda711a3fbf785.jpg"
                      height={20}
                      width={20}
                      alt="bullet point"
                    />
                    <div className="font-roboto  text-gray-700">
                      Earn every time a traveler joins your trip.
                    </div>
                  </li>
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-4">
                  <Link
                    href="dashboard/host"
                    className="inline-flex items-center justify-center rounded-full bg-purple-600 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-purple-700 transition"
                  >
                    Apply to Host
                  </Link>

                  <Link
                    href="/host/learn-more"
                    className="text-sm text-gray-600 underline hover:text-gray-800 transition"
                  >
                    Learn how hosting works
                  </Link>
                </div>
                <div className="mt-8 text-sm text-gray-600">
                  <strong>Quick facts:</strong> We'll help you with promotion, payments, and
                  traveler support — you focus on the experience.
                </div>
              </div>
            </div>
            <div className="relative h-80 lg:h-full">
              <Image
                src="https://ik.imagekit.io/bkt3emitco/54cb9076b606a0fcbe69ca3da56ff640.jpg"
                alt="Smiling host leading a group"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
