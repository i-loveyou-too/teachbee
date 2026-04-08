'use client';

import { useState } from 'react';
import type { PaymentRequest } from '@/lib/types';
import { updatePaymentRequest } from '@/lib/api';

interface PaymentRequestCardProps {
  request: PaymentRequest;
  onMarkPaid: () => void;
}

export default function PaymentRequestCard({ request, onMarkPaid }: PaymentRequestCardProps) {
  const [marking, setMarking] = useState(false);

  const handleMarkPaid = async () => {
    setMarking(true);
    try {
      await updatePaymentRequest(request.id, { status: 'paid', paid_at: new Date().toISOString() });
      onMarkPaid();
    } finally {
      setMarking(false);
    }
  };

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: '#fff8e1', color: '#c49000', label: '대기' },
    paid: { bg: '#e8faf0', color: '#2ba862', label: '입금완료' },
    cancelled: { bg: '#ffeaea', color: '#d94a4a', label: '취소' },
  };

  const style = statusStyle[request.status] || statusStyle.pending;

  return (
    <div style={{ background: '#f7f8fa', borderRadius: 12, padding: 16, marginBottom: 8 }}>
      {/* Header: Student + Amount */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{request.student_name}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
            {request.lesson_count} 회 수업료
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>
            {request.amount.toLocaleString()}원
          </div>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 500,
              background: style.bg,
              color: style.color,
              marginTop: 4,
            }}
          >
            {style.label}
          </span>
        </div>
      </div>

      {/* Period */}
      {request.period_start && request.period_end && (
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
          📅 {request.period_start} ~ {request.period_end}
        </div>
      )}

      {/* Note */}
      {request.note && (
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
          📝 {request.note}
        </div>
      )}

      {/* Action Button */}
      {request.status === 'pending' && (
        <button
          onClick={handleMarkPaid}
          disabled={marking}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 8,
            background: '#8FDCCF',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: marking ? 'not-allowed' : 'pointer',
            opacity: marking ? 0.7 : 1,
          }}
        >
          {marking ? '처리 중...' : '입금 완료'}
        </button>
      )}
    </div>
  );
}
