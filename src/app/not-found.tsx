import { BottomNavigation, SubHeader } from '@/components/layouts';
import ErrorText from '@/components/ui/error-text';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-10'>
      <SubHeader />

      <ErrorText
        baseIntensity={0.2}
        enableHover={true}
        color='#5d5fef'
        fontSize='8rem'
      >
        404
      </ErrorText>
      <ErrorText
        baseIntensity={0.2}
        enableHover={true}
        color='#5d5fef'
        fontSize='3rem'
      >
        Not Found
      </ErrorText>
      <ErrorText
        baseIntensity={0.2}
        enableHover={true}
        color='#5d5fef'
        fontSize='1.5rem'
      >
        페이지를 찾을 수 없습니다.
      </ErrorText>
      <BottomNavigation />
    </div>
  );
}
