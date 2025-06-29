import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Select Dates" },
    { number: 2, title: "Guest Details" },
    { number: 3, title: "Payment" }
  ];
  console.log(totalSteps);
  return (
    <div className="flex flex-col items-center justify-center space-y-6 mb-10">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center transition-all duration-300">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-md transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                    : isActive
                    ? "bg-gradient-to-br from-purple-500 to-purple-700 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={`ml-3 text-base transition-colors duration-300 ${
                  isCompleted || isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
