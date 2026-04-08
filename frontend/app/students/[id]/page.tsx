'use client';

import { use, useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import AppHeader from '@/components/layout/AppHeader';
import { getStudent } from '@/lib/api';
import { PAYMENT_BADGE } from '@/lib/constants';
import type { Student } from '@/lib/types';

const PAY_BADGE: Record<string, { bg: string; color: string }> = {
  입금완료: { bg: '#e8faf0', color: '#2ba862' },
  미납:     { bg: '#ffeaea', color: '#d94a4a' },
  부분입금: { bg: '#fff8e1', color: '#c49000' },
  대기:     { bg: '#f0f0f0', color: '#888' },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getStudent(Number(id))
      .then(data => {
        if (!mounted) return;
        setStudent(data);
      })
      .catch(() => {
        if (!mounted) return;
        setStudent(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!student) {
    return (
      <AppShell>
        <AppHeader greeting="학생 상세 정보를 확인하세요" />
        <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>
          {loading ? '학생 정보를 불러오는 중...' : '학생 정보를 찾을 수 없어요'}
        </div>
      </AppShell>
    );
  }

  const pay = PAYMENT_BADGE[student.payment_status] ?? PAYMENT_BADGE['대기'];

  return (
    <AppShell>
      <AppHeader greeting="학생 상세 정보를 확인하세요" />
      <div className="animate-fade-in" style={{ padding: '16px 20px' }}>
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', marginBottom: 20, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft size={16} />
          학생 목록
        </button>

        {/* 프로필 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EEF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#8FDCCF', flexShrink: 0 }}>
            {student.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#222' }}>{student.name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {student.subject}
              {student.regular_day ? ` · ${student.regular_day}` : ''}
              {student.regular_time ? ` ${student.regular_time}` : ''}
            </div>
          </div>
        </div>

        {/* 정보 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: '수업료', value: `${student.fee.toLocaleString()}원` },
            { label: '장소', value: student.default_location || '-' },
            { label: '연락처', value: student.phone || '-' },
            { label: '방식', value: student.lesson_method || '대면' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#f7f8fa', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#888' }}>입금 상태:</span>
          <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: pay.bg, color: pay.text }}>
            {student.payment_status}
          </span>
        </div>

        {student.memo && (
          <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>📝 {student.memo}</div>
        )}

        {/* 액션 */}
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button style={{ flex: 1, padding: '14px 0', borderRadius: 12, background: '#8FDCCF', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            수정
          </button>
          <button style={{ padding: '14px 20px', borderRadius: 12, background: '#ffeaea', color: '#d94a4a', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            삭제
          </button>
        </div>
      </div>
    </AppShell>
  );
}
