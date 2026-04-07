'use client';

import { useState } from 'react';

interface Slide {
  cardBg: string;
  cardEmoji: string;
  cardLabel: string;
  title: string;
  desc: string;
}

const SLIDES: Slide[] = [
  {
    cardBg: '#8FDCCF',
    cardEmoji: '📅',
    cardLabel: '수업 일정을 한눈에',
    title: '수업, 학생, 정산까지\n한 곳에서 관리해요',
    desc: '달력 중심으로 모든 수업을\n깔끔하게 정리할 수 있어요',
  },
  {
    cardBg: '#7ec8e3',
    cardEmoji: '👤',
    cardLabel: '학생 관리도 간편하게',
    title: '모든 학생 정보를\n한눈에 파악하세요',
    desc: '수업 이력, 미납 현황, 숙제까지\n빠짐없이 관리할 수 있어요',
  },
  {
    cardBg: '#f0907e',
    cardEmoji: '💰',
    cardLabel: '정산 걱정 없이',
    title: '입금 현황을 자동으로\n정리해드려요',
    desc: '누가 미납인지, 얼마인지\n한 번에 확인하세요',
  },
];

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export default function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const [current, setCurrent] = useState(0);

  const isLast = current === SLIDES.length - 1;
  const slide = SLIDES[current];

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 50%, #fffbf0 100%)',
        overflow: 'hidden',
      }}
    >
      {/* 상단 피처 카드 */}
      <div
        style={{
          flex: '0 0 42%',
          background: slide.cardBg,
          borderRadius: '0 0 28px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          transition: 'background 0.4s ease',
          padding: '0 24px',
        }}
      >
        {/* 이모지 아이콘 */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 36, lineHeight: 1, userSelect: 'none' }}>
            {slide.cardEmoji}
          </span>
        </div>

        {/* 카드 레이블 */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.3px',
          }}
        >
          {slide.cardLabel}
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 32px 0',
        }}
      >
        {/* 메인 타이틀 */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: '-0.5px',
            whiteSpace: 'pre-line',
            marginBottom: 14,
          }}
        >
          {slide.title}
        </div>

        {/* 서브 타이틀 */}
        <div
          style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
            lineHeight: 1.65,
            whiteSpace: 'pre-line',
          }}
        >
          {slide.desc}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div
        style={{
          padding: '0 28px 44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* 페이지네이션 도트 */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === current ? 20 : 7,
                height: 7,
                borderRadius: 999,
                background: i === current ? '#8FDCCF' : '#ddd',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* 버튼 행 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* 건너뛰기 */}
          <button
            onClick={onComplete}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              color: '#bbb',
              fontWeight: 500,
              padding: '10px 4px',
            }}
          >
            건너뛰기
          </button>

          {/* 다음 / 시작하기 */}
          <button
            onClick={handleNext}
            style={{
              background: '#8FDCCF',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 700,
              padding: '14px 36px',
              borderRadius: 16,
              boxShadow: '0 6px 20px rgba(92,198,186,0.28)',
              transition: 'opacity 0.15s',
            }}
            onMouseDown={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
            onMouseUp={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            {isLast ? '시작하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}
