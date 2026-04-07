'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { todayStr, addDays } from '@/lib/utils';
import type { TodoFormData } from '@/lib/types';

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TodoFormData) => Promise<void>;
  defaultDate?: string;
}

const QUICK_DATES = [
  { label: '오늘', getValue: () => todayStr() },
  { label: '내일', getValue: () => addDays(1) },
  { label: '모레', getValue: () => addDays(2) },
];

export default function TodoForm({ open, onClose, onSave, defaultDate }: TodoFormProps) {
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultDate ?? todayStr());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data: TodoFormData = {
      text: fd.get('text') as string,
      due_date: selectedDate,
      done: false,
      related_student: null,
      related_lesson: null,
    };
    try {
      await onSave(data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: 12,
    padding: '11px 13px',
    marginBottom: 10,
    border: '1px solid #eee',
    background: '#f7f8fa',
    fontSize: 13,
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <Modal open={open} onClose={onClose} title="할 일 추가">
      <form onSubmit={handleSubmit}>
        <input
          name="text"
          required
          placeholder="어떤 할 일인가요?"
          style={inputStyle}
          autoFocus
        />

        {/* 빠른 날짜 선택 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {QUICK_DATES.map(q => {
            const val = q.getValue();
            const active = selectedDate === val;
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => setSelectedDate(val)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? '#8FDCCF' : '#f0f0f0',
                  color: active ? '#fff' : '#555',
                  transition: 'all 0.15s',
                }}
              >
                {q.label}
              </button>
            );
          })}
        </div>

        {/* 직접 날짜 선택 */}
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{ ...inputStyle, marginBottom: 16 }}
        />

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 12,
            background: '#8FDCCF', color: '#fff',
            fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? '저장 중...' : '추가'}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 12,
            background: '#f7f8fa', color: '#888',
            fontSize: 13, border: 'none', cursor: 'pointer',
          }}
        >
          취소
        </button>
      </form>
    </Modal>
  );
}
