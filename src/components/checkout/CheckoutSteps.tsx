import { CheckCircle2, Truck, CreditCard, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/app/(shop)/checkout/page";

interface Step {
  id: CheckoutStep;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmation", label: "Confirm", icon: Package },
];

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  isDone &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent &&
                    "border-primary bg-primary/10 text-primary",
                  isUpcoming &&
                    "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-1.5 font-medium",
                  (isDone || isCurrent) ? "text-foreground" : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-16 sm:w-24 mx-2 transition-colors mb-4",
                  index < currentIndex ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
