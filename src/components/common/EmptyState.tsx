import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  className = '',
}: EmptyStateProps) {
  return (
    <section className={`text-center py-16 ${className}`} aria-label={title}>
      <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <Icon className='w-10 h-10 text-gray-400' aria-hidden='true' />
      </div>
      <h2 className='text-lg font-semibold text-gray-700 mb-2'>{title}</h2>
      <p className='text-sm text-gray-500 mb-6'>{description}</p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
        >
          {actionText}
        </Link>
      )}
    </section>
  );
}
