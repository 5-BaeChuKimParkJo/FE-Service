import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type StepperState = {
  currentStep: number;
  isSubmitting: boolean;
};

export type StepperActions = {
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
};

const initialState: StepperState = {
  currentStep: 1,
  isSubmitting: false,
};

export const useStepperStore = create<StepperState & StepperActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

      reset: () => set(initialState),
    }),
    {
      name: 'stepper-store',
    },
  ),
);
