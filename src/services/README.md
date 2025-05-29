# Services Pattern in chalnack

React/Next.js 애플리케이션에서 복잡한 비즈니스 로직을 관리하기 위한 서비스 패턴 구현

## 🎯 왜 Service Pattern을 도입했나?

### 기존 Custom Hook의 한계

```tsx
// ❌ 기존: 복잡한 비즈니스 로직이 훅에 섞여있음
export function useRegistration() {
  const router = useRouter();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const userData = useRegisterStore.getState();
      await registerUser({ ...userData, interests: userData.interests });
      setShowWelcomeDialog(true);
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... 더 많은 복잡한 로직들
}
```

### Service Pattern의 장점

```tsx
// ✅ 새로운: 비즈니스 로직은 서비스에, UI 로직은 훅에
export function useRegistration() {
  const registrationService = useMemo(
    () =>
      createRegistrationService({
        router,
        setShowWelcomeDialog,
        setShowWhaleTransition,
        setIsSubmitting,
      }),
    [router, setIsSubmitting],
  );

  const handleComplete = () => registrationService.complete();
  // 훨씬 간단하고 명확!
}
```

## 🏗️ 아키텍처

### 폴더 구조

```
src/
├── services/           # 비즈니스 로직 (Service Pattern)
│   ├── registration.service.ts
│   ├── user-info.service.ts
│   └── index.ts
├── hooks/             # UI 상태 관리 (Custom Hooks)
│   ├── use-registration.ts
│   ├── use-user-info-form.ts
│   ├── use-login-form.ts    # 단순한 로직은 훅 유지
│   └── use-step-animation.ts # 재사용 가능한 로직은 훅 유지
```

### 역할 분담

| 구분         | Custom Hook                       | Service                              |
| ------------ | --------------------------------- | ------------------------------------ |
| **목적**     | UI 상태 관리                      | 비즈니스 로직                        |
| **의존성**   | React 훅 (useState, useRouter 등) | 순수 함수/클래스                     |
| **테스트**   | React Testing Library 필요        | 단위 테스트 쉬움                     |
| **재사용성** | 컴포넌트 간 재사용                | 프로젝트 전반 재사용                 |
| **관심사**   | 사용자 인터랙션, 상태 변화        | 데이터 검증, API 호출, 비즈니스 규칙 |

## 📝 구현 예시

### 1. RegistrationService

```tsx
export class RegistrationService {
  constructor(private deps: RegistrationServiceDependencies) {}

  async complete() {
    this.deps.setIsSubmitting(true);
    try {
      const userData = useRegisterStore.getState();
      await registerUser({ ...userData, interests: userData.interests });
      this.deps.setShowWelcomeDialog(true);
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      throw error; // 상위에서 에러 처리
    } finally {
      this.deps.setIsSubmitting(false);
    }
  }

  startGoToLogin() {
    this.deps.setShowWelcomeDialog(false);
    this.deps.setShowWhaleTransition(true);
  }
}
```

**장점:**

- ✅ **의존성 주입**: 테스트 시 mock 주입 쉬움
- ✅ **에러 처리**: 상위로 throw해서 UI에서 적절히 처리
- ✅ **단일 책임**: 회원가입 프로세스에만 집중
- ✅ **확장성**: 새로운 회원가입 단계 추가 용이

### 2. UserInfoService

```tsx
export class UserInfoService {
  async validateAndCheckUserId(
    userId: string,
  ): Promise<{ isValid: boolean; error: string }> {
    const validationError = validateUserId(userId);
    if (validationError) {
      this.deps.setIsUserIdVerified(false);
      return { isValid: false, error: validationError };
    }

    if (userId.length < 4) {
      return { isValid: true, error: '' };
    }

    try {
      this.deps.setIsCheckingUserId(true);
      const isAvailable = await checkUserIdAvailability(userId);
      this.deps.setIsUserIdVerified(isAvailable);
      return {
        isValid: isAvailable,
        error: isAvailable ? '' : '이미 사용 중인 아이디입니다.',
      };
    } catch (error) {
      return { isValid: false, error: '아이디 확인 중 오류가 발생했습니다.' };
    } finally {
      this.deps.setIsCheckingUserId(false);
    }
  }
}
```

