import { TagResponseDto } from '@/types/auction/auction-read';

interface AuctionTagsProps {
  tags: TagResponseDto[];
}

export function AuctionTags({ tags }: AuctionTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  tags.map((tag) => {
    if (tag.name.startsWith('#')) {
      tag.name = tag.name.slice(1);
    }
  });

  return (
    <section className='px-4 mt-2'>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className='bg-primary-100/10 text-primary-100 px-3 h-8 rounded-full text-sm flex items-center'
          >
            # {tag.name}
          </span>
        ))}
      </div>
    </section>
  );
}
