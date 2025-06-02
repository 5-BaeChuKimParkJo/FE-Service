import { MainLayout } from '@/components/layouts';

export default function Home() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <header className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-primary-200 mb-4'>
            중고거래플랫폼 찰낙찰낙
          </h1>
          <h2 className='text-2xl text-gray-600 mb-2'>중고거래 플랫폼 찰낙</h2>
        </header>

        <main className='space-y-6'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-lg text-center'>찰낙찰낙</p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-lg text-center'>찰낙찰낙</p>
          </div>

          <div className='grid grid-cols-2 gap-4 mt-8'>
            <div className='bg-primary-100 rounded-lg p-4 text-center'>
              <h3 className='text-white font-semibold'>경매</h3>
              <p className='text-white/80 text-sm mt-1'>실시간 경매</p>
            </div>
            <div className='bg-yellow-200 rounded-lg p-4 text-center'>
              <h3 className='text-white font-semibold'>일반거래</h3>
              <p className='text-white/80 text-sm mt-1'>바로 구매</p>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
