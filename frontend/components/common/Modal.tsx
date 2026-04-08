'use client';

import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  // body scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[90]"
        style={{ background: 'rgba(0,0,0,0.25)' }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-1/2 z-[100] w-full overflow-y-auto scrollbar-hide"
        style={{
          maxWidth: 480,
          transform: 'translateX(-50%)',
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          maxHeight: '92dvh',
          padding: '18px 16px calc(20px + env(safe-area-inset-bottom))',
          boxShadow: '0 -12px 36px rgba(0, 0, 0, 0.08)',
          overscrollBehavior: 'contain',
          fontFamily: "'LINESeedKR', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {title && (
          <div className="mb-3 text-[15px] font-semibold leading-tight" style={{ color: '#222' }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </>
  );
}
