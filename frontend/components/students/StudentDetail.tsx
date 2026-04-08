'use client';

import Modal from '@/components/common/Modal';
import { PaymentBadge, LessonStatusBadge } from '@/components/common/Badge';
import { fmtMoney } from '@/lib/utils';
import type { Student, Lesson, CancelMakeup } from '@/lib/types';

interface StudentDetailProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  lessons: Lesson[];
  cancelMakeups: CancelMakeup[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export default function StudentDetail({
  open, onClose, student, lessons, cancelMakeups, onEdit, onDelete,
}: StudentDetailProps) {
  if (!student) return null;

  return (
    <Modal open={open} onClose={onClose}>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-[20px] font-bold flex-shrink-0"
          style={{ background: '#EEF9F6', color: '#8FDCCF' }}
        >
          {(student.name || '?')[0]}
        </div>
        <div>
          <div className="text-[18px] font-bold" style={{ color: '#222' }}>{student.name}</div>
          <div className="text-[12px]" style={{ color: '#888' }}>
            {student.subject}
            {(student as any).regular_day ? ` · ${(student as any).regular_day}` : ''}
            {(student as any).regular_time ? ` ${(student as any).regular_time}` : ''}
          </div>
        </div>
      </div>

      {/* 수업료 / 입금 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-xl p-3" style={{ background: '#f7f8fa' }}>
          <div className="text-[11px] mb-0.5" style={{ color: '#888' }}>수업료</div>
          <div className="text-[15px] font-semibold">{fmtMoney(student.fee)}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: '#f7f8fa' }}>
          <div className="text-[11px] mb-0.5" style={{ color: '#888' }}>입금</div>
          <PaymentBadge status={student.payment_status} />
        </div>
      </div>

      {student.phone && (
        <div className="text-[12px] mb-1" style={{ color: '#888' }}>📞 {student.phone}</div>
      )}
      {student.default_location && (
        <div className="text-[12px] mb-1" style={{ color: '#888' }}>📍 {student.default_location}</div>
      )}
      {student.memo && (
        <div className="text-[12px] mb-3" style={{ color: '#888' }}>📝 {student.memo}</div>
      )}

      {/* 최근 수업 */}
      <div className="text-[13px] font-semibold mt-3 mb-2" style={{ color: '#222' }}>최근 수업</div>
      {lessons.length === 0 ? (
        <div className="text-[12px]" style={{ color: '#888' }}>수업 기록이 없어요</div>
      ) : (
        lessons.slice(0, 5).map(l => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-lg p-2 mb-1"
            style={{ background: '#f7f8fa' }}
          >
            <span className="text-[12px]">{l.lesson_date} {l.start_time}</span>
            <LessonStatusBadge status={l.status} />
          </div>
        ))
      )}

      {/* 결강/보강 */}
      {cancelMakeups.length > 0 && (
        <>
          <div className="text-[13px] font-semibold mt-3 mb-2" style={{ color: '#222' }}>결강/보강</div>
          {cancelMakeups.map(c => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg p-2 mb-1"
              style={{ background: '#f7f8fa' }}
            >
              <span className="text-[12px]">결강: {c.cancel_date}</span>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={c.makeup_done
                  ? { background: '#e8faf0', color: '#2ba862' }
                  : { background: '#fff8e1', color: '#c49000' }
                }
              >
                {c.makeup_done ? '보강완료' : '보강필요'}
              </span>
            </div>
          ))}
        </>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => { onEdit(student); onClose(); }}
          className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white"
          style={{ background: '#8FDCCF' }}
        >
          수정
        </button>
        <button
          onClick={() => { onDelete(student.id); onClose(); }}
          className="py-2.5 px-4 rounded-xl text-[13px] font-medium"
          style={{ background: '#ffeaea', color: '#d94a4a' }}
        >
          삭제
        </button>
      </div>
      <button
        onClick={onClose}
        className="w-full mt-2 py-2 rounded-xl text-[13px]"
        style={{ background: '#f7f8fa', color: '#888' }}
      >
        닫기
      </button>
    </Modal>
  );
}
