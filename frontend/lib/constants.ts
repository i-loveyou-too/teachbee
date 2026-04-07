import type { StudentColorKey } from './types';

// ===== Design Tokens (mirrors CSS variables in globals.css) =====
export const COLORS = {
  accent: '#8FDCCF',
  accentLight: '#EEF9F6',
  bg: '#ffffff',
  surface: '#f7f8fa',
  text: '#222222',
  textSub: '#888888',
  coral: '#f0907e',
  yellow: '#f5c842',
  sky: '#7ec8e3',
  lilac: '#c4b5fd',
} as const;

// ===== Student Color System =====
export const STUDENT_COLOR_PALETTE: Record<StudentColorKey, { main: string; soft: string; chip: string; text: string }> = {
  mint: { main: '#8FDCCF', soft: '#EAF7F3', chip: '#DFF3EE', text: '#1E6F63' },
  peach: { main: '#F3A58E', soft: '#FFF1EC', chip: '#FFE3DA', text: '#A75C48' },
  sky: { main: '#8CBDEB', soft: '#EEF4FD', chip: '#DDEBFA', text: '#2E5F8C' },
  butter: { main: '#F4D47A', soft: '#FFF7E2', chip: '#FFEDBD', text: '#8E6A14' },
  gray: { main: '#B9C3D1', soft: '#F3F5F8', chip: '#E6EBF1', text: '#556170' },
};

export const DEFAULT_STUDENT_COLOR_KEY: StudentColorKey = 'gray';

// Mock default mapping by id (can be replaced by DB-driven color_key)
export const STUDENT_COLOR_BY_ID: Record<number, StudentColorKey> = {
  1: 'mint',
  2: 'peach',
  3: 'sky',
  4: 'butter',
};

export function getStudentPalette(colorKey?: StudentColorKey) {
  return STUDENT_COLOR_PALETTE[colorKey ?? DEFAULT_STUDENT_COLOR_KEY];
}

// ===== Badge color maps =====
export const PAYMENT_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  입금완료: { bg: '#e8faf0', text: '#2ba862', label: '입금완료' },
  미납: { bg: '#ffeaea', text: '#d94a4a', label: '미납' },
  부분입금: { bg: '#fff8e1', text: '#c49000', label: '부분입금' },
  대기: { bg: '#f0f0f0', text: '#888', label: '대기' },
};

export const LESSON_STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  완료: { bg: '#e8faf0', text: '#2ba862', label: '완료' },
  결석: { bg: '#ffeaea', text: '#d94a4a', label: '결석' },
  보강: { bg: '#e8f4fd', text: '#3a8fd4', label: '보강' },
  예정: { bg: '#f0f0f0', text: '#888', label: '예정' },
};

// ===== Routes =====
export const ROUTES = {
  home: '/home',
  onboarding: '/onboarding',
  calendar: '/calendar',
  students: '/students',
  studentDetail: (id: number) => `/students/${id}`,
  billing: '/billing',
  todo: '/todo',
  settings: '/settings',
} as const;

// ===== API =====
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ===== Korean Days =====
export const KO_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
