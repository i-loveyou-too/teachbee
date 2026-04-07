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
        className="fixed bottom-0 left-1/2 z-[100] w-full overflow-y-auto"
        style={{
          maxWidth: 480,
          transform: 'translateX(-50%)',
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          maxHeight: '88%',
          padding: '24px 20px 32px',
        }}
      >
        {title && (
          <div className="text-base font-semibold mb-4" style={{ color: '#222' }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </>
  );
}
