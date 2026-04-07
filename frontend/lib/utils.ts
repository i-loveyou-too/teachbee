import { KO_DAYS } from './constants';
import type { Todo } from './types';

// YYYY-MM-DD 형태의 오늘 날짜
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// Date -> YYYY-MM-DD
export function dateToStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// YYYY-MM-DD -> "4월7일(화)"
export function fmtFull(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dow = KO_DAYS[d.getDay()];
  return `${month}월${day}일(${dow})`;
}

// YYYY-MM-DD -> "4/7"
export function fmtShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// 숫자 -> "50,000원"
export function fmtMoney(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// 오늘 기준 4주(28일) 배열 생성 [주[일]]
export function buildFourWeeks(from: Date = new Date()): Date[][] {
  const weeks: Date[][] = [];
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);

  for (let w = 0; w < 4; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      week.push(date);
    }
    weeks.push(week);
  }
  return weeks;
}

// classNames 유틸
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// 오늘 기준 +n일의 YYYY-MM-DD
export function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dateToStr(d);
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayStr();
}

export function isTomorrow(dateStr: string): boolean {
  return dateStr === addDays(1);
}

export function isDayAfterTomorrow(dateStr: string): boolean {
  return dateStr === addDays(2);
}

// 모레보다 이후인지 (오늘+3 이상)
export function isFuture(dateStr: string): boolean {
  return dateStr > addDays(2);
}

export function sortTodosByDueDate(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => a.due_date.localeCompare(b.due_date));
}

export interface TodoGroup {
  key: string;
  label: string;
  subLabel?: string;
  todos: Todo[];
  isOverdue?: boolean;
  isDone?: boolean;
}

// 할 일을 날짜/상태별로 그룹핑
export function groupTodosByDate(todos: Todo[]): TodoGroup[] {
  const today = todayStr();
  const groups: TodoGroup[] = [];

  const overdue = todos.filter(t => !t.done && t.due_date < today);
  if (overdue.length > 0) {
    groups.push({ key: 'overdue', label: '미처리', todos: overdue, isOverdue: true });
  }

  const upcoming = todos.filter(t => t.due_date >= today);
  const dateGroups: Record<string, Todo[]> = {};
  upcoming.forEach(t => {
    if (!dateGroups[t.due_date]) dateGroups[t.due_date] = [];
    dateGroups[t.due_date].push(t);
  });

  Object.keys(dateGroups).sort().forEach(date => {
    const d = new Date(date + 'T00:00:00');
    let label = `${d.getMonth() + 1}월${d.getDate()}일 ${KO_DAYS[d.getDay()]}요일`;
    let subLabel = '';
    if (date === today) subLabel = '오늘';
    else if (date === addDays(1)) subLabel = '내일';
    else if (date === addDays(2)) subLabel = '모레';

    groups.push({ key: date, label, subLabel, todos: dateGroups[date] });
  });

  return groups;
}

// 해당 날짜가 속한 주의 월~일 배열 반환
export function getWeekDays(baseDate: Date): Date[] {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0(일) ~ 6(토)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일 기준

  const monday = new Date(d.setDate(diff));
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const temp = new Date(monday);
    temp.setDate(monday.getDate() + i);
    week.push(temp);
  }
  return week;
}
