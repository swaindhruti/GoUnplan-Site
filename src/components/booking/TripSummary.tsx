import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Clock } from "lucide-react"

interface TripSummaryProps {
  startDate: string
  endDate: string
  duration: string
  location: string
}

export function TripSummary({ startDate, endDate, duration, location }: TripSummaryProps) {
  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Trip Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
