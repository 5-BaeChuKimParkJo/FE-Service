import { useRegisterStore } from '@/stores/use-register-store';
import { registerUser } from '@/actions/auth-service/register';

export interface RegistrationServiceDependencies {
  router: {
    replace: (path: string) => void;
  };
  setShowWelcomeDialog: (show: boolean) => void;
  setShowWhaleTransition: (show: boolean) => void;
  setIsSubmitting: (loading: boolean) => void;
}

export class RegistrationService {
  constructor(private deps: RegistrationServiceDependencies) {}

  async complete() {
    this.deps.setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      await registerUser({
        userId: userData.userId,
        phoneNumber: userData.phoneNumber,
        nickname: userData.nickname,
        password: userData.password,
      });

      this.deps.setShowWelcomeDialog(true);
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      // 사용자에게 에러 알림
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      this.deps.setIsSubmitting(false);
    }
  }

  async skip() {
    this.deps.setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      await registerUser({
        userId: userData.userId,
        phoneNumber: userData.phoneNumber,
        nickname: userData.nickname,
        password: userData.password,
      });

      this.deps.setShowWelcomeDialog(true);
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      // 사용자에게 에러 알림
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      this.deps.setIsSubmitting(false);
    }
  }

  closeWelcomeDialog() {
    this.deps.setShowWelcomeDialog(false);
  }

  startGoToLogin() {
    this.deps.setShowWelcomeDialog(false);
    this.deps.setShowWhaleTransition(true);
  }

  completeWhaleTransition() {
    this.deps.setShowWhaleTransition(false);
    this.deps.router.replace('/sign-in');
  }
}

// 팩토리 함수
export function createRegistrationService(
  deps: RegistrationServiceDependencies,
) {
  return new RegistrationService(deps);
}
