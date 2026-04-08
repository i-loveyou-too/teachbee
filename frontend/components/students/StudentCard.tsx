import Card from '@/components/common/Card';
import { PaymentBadge } from '@/components/common/Badge';
import type { Student } from '@/lib/types';

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <Card className="p-4 mb-2" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 아바타 */}
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-semibold flex-shrink-0"
            style={{ background: '#EEF9F6', color: '#8FDCCF' }}
          >
            {(student.name || '?')[0]}
          </div>
          <div>
            <div className="text-[14px] font-semibold" style={{ color: '#222' }}>
              {student.name}
            </div>
            <div className="text-[11px]" style={{ color: '#888' }}>
              {student.subject}
              {(student as any).regular_day ? ` · ${(student as any).regular_day}` : ''}
            </div>
          </div>
        </div>
        <PaymentBadge status={student.payment_status} />
      </div>
    </Card>
  );
}
