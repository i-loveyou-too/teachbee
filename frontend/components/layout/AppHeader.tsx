'use client';

import { useState, type ReactNode } from 'react';
import Modal from '@/components/common/Modal';
import BrandLogo from '@/components/common/BrandLogo';

// ── 알림 모달 ─────────────────────────────────────────────────────────────
function NotificationsModal({ onClose }: { onClose: () => void }) {
  const items = [
    { bg: '#f7f8fa', text: '📚 김준호 15:00 수업 예정' },
    { bg: '#ffeaea', text: '💰 이수지 수업료 미납' },
    { bg: '#e8f4fd', text: '🔄 최다은 보강 필요' },
  ];
  return (
    <Modal open onClose={onClose} title="알림">
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, background: item.bg }}>
          <div style={{ fontSize: 12 }}>{item.text}</div>
        </div>
      ))}
      <button onClick={onClose} style={{ width: '100%', marginTop: 12, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}>
        닫기
      </button>
    </Modal>
  );
}

// ── 설정 모달 ─────────────────────────────────────────────────────────────
function SettingsModal({ onClose }: { onClose: () => void }) {
  const items = [
    { title: '프로필', desc: '선생님 정보를 수정하세요' },
    { title: '알림 설정', desc: '수업, 입금, 보강 알림' },
    { title: '정산 설정', desc: '정산 주기, 표시 방식' },
    { title: '데이터', desc: '학생 4명 · 수업 2개' },
  ];
  return (
    <Modal open onClose={onClose} title="설정">
      {items.map(item => (
        <div key={item.title} style={{ borderRadius: 12, padding: 16, marginBottom: 8, background: '#f7f8fa' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{item.title}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.desc}</div>
        </div>
      ))}
      <button onClick={onClose} style={{ width: '100%', marginTop: 12, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}>
        닫기
      </button>
    </Modal>
  );
}

// ── 헤더 메인 ─────────────────────────────────────────────────────────────
interface AppHeaderProps {
  greeting?: string;
  rightActions?: ReactNode;
}

export default function AppHeader({
  greeting = '오늘도 좋은 수업 되세요 ☀️',
  rightActions,
}: AppHeaderProps) {
  const [notiOpen, setNotiOpen] = useState(false);
  const [settOpen, setSettOpen] = useState(false);

  return (
    <>
      <header
        style={{
          padding: '20px 20px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BrandLogo variant="header" />
          <div style={{ fontSize: 12, color: '#888' }}>{greeting}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {rightActions}
          {/* 알림 버튼 */}
          <button
            onClick={() => setNotiOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#f7f8fa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            {/* Bell SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          {/* 설정 버튼 */}
          <button
            onClick={() => setSettOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#f7f8fa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            {/* Settings SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      {notiOpen && <NotificationsModal onClose={() => setNotiOpen(false)} />}
      {settOpen && <SettingsModal onClose={() => setSettOpen(false)} />}
    </>
  );
}
