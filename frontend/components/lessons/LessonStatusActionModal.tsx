'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import type { Lesson, BillingKind, MakeupPricingMode, AbsencePricingMode } from '@/lib/types';

interface LessonStatusActionModalProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onSave: (data: {
    status: '완료' | '결석' | '예정' | '보강';
    billing_kind: BillingKind;
    makeup_pricing_mode?: string;
    makeup_fee_amount?: number | null;
    absence_pricing_mode?: string;
    billing_note?: string;
  }) => Promise<void>;
}

export default function LessonStatusActionModal({ open, onClose, lesson, onSave }: LessonStatusActionModalProps) {
  const [billingKind, setBillingKind] = useState<BillingKind>(lesson?.billing_kind ?? 'regular');
  const [status, setStatus] = useState<'완료' | '결석' | '예정' | '보강'>('완료');
  const [makupPricingMode, setMakeupPricingMode] = useState(lesson?.makeup_pricing_mode ?? 'free');
  const [makeupFeeAmount, setMakeupFeeAmount] = useState(lesson?.makeup_fee_amount ?? null);
  const [absencePricingMode, setAbsencePricingMode] = useState(lesson?.absence_pricing_mode ?? 'charge');
  const [billingNote, setBillingNote] = useState(lesson?.billing_note ?? '');
  const [saving, setSaving] = useState(false);

  const handleBillingKindChange = (kind: BillingKind) => {
    setBillingKind(kind);
    // Update status based on billing kind
    if (kind === 'regular') setStatus('완료');
    else if (kind === 'makeup') setStatus('보강');
    else if (kind === 'absent') setStatus('결석');
    else setStatus('예정');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        status,
        billing_kind: billingKind,
        makeup_pricing_mode: makupPricingMode,
        makeup_fee_amount: makeupFeeAmount,
        absence_pricing_mode: absencePricingMode,
        billing_note: billingNote,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!lesson) return null;

  const inputCls = 'w-full rounded-xl p-3 mb-3 text-[13px] border border-[#eee]';
  const inputStyle = { background: '#f7f8fa', outline: 'none' };
  const labelCls = 'block text-[12px] mb-1';
  const labelStyle = { color: '#888' };

  return (
    <Modal open={open} onClose={onClose} title="수업 상태 및 청구 설정">
      <form onSubmit={handleSubmit}>
        {/* Billing Kind Selection */}
        <label className={labelCls} style={labelStyle}>청구 유형 *</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {['regular', 'makeup', 'absent', 'extra'].map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => handleBillingKindChange(kind as BillingKind)}
              className="py-2 rounded-lg text-[12px] font-medium transition"
              style={{
                background: billingKind === kind ? '#8FDCCF' : '#f7f8fa',
                color: billingKind === kind ? '#fff' : '#888',
                border: billingKind === kind ? 'none' : '1px solid #eee',
              }}
            >
              {kind === 'regular' && '정규'}
              {kind === 'makeup' && '보강'}
              {kind === 'absent' && '결석'}
              {kind === 'extra' && '추가'}
            </button>
          ))}
        </div>

        {/* Status (auto-set based on billing_kind) */}
        <label className={labelCls} style={labelStyle}>상태</label>
        <input
          type="text"
          disabled
          value={status}
          className={inputCls}
          style={{ ...inputStyle, opacity: 0.6 }}
        />

        {/* Makeup-specific fields */}
        {billingKind === 'makeup' && (
          <>
            <label className={labelCls} style={labelStyle}>보강 수업료 정책</label>
            <select
              value={makupPricingMode}
              onChange={(e) => setMakeupPricingMode(e.target.value as MakeupPricingMode)}
              className={inputCls}
              style={inputStyle}
            >
              <option value="free">무료</option>
              <option value="fixed">고정료</option>
              <option value="same">정가와 동일</option>
            </select>

            {makupPricingMode === 'fixed' && (
              <>
                <label className={labelCls} style={labelStyle}>보강 수업료 (원)</label>
                <input
                  type="number"
                  min="0"
                  value={makeupFeeAmount ?? ''}
                  onChange={(e) => setMakeupFeeAmount(e.target.value ? Number(e.target.value) : null)}
                  className={inputCls}
                  style={inputStyle}
                />
              </>
            )}
          </>
        )}

        {/* Absence-specific fields */}
        {billingKind === 'absent' && (
          <>
            <label className={labelCls} style={labelStyle}>결석 처리 방식</label>
            <select
              value={absencePricingMode}
              onChange={(e) => setAbsencePricingMode(e.target.value as AbsencePricingMode)}
              className={inputCls}
              style={inputStyle}
            >
              <option value="charge">비용 청구</option>
              <option value="free">무료 처리</option>
            </select>
          </>
        )}

        {/* Billing Note */}
        <label className={labelCls} style={labelStyle}>청구 메모</label>
        <textarea
          value={billingNote}
          onChange={(e) => setBillingNote(e.target.value)}
          rows={2}
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
