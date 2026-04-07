import type { Lesson } from '../types';
import { dateToStr, todayStr } from '../utils';

const NOW = new Date().toISOString();
const TODAY = todayStr();
const TOMORROW = dateToStr(new Date(Date.now() + 24 * 60 * 60 * 1000));

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 101,
    student: 1,
    student_name: '김지민',
    lesson_date: TODAY,
    start_time: '15:00',
    end_time: null,
    subject: '영어 발음',
    location: '강남 카페',
    method: '대면',
    status: '예정',
    homework: 'p.45-50 문제 풀기',
    homework_checked: false,
    prep_done: false,
    memo: '',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 102,
    student: 2,
    student_name: '이수진',
    lesson_date: TODAY,
    start_time: '16:00',
    end_time: null,
    subject: '수학 문제풀이',
    location: '온라인',
    method: '온라인',
    status: '예정',
    homework: '',
    homework_checked: false,
    prep_done: true,
    memo: '',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 103,
    student: 3,
    student_name: '박민준',
    lesson_date: TOMORROW,
    start_time: '17:00',
    end_time: null,
    subject: '과학 시험 정리',
    location: '학생 집',
    method: '대면',
    status: '예정',
    homework: '시험 노트 정리',
    homework_checked: false,
    prep_done: false,
    memo: '',
    created_at: NOW,
    updated_at: NOW,
  },
];
