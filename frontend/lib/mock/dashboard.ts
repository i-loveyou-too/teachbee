import type { CancelMakeup, DashboardSummary, Lesson, Payment, Todo } from '../types';
import { todayStr } from '../utils';
import { MOCK_CANCEL_MAKEUPS } from './cancelMakeups';
import { MOCK_LESSONS } from './lessons';
import { MOCK_PAYMENTS } from './payments';
import { MOCK_TODOS } from './todos';

export function buildMockDashboard(input?: {
  lessons?: Lesson[];
  todos?: Todo[];
  payments?: Payment[];
  cancelMakeups?: CancelMakeup[];
  date?: string;
}): DashboardSummary {
  const today = input?.date ?? todayStr();
  const lessons = input?.lessons ?? MOCK_LESSONS;
  const todos = input?.todos ?? MOCK_TODOS;
  const payments = input?.payments ?? MOCK_PAYMENTS;
  const cancelMakeups = input?.cancelMakeups ?? MOCK_CANCEL_MAKEUPS;

  const today_lessons = lessons.filter(lesson => lesson.lesson_date === today);
  const today_todos = todos.filter(todo => todo.due_date === today);
  const unpaid_payments = payments.filter(payment => payment.status !== '입금완료');
  const makeup_needed = cancelMakeups.filter(cancel => !cancel.makeup_done);

  return {
    today_lessons,
    today_todos,
    unpaid_payments,
    makeup_needed,
    today_lessons_count: today_lessons.length,
    today_todos_count: today_todos.length,
    unpaid_count: unpaid_payments.length,
    makeup_needed_count: makeup_needed.length,
  };
}

export const MOCK_DASHBOARD: DashboardSummary = buildMockDashboard();
