'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ToastContextType {
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          className="fixed top-5 left-1/2 z-[200] -translate-x-1/2 rounded-xl px-5 py-2.5 text-[13px] text-white animate-fade-in"
          style={{ background: '#222', whiteSpace: 'nowrap' }}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
