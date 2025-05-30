// 'use client';

// import { useState } from 'react';
// import {
//   WhaleTransition,
//   SwimmingWhale,
//   BubbleTrail,
//   OceanBackground,
//   WaveEffect,
// } from './index';

// // 기본 사용 예시
// export function BasicExample() {
//   const [showTransition, setShowTransition] = useState(false);

//   return (
//     <div className='p-4'>
//       <button
//         onClick={() => setShowTransition(true)}
//         className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
//       >
//         기본 고래 애니메이션 시작! 🐋
//       </button>

//       <WhaleTransition
//         isActive={showTransition}
//         onComplete={() => setShowTransition(false)}
//       />
//     </div>
//   );
// }

// // 커스터마이징 예시
// export function CustomizedExample() {
//   const [showTransition, setShowTransition] = useState(false);

//   return (
//     <div className='p-4'>
//       <button
//         onClick={() => setShowTransition(true)}
//         className='px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600'
//       >
//         커스텀 오션 테마! 🌊
//       </button>

//       <WhaleTransition
//         isActive={showTransition}
//         onComplete={() => setShowTransition(false)}
//         title='🌊 바다로 떠나는 여행'
//         subtitle='찰낙찰낙과 함께하는 모험'
//         whaleSize='lg'
//         animationSpeed='slow'
//         colorTheme='ocean'
//         pausePosition={0.6}
//         exitDirection='up'
//       />
//     </div>
//   );
// }

// // 커스텀 색상 예시
// export function CustomColorExample() {
//   const [showTransition, setShowTransition] = useState(false);

//   return (
//     <div className='p-4'>
//       <button
//         onClick={() => setShowTransition(true)}
//         className='px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600'
//       >
//         보라색 테마! 💜
//       </button>

//       <WhaleTransition
//         isActive={showTransition}
//         onComplete={() => setShowTransition(false)}
//         title='🌌 우주 바다로 떠나기'
//         subtitle='신비로운 여행이 시작됩니다'
//         colorTheme='custom'
//         customColors={{
//           primary: 'rgba(168, 85, 247, 0.3)',
//           secondary: 'rgba(139, 69, 19, 0.2)',
//           accent: 'rgba(245, 158, 11, 0.3)',
//           //   whale: 'text-purple-500',
//           //   bubbles: 'bg-purple-200/50',
//           //   text: 'text-purple-100',
//           //   subtext: 'text-amber-200',
//         }}
//       />
//     </div>
//   );
// }

// // 로딩 화면 예시
// export function LoadingExample() {
//   const [isLoading, setIsLoading] = useState(false);

//   const simulateLoading = () => {
//     setIsLoading(true);
//     setTimeout(() => setIsLoading(false), 5000); // 5초 후 로딩 완료
//   };

//   return (
//     <div className='p-4'>
//       <button
//         onClick={simulateLoading}
//         className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
//         disabled={isLoading}
//       >
//         {isLoading ? '로딩 중...' : '로딩 시뮬레이션 시작'}
//       </button>

//       <WhaleTransition
//         isActive={isLoading}
//         title='🐋 데이터를 불러오는 중...'
//         subtitle='바다 깊은 곳에서 정보를 가져오고 있어요'
//         showBubbles={false}
//         animationSpeed='slow'
//         pausePosition={0.5}
//         onComplete={() => setIsLoading(false)}
//       />
//     </div>
//   );
// }

// // 개별 컴포넌트 조합 예시
// export function CustomCompositionExample() {
//   const [showComponents, setShowComponents] = useState(false);

//   const customWhaleVariants = {
//     hidden: { x: -200, opacity: 0, scale: 0.8 },
//     visible: {
//       x: window.innerWidth / 2 - 60,
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 2, ease: 'easeOut' },
//     },
//     exit: {
//       x: window.innerWidth + 200,
//       opacity: 0,
//       scale: 0.9,
//       transition: { duration: 1.5, ease: 'easeIn' },
//     },
//   };

//   return (
//     <div className='p-4'>
//       <button
//         onClick={() => setShowComponents(!showComponents)}
//         className='px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600'
//       >
//         개별 컴포넌트 조합! 🎨
//       </button>

//       {showComponents && (
//         <div className='fixed inset-0 z-50 pointer-events-none'>
//           <OceanBackground colorTheme='ocean' />
//           <WaveEffect intensity='high' speed='fast' colorTheme='ocean' />
//           <div className='absolute inset-0 flex items-center justify-start overflow-hidden'>
//             <SwimmingWhale
//               variants={customWhaleVariants}
//               size='lg'
//               color='text-cyan-400'
//             />
//           </div>
//           <BubbleTrail
//             count={15}
//             size='lg'
//             color='bg-cyan-300/60'
//             speed='fast'
//           />

//           <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto'>
//             <h2 className='text-white text-xl font-bold mb-2'>
//               🌊 커스텀 조합
//             </h2>
//             <p className='text-cyan-200 text-sm'>
//               각 컴포넌트를 개별적으로 제어할 수 있어요!
//             </p>
//             <button
//               onClick={() => setShowComponents(false)}
//               className='mt-4 px-3 py-1 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600'
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // 모든 예시를 포함한 데모 페이지
// export function WhaleTransitionExamples() {
//   return (
//     <div className='min-h-screen bg-gray-100 p-8'>
//       <div className='max-w-4xl mx-auto'>
//         <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
//           🐋 Whale Transition Examples
//         </h1>

//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//           <div className='bg-white p-6 rounded-lg shadow-md'>
//             <h3 className='text-lg font-semibold mb-4'>기본 사용법</h3>
//             <BasicExample />
//           </div>

//           <div className='bg-white p-6 rounded-lg shadow-md'>
//             <h3 className='text-lg font-semibold mb-4'>오션 테마</h3>
//             <CustomizedExample />
//           </div>

//           <div className='bg-white p-6 rounded-lg shadow-md'>
//             <h3 className='text-lg font-semibold mb-4'>커스텀 색상</h3>
//             <CustomColorExample />
//           </div>

//           <div className='bg-white p-6 rounded-lg shadow-md'>
//             <h3 className='text-lg font-semibold mb-4'>로딩 화면</h3>
//             <LoadingExample />
//           </div>

//           <div className='bg-white p-6 rounded-lg shadow-md md:col-span-2'>
//             <h3 className='text-lg font-semibold mb-4'>개별 컴포넌트 조합</h3>
//             <CustomCompositionExample />
//           </div>
//         </div>

//         <div className='mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200'>
//           <h3 className='text-lg font-semibold text-blue-800 mb-2'>
//             💡 사용 팁
//           </h3>
//           <ul className='text-blue-700 text-sm space-y-1'>
//             <li>
//               • 모바일에서는 <code>whaleSize="sm"</code>을 사용하세요
//             </li>
//             <li>
//               • 로딩이 오래 걸릴 경우 <code>animationSpeed="slow"</code>를
//               권장합니다
//             </li>
//             <li>
//               • <code>pausePosition</code>으로 고래가 머무는 시간을 조절할 수
//               있어요
//             </li>
//             <li>
//               • 브랜드 색상에 맞게 <code>customColors</code>를 활용하세요
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
