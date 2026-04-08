'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import AppHeader from '@/components/layout/AppHeader';
import { getPayments, updatePayment } from '@/lib/api';
import { PAYMENT_BADGE } from '@/lib/constants';
import type { Payment } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

// 상태 라벨 매핑 함수
const paymentStatusLabelMap = {
  paid: "입금완료",
  unpaid: "미납",
  pending: "입금대기",
  partial: "부분입금",
  partially_paid: "부분입금",
  overdue: "연체",
};

const getPaymentStatusLabel = (status: string | undefined) =>
  paymentStatusLabelMap[String(status ?? "").toLowerCase()] ?? "상태미정";

export default function BillingPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    let mounted = true;
    getPayments()
      .then(data => {
        if (!mounted) return;
        setPayments(data);
      })
      .catch(() => {
        if (!mounted) return;
        setPayments([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const paid = payments.filter(p => getPaymentStatusLabel(p.status) === '입금완료').reduce((sum, p) => sum + p.amount, 0);
  const unpaid = total - paid;

  const handleConfirm = async (id: number) => {
    try {
      const updated = await updatePayment(id, { status: 'paid' });
      setPayments(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      alert('입금 확인에 실패했습니다.');
    }
  };

  return (
    <AppShell>
      <AppHeader greeting="이번 달 정산을 확인하세요" />
      <div className="animate-fade-in" style={{ padding: '12px 20px 100px', background: '#fcfcfc', minHeight: '100vh' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', padding: '16px 0', letterSpacing: '-0.04em' }}>정산</div>

        {/* 상단 요약 히어로 카드 - Soft Mint Glass */}
        <div
          style={{
            borderRadius: 32, padding: '32px 28px', marginBottom: 32,
            background: 'linear-gradient(135deg, #a5f9f0 0%, #8FDCCF 100%)',
            color: '#1a4a44', // 선명한 가독성을 위한 짙은 티크 컬러
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(105,231,216,0.15), inset 0 0 0 1px rgba(255,255,255,0.4)',
            border: 'none',
          }}
        >
          {/* 선명한 하이라이트/반사 효과 */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(110deg, rgba(255,255,255,0.3) 0%, transparent 30%, rgba(255,255,255,0.1) 100%)', pointerEvents: 'none' }} />
          
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', opacity: 0.8 }}>이번 달 예정</div>
          <div style={{ fontSize: 34, fontWeight: 900, margin: '8px 0', letterSpacing: '-0.06em' }}>
            {total.toLocaleString()}원
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(26, 74, 68, 0.1)' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.7 }}>입금완료</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{paid.toLocaleString()}원</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.7 }}>미납액</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{unpaid.toLocaleString()}원</div>
            </div>
          </div>
        </div>

        {/* 학생별 정산 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {payments.map(payment => {
            // 상태별 젤리 칩 스타일 정의 (영어 키로 변경)
            const statusStyles: Record<string, { bg: string; text: string; shadow: string }> = {
              입금완료: { bg: 'rgba(232, 250, 240, 0.8)', text: '#2ba862', shadow: 'rgba(43, 168, 98, 0.1)' },
              미납: { bg: 'rgba(255, 234, 234, 0.8)', text: '#d94a4a', shadow: 'rgba(217, 74, 74, 0.1)' },
              입금대기: { bg: 'rgba(240, 240, 240, 0.8)', text: '#888', shadow: 'rgba(0,0,0,0.05)' },
              부분입금: { bg: 'rgba(255, 248, 225, 0.8)', text: '#c49000', shadow: 'rgba(196, 144, 0, 0.1)' },
              연체: { bg: 'rgba(255, 235, 235, 0.8)', text: '#d94a4a', shadow: 'rgba(217, 74, 74, 0.1)' },
            };
            const statusLabel = getPaymentStatusLabel(payment.status);
            const style = statusStyles[statusLabel] || statusStyles['입금대기'];

          return (
            <div
              key={payment.id}
              style={{
                borderRadius: 26, padding: '20px 24px',
                background: '#fff',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.01)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#1a1a1a', marginBottom: 2 }}>{payment.student_name ?? '-'}</div>
                <div style={{ fontSize: 13, color: '#888', fontWeight: 600, letterSpacing: '-0.02em' }}>{payment.amount.toLocaleString()}원</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ 
                  display: 'inline-block', padding: '5px 14px', borderRadius: 12, 
                  fontSize: 11, fontWeight: 900, 
                  background: style.bg, color: style.text,
                  boxShadow: `inset 0 1px 1px rgba(255,255,255,0.5)`,
                  border: `1px solid ${style.shadow.replace('0.1', '0.2')}`
                }}>
                  {statusLabel}
                </span>
                {getPaymentStatusLabel(payment.status) !== '입금완료' && (
                  <button
                    onClick={() => handleConfirm(payment.id)}
                    style={{
                      padding: '9px 14px', borderRadius: 12, fontSize: 11, fontWeight: 900,
                      background: 'var(--accent)', color: '#fff', 
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(105,231,216,0.3)'
                    }}
                  >
                    입금확인
                  </button>
                )}
                <ChevronRight size={16} color="#eee" />
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </AppShell>
  );
}
