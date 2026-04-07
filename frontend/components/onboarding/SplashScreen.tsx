'use client';

import BrandLogo from '@/components/common/BrandLogo';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        /* 흰색 → 아주 연한 크림/웜베이지 그라디언트 */
        background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 52%, #fffbf0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 상단 넓은 여백 */}
      <div style={{ flex: '0 0 14%' }} />

      {/* 중앙 콘텐츠 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          width: '100%',
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        {/* 아이콘 카드 */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            background: '#edfaf7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            boxShadow: '0 4px 24px rgba(92,198,186,0.12)',
          }}
        >
          {/* 벌 이모지 — 스크린샷 일치 */}
          <span style={{ fontSize: 52, lineHeight: 1, userSelect: 'none' }}>🐝</span>
        </div>

        {/* 앱 이름 */}
        <div style={{ marginBottom: 12 }}>
          <BrandLogo variant="hero" />
        </div>

        {/* 브랜드 설명 — 2줄 중앙정렬 */}
        <div
          style={{
            fontSize: 15,
            color: '#777',
            textAlign: 'center',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          개인 과외 선생님을 위한<br />
          스마트 수업 비서
        </div>

        {/* 스페이서 — 버튼을 하단 쪽으로 내림 */}
        <div style={{ flex: 1, minHeight: 48 }} />

        {/* 시작하기 버튼 */}
        <button
          onClick={onStart}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 18,
            background: '#8FDCCF',
            color: '#fff',
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '-0.2px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(92,198,186,0.32)',
            transition: 'opacity 0.15s',
          }}
          onMouseDown={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
          onMouseUp={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          시작하기
        </button>

        {/* 보조 텍스트 */}
        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            color: '#bbb',
            letterSpacing: '-0.1px',
          }}
        >
          간편하게 3초 만에 시작
        </div>

        {/* 하단 여백 */}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
