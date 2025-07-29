'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, ShoppingBag, Gavel } from 'lucide-react';

export function CreateProductFAB() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const allowedPaths = ['/', '/auctions', '/products'];
    setVisible(allowedPaths.includes(pathname));
  }, [pathname]);

  if (!visible) {
    return null;
  }

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const menuItems = [
    {
      href: '/products/create',
      icon: <ShoppingBag className='w-6 h-6 text-primary-100' />,
      label: '일반',
    },
    {
      href: '/auctions/create',
      icon: <Gavel className='w-6 h-6 text-primary-100' />,
      label: '경매',
    },
  ];

  return (
    <>
      {open && (
        <div
          className='fixed inset-0 bg-black/10 z-40'
          onClick={handleClose}
          aria-hidden='true'
        />
      )}
      <div
        className='fixed bottom-21 z-50'
        style={{
          right: 'max(12px, calc(50vw - 240px + 12px))',
        }}
      >
        <div className='relative flex flex-col items-center'>
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className='absolute bottom-0 bg-white transition-all duration-300 ease-in-out flex flex-col items-center justify-center shadow-lg'
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                transform: open
                  ? `translateY(-${(i + 1) * 76}px) scale(1)`
                  : 'translateY(0) scale(0)',
                opacity: open ? 1 : 0,
                pointerEvents: open ? 'auto' : 'none',
                transitionDelay: open ? `${i * 30}ms` : '0ms',
              }}
              onClick={handleClose}
            >
              {item.icon}
              <span className='mt-1 text-xs font-bold text-gray-700'>
                {item.label}
              </span>
            </Link>
          ))}

          <button
            type='button'
            className='relative z-10 w-14 h-14 rounded-full bg-primary-200 flex items-center justify-center text-white shadow-lg transition-transform duration-300 ease-in-out'
            onClick={toggleOpen}
            aria-haspopup='true'
            aria-expanded={open}
            aria-label='상품 등록하기'
          >
            <Plus
              className={`transition-transform duration-300 ease-in-out ${
                open ? 'rotate-45' : 'rotate-0'
              }`}
              size={28}
            />
          </button>
        </div>
      </div>
    </>
  );
}
