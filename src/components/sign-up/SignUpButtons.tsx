import { Button } from '@/components/ui/button';
import { useRegisterStore } from '@/stores/use-register-store';
import { useRegistration } from '@/hooks/use-registration';

export function SignUpButtons() {
  const { currentStep, stepTwoValid, isSubmitting, interests } =
    useRegisterStore();
  const { handleNext, handleComplete, handleSkip } = useRegistration();

  switch (currentStep) {
    case 0:
      return null;
    case 1:
      return (
        <Button
          className='w-full'
          size='xl'
          onClick={handleNext}
          disabled={!stepTwoValid || isSubmitting}
        >
          {isSubmitting ? 'loading' : 'NEXT'}
        </Button>
      );
    case 2:
      return (
        <div className='flex flex-col gap-2'>
          <Button
            className='w-full'
            size='xl'
            onClick={handleComplete}
            disabled={interests.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'SIGN UP'}
          </Button>
          <Button
            variant='ghost'
            className='w-full'
            size='xl'
            onClick={handleSkip}
          >
            건너뛰고 가입
          </Button>
        </div>
      );
    default:
      return null;
  }
}
