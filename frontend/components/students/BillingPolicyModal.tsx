'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import type { StudentBillingPolicy, BillingKind } from '@/lib/types';
import { createBillingPolicy, updateBillingPolicy } from '@/lib/api';

interface BillingPolicyModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  policy?: StudentBillingPolicy;
  onSave: () => void;
}

export default function BillingPolicyModal({ open, onClose, studentId, policy, onSave }: BillingPolicyModalProps) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      student: studentId,
      billing_kind: fd.get('billing_kind') as BillingKind,
      cycle_lesson_count: Number(fd.get('cycle_lesson_count')) || 4,
      fee_amount: Number(fd.get('fee_amount')) || 0,
      is_active: fd.get('is_active') === 'on',
      memo: fd.get('memo') as string,
    };
    try {
      if (policy) {
        await updateBillingPolicy(policy.id, data);
      } else {
        await createBillingPolicy(data);
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
    <Modal open={open} onClose={onClose} title={policy ? '수업료 규칙 수정' : '수업료 규칙 추가'}>
      <form onSubmit={handleSubmit}>
        <label className={labelCls} style={labelStyle}>청구 유형 *</label>
        <select
          name="billing_kind"
          required
          defaultValue={policy?.billing_kind ?? 'regular'}
          className={inputCls}
          style={inputStyle}
        >
          <option value="regular">정규</option>
          <option value="makeup">보강</option>
          <option value="absent">결석</option>
          <option value="extra">추가</option>
        </select>

        <div className="mb-2.5 grid grid-cols-2 gap-2.5">
          <div>
            <label className={labelCls} style={labelStyle}>청구 주기 (수업 횟수) *</label>
            <input
              name="cycle_lesson_count"
              type="number"
              min="1"
              required
              defaultValue={policy?.cycle_lesson_count ?? 4}
              className={`${inputCls} mb-0`}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>수업료 (원) *</label>
            <input
              name="fee_amount"
              type="number"
              min="0"
              required
              defaultValue={policy?.fee_amount ?? 0}
              className={`${inputCls} mb-0`}
              style={inputStyle}
            />
          </div>
        </div>

        <label className="mb-2.5 flex items-center gap-2 text-[12px] leading-[1.35]" style={{ color: '#666' }}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={policy?.is_active ?? true}
            style={{ width: 15, height: 15, margin: 0, accentColor: '#8FDCCF' }}
          />
          활성화
        </label>

        <label className={labelCls} style={labelStyle}>메모</label>
        <textarea
          name="memo"
          rows={2}
          defaultValue={policy?.memo ?? ''}
          className={`${inputCls} mb-0 min-h-[68px]`}
          style={{ ...inputStyle, resize: 'none' }}
        />

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
