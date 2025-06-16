export function ItemDescriptionSection({
  description,
}: {
  description: string;
}) {
  return (
    <section className='px-2 py-5 mx-4 my-2 bg-white rounded-lg'>
      <p className='text-sm text-gray-900'>{description}</p>
    </section>
  );
}
