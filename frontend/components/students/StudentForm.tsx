'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import type { Student, StudentFormData } from '@/lib/types';

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => Promise<void>;
  student?: Student;  // edit mode
}

export default function StudentForm({ open, onClose, onSave, student }: StudentFormProps) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data: any = {
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      subject: fd.get('subject') as string,
      default_location: fd.get('default_location') as string,
      regular_day: fd.get('regular_day') as string,
      regular_time: fd.get('regular_time') as string,
      lesson_method: fd.get('lesson_method') as string,
      fee: Number(fd.get('fee')) || 0,
      payment_status: (fd.get('payment_status') as any) ?? '대기',
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
    <Modal open={open} onClose={onClose} title={student ? '학생 수정' : '학생 추가'}>
      <form onSubmit={handleSubmit}>
        <label className={labelCls} style={labelStyle}>이름 *</label>
        <input
          name="name"
          required
          defaultValue={student?.name ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>연락처</label>
        <input
          name="phone"
          type="tel"
          defaultValue={student?.phone ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>과목</label>
        <input
          name="subject"
          defaultValue={student?.subject ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={labelStyle}>수업 요일</label>
            <input
              name="regular_day"
              defaultValue={(student as any)?.regular_day ?? ''}
              placeholder="월, 수"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>수업 시간</label>
            <input
              name="regular_time"
              type="time"
              defaultValue={(student as any)?.regular_time ?? ''}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>

        <label className={labelCls} style={labelStyle}>장소</label>
        <input
          name="default_location"
          defaultValue={student?.default_location ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>수업 방식</label>
        <select
          name="lesson_method"
          defaultValue={(student as any)?.lesson_method ?? '대면'}
          className={inputCls}
          style={inputStyle}
        >
          <option value="대면">대면</option>
          <option value="온라인">온라인</option>
        </select>

        <label className={labelCls} style={labelStyle}>수업료(원)</label>
        <input
          name="fee"
          type="number"
          defaultValue={student?.fee ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>입금 상태</label>
        <select
          name="payment_status"
          defaultValue={student?.payment_status ?? '대기'}
          className={inputCls}
          style={inputStyle}
        >
          <option value="대기">대기</option>
          <option value="입금완료">입금완료</option>
          <option value="미납">미납</option>
          <option value="부분입금">부분입금</option>
        </select>

        <label className={labelCls} style={labelStyle}>메모</label>
        <textarea
          name="memo"
          rows={2}
          defaultValue={student?.memo ?? ''}
          className={inputCls}
          style={{ ...inputStyle, resize: 'none' }}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl text-[14px] font-semibold text-white"
          style={{ background: '#8FDCCF', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? '저장 중...' : student ? '수정 완료' : '추가하기'}
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
