export function MemberInfoSectionSkeleton() {
  return (
    <section className='flex flex-col gap-4 py-2'>
      <div className='flex items-center gap-4'>
        <div className='w-10 h-10 bg-white rounded-full' />
        <div className='flex flex-col gap-2'>
          <div className='w-32 h-3 bg-white rounded' />
          <div className='w-24 h-5 bg-white rounded' />
        </div>
        <div className='ml-auto mr-2 flex items-center'>
          <div className='flex items-center bg-white rounded-full h-10 min-w-[80px] justify-center'>
            <div className='w-7 h-7 rounded-full bg-white mr-4' />
            <div className='w-8 h-4 bg-white rounded' />
          </div>
        </div>
      </div>
    </section>
  );
}
