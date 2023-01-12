import { ReactElement, useState } from "react";

export function useCheckoutStep(steps: ReactElement[]) {
  const [stepIndex, setStepIndex] = useState(0);

  const handleNext = () =>
    setStepIndex((prev) => {
      if (prev === steps.length - 1) {
        return prev;
      }
      return prev + 1;
    });

  const handleBack = () =>
    setStepIndex((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });
  const goToStep = (step: number) => setStepIndex(step);

  return {
    numSteps: steps.length,
    stepIndex,
    handleNext,
    handleBack,
    goToStep,
    currentStep: steps[stepIndex],
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === steps.length - 1,
  };
}
