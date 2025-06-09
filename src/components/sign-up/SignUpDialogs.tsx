import { WelcomeDialog } from '@/components/dialogs/WelcomeDialog';
import { WhaleTransition } from '@/components/animations/WhaleTransition';
import { useRegistration } from '@/hooks/use-registration';
import { useRegisterStore } from '@/stores/use-register-store';

export function SignUpDialogs() {
  const { nickname } = useRegisterStore();
  const {
    showWelcomeDialog,
    showWhaleTransition,
    handleCloseWelcomeDialog,
    handleGoToLogin,
    handleWhaleTransitionComplete,
  } = useRegistration();

  return (
    <>
      <WelcomeDialog
        isOpen={showWelcomeDialog}
        onClose={handleCloseWelcomeDialog}
        onGoToLogin={handleGoToLogin}
        userName={nickname}
      />

      <WhaleTransition
        isActive={showWhaleTransition}
        onComplete={handleWhaleTransitionComplete}
      />
    </>
  );
}
