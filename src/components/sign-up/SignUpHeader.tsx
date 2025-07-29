import { useRouter } from 'next/navigation';
import { useRegisterStore } from '@/stores/use-register-store';
import Back from '@/assets/icons/common/back.svg';

export function SignUpHeader() {
  const router = useRouter();
  const { currentStep, setCurrentStep } = useRegisterStore();

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <button
        onClick={handleBack}
        className='absolute top-3 left-3'
        aria-label='뒤로 가기'
      >
        <Back />
      </button>
      <h1 className='text-2xl font-bold mt-10 mb-10 text-center'>SIGN UP</h1>
    </>
  );
}
