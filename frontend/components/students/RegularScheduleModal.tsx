'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import type { StudentRegularSchedule } from '@/lib/types';
import { createRegularSchedule, updateRegularSchedule } from '@/lib/api';

interface RegularScheduleModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  schedule?: StudentRegularSchedule;
  onSave: () => void;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function RegularScheduleModal({ open, onClose, studentId, schedule, onSave }: RegularScheduleModalProps) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      student: studentId,
      day_of_week: Number(fd.get('day_of_week')),
      start_time: fd.get('start_time') as string,
      end_time: fd.get('end_time') as string,
      location: fd.get('location') as string,
      is_active: fd.get('is_active') === 'on',
    };
    try {
      if (schedule) {
        await updateRegularSchedule(schedule.id, data);
      } else {
        await createRegularSchedule(data);
      }
      onSave();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full min-h-[44px] rounded-xl px-3 py-2.5 mb-2.5 text-[13px] leading-[1.4] border border-[#eee]';
  const inputStyle = { background: '#f7f8fa', outline: 'none' };
  const labelCls = 'block text-[12px] mb-1 leading-[1.35]';
  const labelStyle = { color: '#888' };

  return (
    <Modal open={open} onClose={onClose} title={schedule ? '정규 일정 수정' : '정규 일정 추가'}>
      <form onSubmit={handleSubmit}>
        <label className={labelCls} style={labelStyle}>요일 *</label>
        <select
          name="day_of_week"
          required
          defaultValue={schedule?.day_of_week ?? 0}
          className={inputCls}
          style={inputStyle}
        >
          {DAYS.map((day, idx) => (
            <option key={idx} value={idx}>{day}</option>
          ))}
        </select>

        <div className="mb-2.5 grid grid-cols-2 gap-2.5">
          <div>
            <label className={labelCls} style={labelStyle}>시작 시간 *</label>
            <input
              name="start_time"
              type="time"
              required
              defaultValue={schedule?.start_time ?? ''}
              className={`${inputCls} mb-0`}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>종료 시간</label>
            <input
              name="end_time"
              type="time"
              defaultValue={schedule?.end_time ?? ''}
              className={`${inputCls} mb-0`}
              style={inputStyle}
            />
          </div>
        </div>

        <label className={labelCls} style={labelStyle}>장소</label>
        <input
          name="location"
          defaultValue={schedule?.location ?? ''}
          className={inputCls}
          style={inputStyle}
        />

        <label className="mb-2.5 flex items-center gap-2 text-[12px] leading-[1.35]" style={{ color: '#666' }}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={schedule?.is_active ?? true}
            style={{ width: 15, height: 15, margin: 0, accentColor: '#8FDCCF' }}
          />
          활성화
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="submit"
            disabled={saving}
            className="h-11 w-full rounded-xl text-[14px] font-semibold text-white"
            style={{ background: '#8FDCCF', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl text-[14px] font-semibold"
            style={{ background: '#f7f8fa', color: '#888' }}
          >
            취소
          </button>
        </div>
      </form>
    </Modal>
  );
}
