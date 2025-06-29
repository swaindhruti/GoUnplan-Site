import { Check } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Select Dates" },
    { number: 2, title: "Guest Details" },
    { number: 3, title: "Payment" },
  ]

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                step.number < currentStep
                  ? "bg-green-500 text-white"
                  : step.number === currentStep
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${step.number <= currentStep ? "text-gray-900" : "text-gray-500"}`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${step.number < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
