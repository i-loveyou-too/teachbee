'use client';

import Modal from '@/components/common/Modal';
import { LessonStatusBadge } from '@/components/common/Badge';
import type { Lesson } from '@/lib/types';

interface LessonDetailProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onEdit: (lesson: Lesson) => void;
  onToggleField: (id: number, field: 'prep_done' | 'homework_checked', value: boolean) => void;
  onUpdateStatus: (id: number, status: '완료' | '결강') => void;
  onDelete: (id: number) => void;
}

export default function LessonDetail({
  open, onClose, lesson, onEdit, onToggleField, onUpdateStatus, onDelete,
}: LessonDetailProps) {
  if (!lesson) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-base font-semibold mb-1" style={{ color: '#222' }}>
        {lesson.student_name ?? '학생'}
      </div>
      <div className="flex items-center gap-2 mb-4 text-[12px]" style={{ color: '#888' }}>
        <span>{lesson.lesson_date} {lesson.start_time}</span>
        <LessonStatusBadge status={lesson.status} />
      </div>

      {/* 상세 그리드 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: '과목', value: lesson.subject || '-' },
          { label: '장소', value: lesson.location || '-' },
          { label: '방식', value: lesson.method || '-' },
          { label: '숙제', value: lesson.homework || '-' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: '#f7f8fa' }}>
            <div className="text-[11px] mb-0.5" style={{ color: '#888' }}>{label}</div>
            <div className="text-[13px] font-medium" style={{ color: '#222' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 체크 버튼 */}
      <div className="flex gap-2 mb-3">
        {(['prep_done', 'homework_checked'] as const).map(field => {
          const active = lesson[field];
          const label = field === 'prep_done' ? '준비 완료' : '숙제 검사';
          return (
            <button
              key={field}
              onClick={() => onToggleField(lesson.id, field, !active)}
              className="flex-1 py-2 rounded-xl text-[12px] font-medium"
              style={{
                background: active ? '#EEF9F6' : '#f7f8fa',
                color: active ? '#8FDCCF' : '#888',
              }}
            >
              {active ? '✅' : '☐'} {label}
            </button>
          );
        })}
      </div>

      {lesson.memo && (
        <div className="text-[12px] mb-3" style={{ color: '#888' }}>
          📝 {lesson.memo}
        </div>
      )}

      {/* 액션 */}
      <div className="flex gap-2">
        {lesson.status === '예정' && (
          <>
            <button
              onClick={() => { onUpdateStatus(lesson.id, '완료'); onClose(); }}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white"
              style={{ background: '#8FDCCF' }}
            >
              수업 완료
            </button>
            <button
              onClick={() => { onUpdateStatus(lesson.id, '결강'); onClose(); }}
              className="py-2.5 px-4 rounded-xl text-[13px]"
              style={{ background: '#ffeaea', color: '#d94a4a' }}
            >
              결강
            </button>
          </>
        )}
        <button
          onClick={() => { onEdit(lesson); onClose(); }}
          className="py-2.5 px-4 rounded-xl text-[13px]"
          style={{ background: '#f7f8fa', color: '#888' }}
        >
          수정
        </button>
      </div>

      <button
        onClick={() => { onDelete(lesson.id); onClose(); }}
        className="w-full mt-2 py-2 rounded-xl text-[12px]"
        style={{ color: '#d94a4a' }}
      >
        삭제
      </button>
      <button
        onClick={onClose}
        className="w-full mt-1 py-2 rounded-xl text-[13px]"
        style={{ background: '#f7f8fa', color: '#888' }}
      >
        닫기
      </button>
    </Modal>
  );
}
