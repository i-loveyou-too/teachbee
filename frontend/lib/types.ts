// ===== Core Domain Types =====

export type PaymentStatus = '대기' | '입금완료' | '미납' | '부분입금';
export type LessonStatus = '예정' | '완료' | '결석' | '보강';
export type LessonMethod = '대면' | '온라인';
export type StudentColorKey = 'mint' | 'peach' | 'sky' | 'butter' | 'gray';
export type BillingKind = 'regular' | 'makeup' | 'absent' | 'extra';
export type MakeupPricingMode = 'free' | 'fixed' | 'same';
export type AbsencePricingMode = 'charge' | 'free';
export type PaymentRequestStatus = 'pending' | 'paid' | 'cancelled';

export interface Student {
  id: number;
  name: string;
  color_key?: StudentColorKey;
  phone: string;
  subject: string;
  regular_day: string;        // e.g. "월, 수, 금"
  regular_time: string;       // e.g. "15:00"
  default_location: string;
  lesson_method: LessonMethod;
  fee: number;
  payment_status: PaymentStatus;
  memo: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  student: number;            // FK -> Student.id
  student_name?: string;      // annotated from backend
  lesson_date: string;        // YYYY-MM-DD
  start_time: string;         // HH:MM
  end_time: string | null;
  subject: string;
  location: string;
  method: LessonMethod;
  status: LessonStatus;
  homework: string;
  homework_checked: boolean;
  prep_done: boolean;
  memo: string;
  billing_kind?: BillingKind;
  makeup_pricing_mode?: MakeupPricingMode;
  makeup_fee_amount?: number | null;
  counts_toward_cycle?: boolean;
  absence_pricing_mode?: AbsencePricingMode;
  billing_note?: string;
  created_at: string;
  updated_at: string;
}

export interface CancelMakeup {
  id: number;
  student: number;
  student_name?: string;
  original_lesson: number | null;
  cancel_date: string;
  cancel_reason: string;
  makeup_date: string;
  makeup_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: number;
  text: string;
  due_date: string;
  done: boolean;
  related_student: number | null;
  related_lesson: number | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  student: number;
  student_name?: string;
  amount: number;
  due_date: string;
  status: PaymentStatus;
  memo: string;
  created_at: string;
  updated_at: string;
}

export interface StudentBillingPolicy {
  id: number;
  student: number;
  billing_kind: BillingKind;
  cycle_lesson_count: number;
  fee_amount: number;
  is_active: boolean;
  memo: string;
  created_at: string;
}

export interface StudentRegularSchedule {
  id: number;
  student: number;
  day_of_week: number;
  day_of_week_display?: string;
  start_time: string;
  end_time: string | null;
  location: string;
  is_active: boolean;
}

export interface PaymentRequest {
  id: number;
  student: number;
  student_name: string;
  billing_policy: number | null;
  amount: number;
  status: PaymentRequestStatus;
  period_start: string | null;
  period_end: string | null;
  lesson_count: number;
  note: string;
  created_at: string;
  paid_at: string | null;
  classes?: Array<{
    id: number;
    lesson_id: number;
    lesson_date: string;
  }>;
}

// ===== API Response Wrappers =====

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ===== Form Input Types =====

export type StudentFormData = Omit<Student, 'id' | 'created_at' | 'updated_at'>;
export type LessonFormData = Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'student_name'>;
export type TodoFormData = Omit<Todo, 'id' | 'created_at' | 'updated_at'>;
export type PaymentFormData = Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'student_name'>;
export type CancelMakeupFormData = Omit<CancelMakeup, 'id' | 'created_at' | 'updated_at' | 'student_name'>;

// ===== UI State Types =====

export type TabType = 'home' | 'calendar' | 'students' | 'billing' | 'todo';

export interface DashboardSummary {
  today_lessons: Lesson[];
  today_todos: Todo[];
  unpaid_payments: Payment[];
  makeup_needed: CancelMakeup[];
  today_lessons_count: number;
  unpaid_count: number;
  makeup_needed_count: number;
  today_todos_count: number;
}

export type HomeStats = Pick<
  DashboardSummary,
  'today_lessons_count' | 'unpaid_count' | 'makeup_needed_count' | 'today_todos_count'
>;
