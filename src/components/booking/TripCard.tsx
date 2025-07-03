import { Users, Shield, User, Check } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

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
  // Vibrant neo-brutalist color palette
  const cardColors = useMemo(
    () => ({
      header: "bg-[#a0c4ff]", // baby blue
      included: "bg-[#caffbf]", // light green
      cancellation: "bg-[#fdffb6]", // pale yellow
      hostInfo: "bg-[#ffd6ff]", // pink lavender
      maxPeople: "bg-[#e0c6ff]", // soft lavender
      checkmark: "bg-[#8b5cf6]", // purple
      border: "border-black border-3",
      shadow: "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
      innerShadow: "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
    }),
    []
  );

  return (
    <div
      className={`${cardColors.border} rounded-xl overflow-hidden ${cardColors.shadow} bg-white max-w-md w-full mx-auto`}
    >
      {/* Image with decorative elements */}
      <div className="relative h-56 w-full border-b-3 border-black overflow-hidden">
        <div
          className={`absolute top-0 right-0 ${cardColors.maxPeople} border-l-3 border-b-3 border-black z-10 p-3 font-black text-black`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" strokeWidth={2.5} />
            <span className="text-lg">Max {maxPeople}</span>
          </div>
        </div>

        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Header */}
      <div
        className={`p-5 border-b-3 border-black ${cardColors.header} text-black`}
      >
        <h3 className="text-2xl font-black uppercase tracking-tight">
          {title}
        </h3>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-6">
        {/* What's Included Section */}
        <div
          className={`${cardColors.included} ${cardColors.border} rounded-lg p-4 ${cardColors.innerShadow}`}
        >
          <h4 className="font-black uppercase mb-3 text-xl">
            What&apos;s included
          </h4>
          <ul className="font-bold space-y-3 text-lg">
            {whatsIncluded.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className={`${cardColors.checkmark} h-6 w-6 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0 mt-0.5 text-white`}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
            {whatsIncluded.length > 4 && (
              <li className="mt-2">
                <span className="bg-white px-3 py-1.5 border-2 border-black rounded-md inline-block font-black text-base">
                  +{whatsIncluded.length - 4} more included
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Cancellation Policy */}
        <div
          className={`${cardColors.cancellation} ${cardColors.border} rounded-lg p-4 ${cardColors.innerShadow}`}
        >
          <h4 className="font-black uppercase mb-3 flex items-center gap-3 text-xl">
            <div className="bg-white p-2 rounded-md border-2 border-black">
              <Shield className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            Cancellation Policy
          </h4>
          <p className="font-bold text-base bg-white p-3 border-2 border-black rounded-md">
            {cancellationPolicy}
          </p>
        </div>

        {/* Host Info */}
        <div
          className={`${cardColors.hostInfo} ${cardColors.border} rounded-lg p-4 ${cardColors.innerShadow}`}
        >
          <h4 className="font-black uppercase mb-3 flex items-center gap-3 text-xl">
            <div className="bg-white p-2 rounded-md border-2 border-black">
              <User className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            Your Host
          </h4>
          <div className="space-y-3 font-bold">
            <p className="text-xl font-black">{hostInfo.name}</p>
            <p className="text-base bg-white inline-block px-3 py-1.5 border-2 border-black rounded-md">
              {hostInfo.experience}
            </p>
            <p className="text-base mt-3 bg-white p-4 border-2 border-black rounded-md">
              {hostInfo.description ||
                "Experienced guide ready to show you the best spots and hidden gems!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
