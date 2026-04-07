'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { todayStr } from '@/lib/utils';
import type { Student, Lesson, LessonFormData } from '@/lib/types';

interface LessonFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LessonFormData) => Promise<void>;
  students: Student[];
  lesson?: Lesson;  // edit mode
}

export default function LessonForm({ open, onClose, onSave, students, lesson }: LessonFormProps) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data: LessonFormData = {
      student: Number(fd.get('student')),
      lesson_date: fd.get('lesson_date') as string,
      start_time: fd.get('start_time') as string,
      end_time: null,
      subject: fd.get('subject') as string,
      location: fd.get('location') as string,
      method: (fd.get('method') as '대면' | '온라인') ?? '대면',
      status: lesson?.status ?? '예정',
      homework: fd.get('homework') as string,
      homework_checked: lesson?.homework_checked ?? false,
      prep_done: lesson?.prep_done ?? false,
      memo: fd.get('memo') as string,
    };
    try {
      await onSave(data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-xl p-3 mb-3 text-[13px] border border-[#eee]';
  const inputStyle = { background: '#f7f8fa', outline: 'none' };
  const labelCls = 'block text-[12px] mb-1';
  const labelStyle = { color: '#888' };

  return (
    <Modal open={open} onClose={onClose} title={lesson ? '수업 수정' : '수업 추가'}>
      <form onSubmit={handleSubmit}>
        <label className={labelCls} style={labelStyle}>학생 *</label>
        <select
          name="student"
          required
          defaultValue={lesson?.student ?? ''}
          className={inputCls}
          style={inputStyle}
        >
          <option value="">선택</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <label className={labelCls} style={labelStyle}>날짜 *</label>
        <input
          name="lesson_date"
          type="date"
          required
          defaultValue={lesson?.lesson_date ?? todayStr()}
          className={inputCls}
          style={inputStyle}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={labelStyle}>시간</label>
            <input
              name="start_time"
              type="time"
              defaultValue={lesson?.start_time ?? ''}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>과목</label>
            <input
              name="subject"
              defaultValue={lesson?.subject ?? ''}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>

        <label className={labelCls} style={labelStyle}>장소</label>
        <input
          name="location"
          defaultValue={lesson?.location ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>수업 방식</label>
        <select
          name="method"
          defaultValue={lesson?.method ?? '대면'}
          className={inputCls}
          style={inputStyle}
        >
          <option value="대면">대면</option>
          <option value="온라인">온라인</option>
        </select>

        <label className={labelCls} style={labelStyle}>숙제</label>
        <input
          name="homework"
          defaultValue={lesson?.homework ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>메모</label>
        <input
          name="memo"
          defaultValue={lesson?.memo ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl text-[14px] font-semibold text-white"
          style={{ background: '#8FDCCF', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? '저장 중...' : '저장하기'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-2.5 rounded-xl text-[13px]"
          style={{ background: '#f7f8fa', color: '#888' }}
        >
          취소
        </button>
      </form>
    </Modal>
  );
}
