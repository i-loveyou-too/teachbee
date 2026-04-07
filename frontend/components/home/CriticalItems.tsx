'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fmtMoney } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Student, CancelMakeup } from '@/lib/types';

interface CriticalItemsProps {
  unpaidStudents: Student[];
  pendingMakeups: CancelMakeup[];
}

export default function CriticalItems({ unpaidStudents, pendingMakeups }: CriticalItemsProps) {
  const router = useRouter();

  if (unpaidStudents.length === 0 && pendingMakeups.length === 0) return null;

  return (
    <section className="mt-4">
      <div className="text-[13px] font-semibold mb-2.5" style={{ color: '#222' }}>
        ⚠️ 처리 필요
      </div>

      {unpaidStudents.slice(0, 2).map(s => (
        <div
          key={s.id}
          className="rounded-xl p-3.5 mb-2.5 cursor-pointer"
          style={{ background: '#fff5f5', border: '1px solid #ffebeb' }}
          onClick={() => router.push(ROUTES.billing)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-semibold" style={{ color: '#d94a4a' }}>
                {s.name}
              </div>
              <div className="text-[11px] opacity-70" style={{ color: '#d94a4a' }}>
                {fmtMoney(s.fee)} 미납
              </div>
            </div>
            <ChevronRight size={16} color="#d94a4a" />
          </div>
        </div>
      ))}

      {pendingMakeups.slice(0, 2).map(c => (
        <div
          key={c.id}
          className="rounded-xl p-3.5 mb-2.5 cursor-pointer"
          style={{ background: '#f0f9ff', border: '1px solid #e0f2fe' }}
          onClick={() => router.push(ROUTES.calendar)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-semibold" style={{ color: '#3a8fd4' }}>
                {c.student_name} 보강
              </div>
              <div className="text-[11px] opacity-70" style={{ color: '#3a8fd4' }}>
                결강일: {c.cancel_date}
              </div>
            </div>
            <ChevronRight size={16} color="#3a8fd4" />
          </div>
        </div>
      ))}
    </section>
  );
}
