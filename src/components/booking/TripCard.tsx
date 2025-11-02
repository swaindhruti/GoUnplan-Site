import { Users, Shield, User, Check } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

interface TripCardProps {
  title: string;
  maxPeople: number;
  imageUrl: string;
  whatsIncluded: string[];
  cancellationPolicy: string;
  hostInfo: {
    name: string;
    experience: string;
    description: string;
  };
}

export function TripCard({
  title,
  maxPeople,
  imageUrl,
  whatsIncluded,
  cancellationPolicy,
  hostInfo,
}: TripCardProps) {
  const cardColors = useMemo(
    () => ({
      header: 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200/50',
      included: 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200/50',
      cancellation: 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200/50',
      hostInfo: 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200/50',
      maxPeople: 'bg-gradient-to-r from-purple-400 to-pink-400',
      checkmark: 'bg-gradient-to-r from-purple-600 to-pink-600',
      border: 'border border-white/60',
      shadow: 'shadow-xl hover:shadow-2xl',
      innerShadow: 'shadow-lg',
    }),
    []
  );

  return (
    <div
      className={`${cardColors.border} rounded-3xl overflow-hidden ${cardColors.shadow} bg-white/90 backdrop-blur-xl max-w-md w-full mx-auto transition-all duration-300 hover:scale-105`}
    >
      {/* Image with decorative elements */}
      <div className="relative h-56 w-full overflow-hidden">
        <div
          className={`absolute top-4 right-4 ${cardColors.maxPeople} backdrop-blur-xl border border-white/60 z-10 p-3 font-bold text-white rounded-xl shadow-lg`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" strokeWidth={2.5} />
            <span className="text-sm">Max {maxPeople}</span>
          </div>
        </div>

        <Image src={imageUrl || '/placeholder.svg'} alt={title} fill className="object-cover" />

        {/* Premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Card Header */}
      <div className={`p-6 border-b border-white/30 ${cardColors.header} text-gray-800`}>
        <h3 className="text-2xl font-bricolage font-bold tracking-tight">{title}</h3>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-6">
        {/* What's Included Section */}
        <div
          className={`${cardColors.included} ${cardColors.border} rounded-2xl p-5 ${cardColors.innerShadow} transition-all duration-300 hover:scale-105 backdrop-blur-xl`}
        >
          <h4 className="font-bold mb-4 text-xl text-gray-800">What&apos;s included</h4>
          <ul className="font-medium space-y-3 text-base">
            {whatsIncluded.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className={`${cardColors.checkmark} h-6 w-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-white shadow-lg`}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
            {whatsIncluded.length > 4 && (
              <li className="mt-3">
                <span className="backdrop-blur-xl bg-white/80 px-4 py-2 border border-white/60 rounded-xl inline-block font-semibold text-sm text-gray-700 shadow-lg">
                  +{whatsIncluded.length - 4} more included
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Cancellation Policy */}
        <div
          className={`${cardColors.cancellation} ${cardColors.border} rounded-2xl p-5 ${cardColors.innerShadow} transition-all duration-300 hover:scale-105 backdrop-blur-xl`}
        >
          <h4 className="font-bold mb-4 flex items-center gap-3 text-xl text-gray-800">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-xl shadow-lg">
              <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            Cancellation Policy
          </h4>
          <p className="font-medium text-sm backdrop-blur-xl bg-white/80 p-4 border border-white/60 rounded-xl text-gray-700 shadow-lg">
            {cancellationPolicy}
          </p>
        </div>

        {/* Host Info */}
        <div
          className={`${cardColors.hostInfo} ${cardColors.border} rounded-2xl p-5 ${cardColors.innerShadow} transition-all duration-300 hover:scale-105 backdrop-blur-xl`}
        >
          <h4 className="font-bold mb-4 flex items-center gap-3 text-xl text-gray-800">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 rounded-xl shadow-lg">
              <User className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            Your Host
          </h4>
          <div className="space-y-3 font-medium">
            <p className="text-xl font-bold text-gray-800">{hostInfo.name}</p>
            <p className="text-sm backdrop-blur-xl bg-white/80 inline-block px-4 py-2 border border-white/60 rounded-xl text-gray-700 shadow-lg">
              {hostInfo.experience}
            </p>
            <p className="text-sm mt-3 backdrop-blur-xl bg-white/80 p-4 border border-white/60 rounded-xl text-gray-700 shadow-lg">
              {hostInfo.description ||
                'Experienced guide ready to show you the best spots and hidden gems!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
