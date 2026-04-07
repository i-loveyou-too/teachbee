import type { Metadata, Viewport } from 'next';
import { ToastProvider } from '@/components/common/Toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'TeachBee',
  description: '과외쌤 전용 개인 비서',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, background: '#fff' }}>
        <ToastProvider>
          {/*
           * 모바일 앱처럼 보이는 컨테이너
           * 최대 480px, 가운데 정렬, 전체 높이
           */}
          <div
            style={{
              maxWidth: 480,
              margin: '0 auto',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
