import TabBar from './TabBar';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * 메인 앱 래퍼
 * - 최대 480px 모바일 컨테이너
 * - 스크롤 가능한 콘텐츠 영역
 * - 하단 고정 탭바
 *
 * 각 페이지가 자신의 헤더(AppHeader)를 직접 렌더링한다.
 * 온보딩처럼 탭바 없는 화면은 AppShell을 사용하지 않는다.
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {/* 스크롤 가능 콘텐츠 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {children}
      </div>

      {/* 하단 탭바 */}
      <TabBar />
    </div>
  );
}
