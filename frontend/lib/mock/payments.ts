import type { Payment } from '../types';
import { todayStr } from '../utils';

const NOW = new Date().toISOString();
const TODAY = todayStr();

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 201,
    student: 1,
    student_name: '김지민',
    amount: 50000,
    due_date: TODAY,
    status: '입금완료',
    memo: '',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 202,
    student: 2,
    student_name: '이수진',
    amount: 45000,
    due_date: TODAY,
    status: '미납',
    memo: '',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 203,
    student: 3,
    student_name: '박민준',
    amount: 55000,
    due_date: TODAY,
    status: '입금완료',
    memo: '',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 204,
    student: 4,
    student_name: '최다은',
    amount: 40000,
    due_date: TODAY,
    status: '대기',
    memo: '',
    created_at: NOW,
    updated_at: NOW,
  },
];
