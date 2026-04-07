import type { Todo } from '../types';
import { todayStr, addDays } from '../utils';

const NOW = new Date().toISOString();
const TODAY = todayStr();
const TOMORROW = addDays(1);
const DAY_AFTER = addDays(2);
const FUTURE = addDays(5);

export const MOCK_TODOS: Todo[] = [
  {
    id: 1,
    text: '수진 학생 입금 확인 메시지 보내기',
    due_date: TODAY,
    done: false,
    related_student: 2,
    related_lesson: null,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 2,
    text: '숙제 채점하기',
    due_date: TODAY,
    done: false,
    related_student: null,
    related_lesson: null,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 3,
    text: '다음 주 수업 계획 정리',
    due_date: TODAY,
    done: true,
    related_student: null,
    related_lesson: null,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 4,
    text: '지민 수업 자료 준비',
    due_date: TOMORROW,
    done: false,
    related_student: 1,
    related_lesson: null,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 5,
    text: '수업료 정산 확인',
    due_date: DAY_AFTER,
    done: false,
    related_student: null,
    related_lesson: null,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 6,
    text: '월말 정산 보고서 작성',
    due_date: FUTURE,
    done: false,
    related_student: null,
    related_lesson: null,
    created_at: NOW,
    updated_at: NOW,
  },
];
