import type { CancelMakeup } from '../types';

const NOW = new Date().toISOString();

export const MOCK_CANCEL_MAKEUPS: CancelMakeup[] = [
  {
    id: 301,
    student: 4,
    student_name: '최다은',
    original_lesson: null,
    cancel_date: '2026-04-03',
    cancel_reason: '개인 사정',
    makeup_date: '2026-04-10',
    makeup_done: false,
    created_at: NOW,
    updated_at: NOW,
  },
];
