'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/onboarding/SplashScreen';
import OnboardingSlides from '@/components/onboarding/OnboardingSlides';
import { ROUTES } from '@/lib/constants';

type Step = 'splash' | 'slides';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('splash');

  useEffect(() => {
    // 이미 온보딩을 마친 경우 홈으로
    if (localStorage.getItem('teachbee_onboarded')) {
      router.replace(ROUTES.home);
    }
  }, [router]);

  const handleComplete = () => {
    localStorage.setItem('teachbee_onboarded', '1');
    router.replace(ROUTES.home);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {step === 'splash' ? (
        <SplashScreen onStart={() => setStep('slides')} />
      ) : (
        <OnboardingSlides onComplete={handleComplete} />
      )}
    </div>
  );
}
