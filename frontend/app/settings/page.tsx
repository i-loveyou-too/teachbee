'use client';

import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import AppHeader from '@/components/layout/AppHeader';

export default function SettingsPage() {
  const router = useRouter();

  const menuItems = [
    { title: '프로필', desc: '선생님 정보를 수정하세요' },
    { title: '알림 설정', desc: '수업, 입금, 보강 알림' },
    { title: '정산 설정', desc: '정산 주기, 표시 방식' },
    { title: '데이터', desc: '학생 4명 · 수업 2개' },
  ];

  return (
    <AppShell>
      <AppHeader greeting="앱 설정을 확인해요" />
      <div className="animate-fade-in" style={{ padding: '16px 20px' }}>
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#888', marginBottom: 20,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          뒤로
        </button>

        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#222' }}>설정</div>

        {menuItems.map(item => (
          <button
            key={item.title}
            style={{
              width: '100%', textAlign: 'left', borderRadius: 12, padding: 16, marginBottom: 8,
              background: '#f7f8fa', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{item.title}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.desc}</div>
          </button>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem('teachbee_onboarded');
            router.replace('/onboarding');
          }}
          style={{
            width: '100%', marginTop: 24, padding: '10px 0',
            borderRadius: 12, background: '#ffeaea', color: '#d94a4a',
            fontSize: 13, border: 'none', cursor: 'pointer',
          }}
        >
          온보딩 다시 보기
        </button>
      </div>
    </AppShell>
  );
}
