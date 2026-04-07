/**
 * 루트 페이지: 온보딩 완료 여부에 따라 리다이렉트
 * (클라이언트 사이드 체크는 onboarding/page.tsx에서 처리)
 */
import { redirect } from 'next/navigation';

export default function RootPage() {
  // 서버 사이드에서는 항상 온보딩으로 보내고,
  // 온보딩 페이지가 localStorage 확인 후 /home으로 이동
  redirect('/onboarding');
}
