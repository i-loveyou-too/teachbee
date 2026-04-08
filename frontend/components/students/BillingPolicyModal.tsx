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

  const inputCls = 'w-full rounded-xl p-3 mb-3 text-[13px] border border-[#eee]';
  const inputStyle = { background: '#f7f8fa', outline: 'none' };
  const labelCls = 'block text-[12px] mb-1';
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

        <label className={labelCls} style={labelStyle}>청구 주기 (수업 횟수) *</label>
        <input
          name="cycle_lesson_count"
          type="number"
          min="1"
          required
          defaultValue={policy?.cycle_lesson_count ?? 4}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>수업료 (원) *</label>
        <input
          name="fee_amount"
          type="number"
          min="0"
          required
          defaultValue={policy?.fee_amount ?? 0}
          className={inputCls}
          style={inputStyle}
        />

        <label className={labelCls} style={labelStyle}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={policy?.is_active ?? true}
            style={{ marginRight: 6 }}
          />
          활성화
        </label>

        <label className={labelCls} style={labelStyle}>메모</label>
        <textarea
          name="memo"
          rows={2}
          defaultValue={policy?.memo ?? ''}
          className={inputCls}
          style={{ ...inputStyle, resize: 'none' }}
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
