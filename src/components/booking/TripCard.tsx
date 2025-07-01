import { Users, Shield, User } from "lucide-react";
import Image from "next/image";

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
  // Function to get random color from a set of neobrutalist colors
  const getRandomBgColor = () => {
    const colors = [
      "bg-yellow-300",
      "bg-pink-400",
      "bg-blue-400",
      "bg-green-500",
      "bg-orange-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="border-3 border-black rounded-xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] bg-white">
      {/* Image with decorative elements */}
      <div className="relative h-48 w-full border-b-3 border-black overflow-hidden">
        <div className="absolute top-0 right-0 bg-yellow-300 border-l-3 border-b-3 border-black z-10 p-2 font-black text-black">
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5" strokeWidth={2.5} />
            <span>Max {maxPeople}</span>
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
      <div className="p-4 border-b-3 border-black bg-purple-600 text-white">
        <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-5">
        {/* What's Included Section */}
        <div
          className={`${getRandomBgColor()} border-3 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
        >
          <h4 className="font-black uppercase mb-2">What&apos;s included</h4>
          <ul className="font-bold space-y-2">
            {whatsIncluded.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-white h-5 w-5 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
            {whatsIncluded.length > 4 && (
              <li className="mt-1 bg-white px-2 py-1 border-2 border-black rounded-md inline-block font-black">
                +{whatsIncluded.length - 4} more
              </li>
            )}
          </ul>
        </div>

        {/* Cancellation Policy */}
        <div className="border-3 border-black rounded-lg p-3 bg-white">
          <h4 className="font-black uppercase mb-2 flex items-center gap-2">
            <div className="bg-blue-400 p-1.5 rounded-md border-2 border-black">
              <Shield className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            Cancellation Policy
          </h4>
          <p className="font-bold text-sm">{cancellationPolicy}</p>
        </div>

        {/* Host Info */}
        <div className="border-3 border-black rounded-lg p-3 bg-pink-400">
          <h4 className="font-black uppercase mb-2 flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-md border-2 border-black">
              <User className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            Your Host
          </h4>
          <div className="space-y-1 font-bold">
            <p className="text-lg">{hostInfo.name}</p>
            <p className="text-sm bg-white inline-block px-2 py-0.5 border-2 border-black rounded-md">
              {hostInfo.experience}
            </p>
            <p className="text-sm mt-2 bg-white p-2 border-2 border-black rounded-md">
              {hostInfo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
