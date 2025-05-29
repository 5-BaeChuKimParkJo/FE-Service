# Whale Transition Component System

재사용 가능하고 완전히 커스터마이징 가능한 고래 애니메이션 시스템입니다.

## 🐋 특징

- **모듈화된 컴포넌트**: 각 기능을 독립적으로 사용 가능
- **완전한 커스터마이징**: 색상, 크기, 속도, 텍스트 등 모든 요소 조정 가능
- **TypeScript 지원**: 완전한 타입 안전성
- **Framer Motion 기반**: 부드럽고 자연스러운 애니메이션
- **접근성 고려**: 적절한 ARIA 속성과 키보드 지원

## 📦 설치 및 사용

### 기본 사용법

```tsx
import { WhaleTransition } from '@/components/animations/whale-transition';

function MyPage() {
  const [showTransition, setShowTransition] = useState(false);

  return (
    <>
      <button onClick={() => setShowTransition(true)}>
        고래와 함께 이동! 🐋
      </button>

      <WhaleTransition
        isActive={showTransition}
        onComplete={() => {
          setShowTransition(false);
          // 페이지 이동 등 추가 로직
        }}
      />
    </>
  );
}
```

### 커스터마이징된 사용법

```tsx
<WhaleTransition
  isActive={isActive}
  onComplete={handleComplete}
  title='🌊 바다로 떠나는 여행'
  subtitle='찰낙찰낙과 함께하는 모험'
  whaleSize='lg'
  animationSpeed='slow'
  colorTheme='ocean'
  pausePosition={0.7}
  exitDirection='up'
  showBackground={true}
  showWaves={true}
  showBubbles={true}
  showText={true}
/>
```

### 커스텀 색상 테마

```tsx
<WhaleTransition
  isActive={isActive}
  onComplete={handleComplete}
  colorTheme='custom'
  customColors={{
    primary: 'rgba(168, 85, 247, 0.3)', // purple
    secondary: 'rgba(139, 69, 19, 0.2)', // brown
    accent: 'rgba(245, 158, 11, 0.3)', // amber
    whale: 'text-purple-500',
    bubbles: 'bg-amber-200/50',
    text: 'text-purple-100',
    subtext: 'text-amber-200',
  }}
/>
```

## 🧩 개별 컴포넌트 사용

더 세밀한 제어가 필요한 경우 개별 컴포넌트를 조합할 수 있습니다:

```tsx
import {
  SwimmingWhale,
  BubbleTrail,
  OceanBackground,
  WaveEffect,
} from '@/components/animations/whale-transition';

function CustomTransition() {
  return (
    <div className='relative'>
      <OceanBackground colorTheme='ocean' />
      <WaveEffect intensity='high' speed='fast' />
      <SwimmingWhale variants={customVariants} size='lg' />
      <BubbleTrail count={12} size='lg' color='bg-cyan-300/60' />
    </div>
  );
}
```

## ⚙️ Props API

### WhaleTransitionProps

| Prop             | Type                                  | Default                           | Description                   |
| ---------------- | ------------------------------------- | --------------------------------- | ----------------------------- |
| `isActive`       | `boolean`                             | -                                 | 애니메이션 활성화 여부 (필수) |
| `onComplete`     | `() => void`                          | -                                 | 애니메이션 완료 콜백          |
| `title`          | `string`                              | "🐋 헤엄쳐서 이동 중..."          | 메인 텍스트                   |
| `subtitle`       | `string`                              | "찰날찰낙 파도처럼 쏟아지는 경매" | 서브 텍스트                   |
| `whaleSize`      | `'sm' \| 'md' \| 'lg'`                | `'md'`                            | 고래 크기                     |
| `animationSpeed` | `'slow' \| 'normal' \| 'fast'`        | `'normal'`                        | 애니메이션 속도               |
| `colorTheme`     | `'blue' \| 'ocean' \| 'custom'`       | `'blue'`                          | 색상 테마                     |
| `showBackground` | `boolean`                             | `true`                            | 배경 그라데이션 표시          |
| `showWaves`      | `boolean`                             | `true`                            | 파도 애니메이션 표시          |
| `showBubbles`    | `boolean`                             | `true`                            | 기포 효과 표시                |
| `showText`       | `boolean`                             | `true`                            | 텍스트 표시                   |
| `pausePosition`  | `number`                              | `0.8`                             | 고래가 멈추는 위치 (0-1)      |
| `exitDirection`  | `'right' \| 'left' \| 'up' \| 'down'` | `'right'`                         | 고래 퇴장 방향                |
| `customColors`   | `CustomColors`                        | -                                 | 커스텀 색상 설정              |

### 사용 사례

#### 1. 로딩 화면

```tsx
<WhaleTransition
  isActive={isLoading}
  title='🐋 데이터를 불러오는 중...'
  subtitle='잠시만 기다려주세요'
  showBubbles={false}
  animationSpeed='slow'
/>
```

#### 2. 페이지 전환

```tsx
<WhaleTransition
  isActive={isTransitioning}
  title='🌊 다음 페이지로 이동'
  exitDirection='right'
  onComplete={() => router.push('/next-page')}
/>
```

#### 3. 성공 메시지

```tsx
<WhaleTransition
  isActive={showSuccess}
  title='🎉 성공!'
  subtitle='고래가 축하해드려요'
  colorTheme='ocean'
  whaleSize='lg'
  pausePosition={0.5}
  exitDirection='up'
/>
```

## 🎨 미리 정의된 테마

### Blue Theme (기본)

- 클래식한 파란색 바다 테마
- 신뢰감과 안정감을 주는 색상

### Ocean Theme

- 시원한 cyan 계열 바다 테마
- 더 역동적이고 상쾌한 느낌

### Custom Theme

- `customColors` prop으로 완전 커스터마이징
- 브랜드에 맞는 색상 적용 가능

## 🚀 성능 최적화

- 애니메이션이 비활성화된 상태에서는 렌더링되지 않음
- Framer Motion의 최적화된 애니메이션 엔진 사용
- 필요한 요소만 선택적으로 렌더링 가능

## 💡 팁

1. **모바일 최적화**: `whaleSize="sm"`과 `animationSpeed="fast"` 사용
2. **로딩 지연**: `pausePosition`을 조정하여 로딩 시간에 맞춤
3. **브랜드 일치**: `customColors`로 브랜드 색상 적용
4. **접근성**: 텍스트는 항상 명확하게 읽을 수 있도록 설정

## 🔄 마이그레이션 가이드

기존 `WhaleTransition` 사용자를 위한 호환성이 유지됩니다:

```tsx
// 기존 코드 (그대로 작동)
import { WhaleTransition } from '@/components/animations/WhaleTransition';

// 새로운 모듈화된 버전 (권장)
import { WhaleTransition } from '@/components/animations/whale-transition';
```
