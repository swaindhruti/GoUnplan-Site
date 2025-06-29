import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, User } from "lucide-react"
import Image from "next/image"

interface TripCardProps {
  title: string
  maxPeople: number
  imageUrl: string
  whatsIncluded: string[]
  cancellationPolicy: string
  hostInfo: {
    name: string
    experience: string
    description: string
  }
}

export function TripCard({ title, maxPeople, imageUrl, whatsIncluded, cancellationPolicy, hostInfo }: TripCardProps) {
  return (
    <Card className="sticky top-4">
      <div className="relative h-48 w-full">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover rounded-t-lg" />
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Max {maxPeople} people</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">What's included</h4>
          <ul className="text-sm space-y-1">
            {whatsIncluded.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
            {whatsIncluded.length > 4 && (
              <li className="text-purple-600 text-sm">+{whatsIncluded.length - 4} more items</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Cancellation Policy
          </h4>
          <p className="text-sm text-gray-600">{cancellationPolicy}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Your Host
          </h4>
          <div className="space-y-1">
            <p className="font-medium">{hostInfo.name}</p>
            <p className="text-sm text-gray-600">{hostInfo.experience}</p>
            <p className="text-xs text-gray-500">{hostInfo.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