**장점:**

- ✅ **명확한 반환값**: `{isValid, error}` 형태로 결과 명확
- ✅ **에러 로깅**: 서비스 레벨에서 에러 상세 로깅
- ✅ **비동기 처리**: Promise 기반으로 async 로직 깔끔하게 처리
- ✅ **검증 로직 집중**: 유효성 검사와 중복 체크 한 곳에서 관리

## 🔄 훅과 서비스 연동

```tsx
export function useUserInfoForm() {
  const [userIdError, setUserIdError] = useState('');
  // ... 다른 UI 상태들

  const userInfoService = useMemo(
    () =>
      createUserInfoService({
        setUserId,
        setNickname,
        setUserIdError, // ... 의존성 주입
      }),
    [setUserId, setNickname],
  );

  const debouncedCheckUserId = useRef(
    createDebounce(async (value: string) => {
      const result = await userInfoService.validateAndCheckUserId(value);
      setUserIdError(result.error); // 서비스 결과를 UI에 반영
    }, 1000),
  ).current;

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const shouldCheckDuplicate = userInfoService.handleUserIdChange(value);

    if (shouldCheckDuplicate) {
      debouncedCheckUserId(value); // 디바운스는 UI 관심사
    }
  };
}
```

## 📊 Before vs After 비교

### 코드 복잡도

```
Before (Custom Hook Only):
- use-registration.ts: 108줄 (비즈니스 + UI 로직 혼재)
- use-user-info-form.ts: 98줄 (검증 + API + UI 로직 혼재)

After (Service + Hook):
- registration.service.ts: 75줄 (순수 비즈니스 로직)
- use-registration.ts: 54줄 (UI 상태 관리만)
- user-info.service.ts: 95줄 (검증 + API 로직)
- use-user-info-form.ts: 65줄 (UI 인터랙션만)
```

### 테스트 용이성

```tsx
// ❌ Before: React 환경 필요
import { renderHook } from '@testing-library/react';
const { result } = renderHook(() => useRegistration());

// ✅ After: 순수 함수 테스트
const service = new RegistrationService(mockDeps);
await service.complete();
expect(mockDeps.setShowWelcomeDialog).toHaveBeenCalledWith(true);
```

## 🎯 언제 Service Pattern을 사용할까?

### ✅ Service Pattern 추천

- 복잡한 비즈니스 로직 (검증, API 호출, 데이터 변환)
- 여러 단계의 프로세스 (회원가입, 결제, 주문)
- 에러 처리가 중요한 로직
- 테스트가 중요한 핵심 기능

### ✅ Custom Hook 유지

- 단순한 폼 상태 관리 (`use-login-form`)
- 재사용 가능한 UI 로직 (`use-step-animation`)
- React 훅에 의존적인 로직 (useEffect, useState 위주)

## 🚀 마이그레이션 가이드

1. **기존 훅 분석**: 비즈니스 로직과 UI 로직 구분
2. **서비스 클래스 생성**: 비즈니스 로직을 서비스로 이동
3. **의존성 인터페이스 정의**: 테스트와 확장성을 위해
4. **팩토리 함수 생성**: 훅에서 쉽게 사용할 수 있도록
5. **훅 단순화**: UI 상태 관리와 서비스 호출만 남김

## 💡 Best Practices

- **단일 책임 원칙**: 하나의 서비스는 하나의 비즈니스 도메인
- **의존성 주입**: 생성자나 팩토리 함수로 의존성 주입
- **에러 처리**: 서비스에서 throw, 훅에서 catch
- **타입 안전성**: TypeScript 인터페이스로 의존성 명시
- **테스트 가능성**: Mock 주입이 쉬운 구조로 설계
