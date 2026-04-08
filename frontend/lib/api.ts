import type {
  CancelMakeup,
  DashboardSummary,
  Lesson,
  Payment,
  Student,
  Todo,
  StudentBillingPolicy,
  StudentRegularSchedule,
  PaymentRequest,
  LessonFormData,
  StudentFormData,
  TodoFormData,
  PaymentFormData,
  CancelMakeupFormData,
} from './types';
import { buildMockDashboard } from './mock/dashboard';
import { MOCK_CANCEL_MAKEUPS } from './mock/cancelMakeups';
import { MOCK_LESSONS } from './mock/lessons';
import { MOCK_PAYMENTS } from './mock/payments';
import { MOCK_STUDENTS } from './mock/students';
import { MOCK_TODOS } from './mock/todos';
import { todayStr } from './utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const API_PREFIX = '/api';
const USE_MOCK = false; // [CRITICAL] Mock 모드를 강제로 비활성화하여 실제 API만 사용

const ENDPOINTS = {
  students: '/teacher/students/',
  lessons: '/teacher/classes/',
  todos: '/todos/',
  payments: '/payments/',
  cancelMakeups: '/cancel-makeups/',
  billingPolicies: '/billing-policies/',
  regularSchedules: '/regular-schedules/',
  paymentRequests: '/payment-requests/',
  homeSummary: '/home/summary',
  homeTodayClasses: '/home/today-classes',
  homeTodayTasks: '/home/today-tasks',
  homeAlerts: '/home/alerts',
  lessonDetail: (id: number) => `/lessons/${id}/`,
  lessonComplete: (id: number) => `/lessons/${id}/complete/`,
} as const;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

function normalizeList<T>(data: T[] | { results?: T[] } | unknown): T[] {
  return Array.isArray(data) ? data : [];
}

const mockStore = {
  students: [...MOCK_STUDENTS],
  lessons: [...MOCK_LESSONS],
  todos: [...MOCK_TODOS],
  payments: [...MOCK_PAYMENTS],
  cancelMakeups: [...MOCK_CANCEL_MAKEUPS],
};

const nextId = {
  student: Math.max(...mockStore.students.map(s => s.id), 0) + 1,
  lesson: Math.max(...mockStore.lessons.map(l => l.id), 0) + 1,
  todo: Math.max(...mockStore.todos.map(t => t.id), 0) + 1,
  payment: Math.max(...mockStore.payments.map(p => p.id), 0) + 1,
  cancel: Math.max(...mockStore.cancelMakeups.map(c => c.id), 0) + 1,
};

const nowIso = () => new Date().toISOString();

// ===== Students =====
export async function getStudents(): Promise<Student[]> {
  if (USE_MOCK) return [...mockStore.students];
  const data = await request<Student[]>(ENDPOINTS.students);
  return normalizeList<Student>(data);
}

export async function getStudent(id: number): Promise<Student | null> {
  if (USE_MOCK) return mockStore.students.find(s => s.id === id) ?? null;
  return request<Student>(`${ENDPOINTS.students}${id}/`);
}

export async function createStudent(payload: StudentFormData): Promise<Student> {
  if (USE_MOCK) {
    const created: Student = { id: nextId.student++, ...payload, created_at: nowIso(), updated_at: nowIso() };
    mockStore.students.push(created);
    return created;
  }
  return request<Student>(ENDPOINTS.students, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateStudent(id: number, payload: Partial<StudentFormData>): Promise<Student> {
  if (USE_MOCK) {
    const idx = mockStore.students.findIndex(s => s.id === id);
    if (idx < 0) throw new Error('Student not found');
    const updated = { ...mockStore.students[idx], ...payload, updated_at: nowIso() };
    mockStore.students[idx] = updated;
    return updated;
  }
  return request<Student>(`${ENDPOINTS.students}${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteStudent(id: number): Promise<void> {
  if (USE_MOCK) {
    mockStore.students = mockStore.students.filter(s => s.id !== id);
    return;
  }
  await request(`${ENDPOINTS.students}${id}/`, { method: 'DELETE' });
}

// ===== Lessons =====
export async function getLessons(params?: { date?: string; student?: number; status?: string }): Promise<Lesson[]> {
  if (USE_MOCK) {
    let items = [...mockStore.lessons];
    if (params?.date) items = items.filter(l => l.lesson_date === params.date);
    if (params?.student) items = items.filter(l => l.student === params.student);
    if (params?.status) items = items.filter(l => l.status === params.status);
    return items;
  }
  const query = new URLSearchParams();
  if (params?.date) query.set('class_date', params.date);
  if (params?.student) query.set('student', String(params.student));
  if (params?.status) query.set('status', params.status);
  const q = query.toString();
  const data = await request<Lesson[]>(`${ENDPOINTS.lessons}${q ? `?${q}` : ''}`);
  return normalizeList<Lesson>(data);
}

export async function createLesson(payload: LessonFormData): Promise<Lesson> {
  if (USE_MOCK) {
    const created: Lesson = {
      id: nextId.lesson++,
      ...payload,
      student_name: mockStore.students.find(s => s.id === payload.student)?.name,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    mockStore.lessons.push(created);
    return created;
  }
  
  // 프론트 필드명 -> 백엔드 필드명 매핑 (class_date, class_mode)
  const backendPayload: any = { ...payload };
  if ('lesson_date' in backendPayload) {
    backendPayload.class_date = backendPayload.lesson_date;
    delete backendPayload.lesson_date;
  }
  if ('method' in backendPayload) {
    backendPayload.class_mode = backendPayload.method;
    delete backendPayload.method;
  }
  
  return request<Lesson>(ENDPOINTS.lessons, { 
    method: 'POST', 
    body: JSON.stringify(backendPayload) 
  });
}

export async function getLesson(id: number): Promise<Lesson> {
  if (USE_MOCK) return mockStore.lessons.find(l => l.id === id)!;
  return request<Lesson>(ENDPOINTS.lessonDetail(id));
}

export async function updateLesson(id: number, payload: any): Promise<Lesson> {
  if (USE_MOCK) {
    const idx = mockStore.lessons.findIndex(l => l.id === id);
    if (idx < 0) throw new Error('Lesson not found');
    const updated = { ...mockStore.lessons[idx], ...payload, updated_at: nowIso() };
    mockStore.lessons[idx] = updated;
    return updated;
  }

  // 프론트 필드명 -> 백엔드 필드명 매핑
  const backendPayload: any = { ...payload };
  if ('lesson_date' in backendPayload) {
    backendPayload.class_date = backendPayload.lesson_date;
    delete backendPayload.lesson_date;
  }
  if ('method' in backendPayload) {
    backendPayload.class_mode = backendPayload.method;
    delete backendPayload.method;
  }

  return request<Lesson>(`${ENDPOINTS.lessons}${id}/`, { 
    method: 'PATCH', 
    body: JSON.stringify(backendPayload) 
  });
}

export async function deleteLesson(id: number): Promise<void> {
  if (USE_MOCK) {
    mockStore.lessons = mockStore.lessons.filter(l => l.id !== id);
    return;
  }
  await request(`${ENDPOINTS.lessons}${id}/`, { method: 'DELETE' });
}

// ===== Todos =====
export async function getTodos(params?: { due_date?: string; is_completed?: boolean; lesson?: number }): Promise<Todo[]> {
  if (USE_MOCK) {
    let items = [...mockStore.todos];
    if (params?.due_date) items = items.filter(t => t.due_date === params.due_date);
    if (typeof params?.is_completed === 'boolean') items = items.filter(t => t.done === params.is_completed);
    return items;
  }
  const query = new URLSearchParams();
  if (params?.due_date) query.set('task_date', params.due_date);
  if (typeof params?.is_completed === 'boolean') query.set('is_completed', String(params.is_completed));
  if (params?.lesson) query.set('lesson', String(params.lesson));
  const q = query.toString();
  const data = await request<Todo[]>(`${ENDPOINTS.todos}${q ? `?${q}` : ''}`);
  return normalizeList<Todo>(data);
}

export async function createTodo(payload: TodoFormData): Promise<Todo> {
  if (USE_MOCK) {
    const created: Todo = { id: nextId.todo++, ...payload, created_at: nowIso(), updated_at: nowIso() };
    mockStore.todos.push(created);
    return created;
  }
  return request<Todo>(ENDPOINTS.todos, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateTodo(id: number, payload: Partial<TodoFormData>): Promise<Todo> {
  if (USE_MOCK) {
    const idx = mockStore.todos.findIndex(t => t.id === id);
    if (idx < 0) throw new Error('Todo not found');
    const updated = { ...mockStore.todos[idx], ...payload, updated_at: nowIso() };
    mockStore.todos[idx] = updated;
    return updated;
  }
  // 프론트 필드명 (is_completed, due_date) -> 백엔드 필드명 (is_completed, task_date)
  const backendPayload: any = { ...payload };
  if ('done' in payload) {
    backendPayload.is_completed = payload.done;
    delete backendPayload.done;
  }
  if ('due_date' in payload) {
    backendPayload.task_date = payload.due_date;
    delete backendPayload.due_date;
  }
  if ('text' in payload) {
    backendPayload.title = payload.text;
    delete backendPayload.text;
  }
  return request<Todo>(`${ENDPOINTS.todos}${id}/`, { method: 'PATCH', body: JSON.stringify(backendPayload) });
}

export async function deleteTodo(id: number): Promise<void> {
  if (USE_MOCK) {
    mockStore.todos = mockStore.todos.filter(t => t.id !== id);
    return;
  }
  await request(`${ENDPOINTS.todos}${id}/`, { method: 'DELETE' });
}

// ===== Payments =====
export async function getPayments(params?: { student?: number }): Promise<Payment[]> {
  if (USE_MOCK) {
    let items = [...mockStore.payments];
    if (params?.student) items = items.filter(p => p.student === params.student);
    return items;
  }
  const query = new URLSearchParams();
  if (params?.student) query.set('student', String(params.student));
  const q = query.toString();
  const data = await request<Payment[]>(`${ENDPOINTS.payments}${q ? `?${q}` : ''}`);
  return normalizeList<Payment>(data);
}

export async function updatePayment(id: number, payload: Partial<PaymentFormData>): Promise<Payment> {
  if (USE_MOCK) {
    const idx = mockStore.payments.findIndex(p => p.id === id);
    if (idx < 0) throw new Error('Payment not found');
    const updated = { ...mockStore.payments[idx], ...payload, updated_at: nowIso() };
    mockStore.payments[idx] = updated;
    return updated;
  }
  return request<Payment>(`${ENDPOINTS.payments}${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
}

// ===== Cancel / Makeup =====
export async function getCancelMakeups(params?: { student?: number; makeup_done?: boolean }): Promise<CancelMakeup[]> {
  if (USE_MOCK) {
    let items = [...mockStore.cancelMakeups];
    if (params?.student) items = items.filter(c => c.student === params.student);
    if (typeof params?.makeup_done === 'boolean') items = items.filter(c => c.makeup_done === params.makeup_done);
    return items;
  }
  const query = new URLSearchParams();
  if (params?.student) query.set('student', String(params.student));
  if (typeof params?.makeup_done === 'boolean') query.set('makeup_done', String(params.makeup_done));
  const q = query.toString();
  const data = await request<CancelMakeup[]>(`${ENDPOINTS.cancelMakeups}${q ? `?${q}` : ''}`);
  return normalizeList<CancelMakeup>(data);
}

export async function createCancelMakeup(payload: CancelMakeupFormData): Promise<CancelMakeup> {
  if (USE_MOCK) {
    const created: CancelMakeup = {
      id: nextId.cancel++,
      ...payload,
      student_name: mockStore.students.find(s => s.id === payload.student)?.name,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    mockStore.cancelMakeups.push(created);
    return created;
  }
  return request<CancelMakeup>(ENDPOINTS.cancelMakeups, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateCancelMakeup(id: number, payload: Partial<CancelMakeupFormData>): Promise<CancelMakeup> {
  if (USE_MOCK) {
    const idx = mockStore.cancelMakeups.findIndex(c => c.id === id);
    if (idx < 0) throw new Error('CancelMakeup not found');
    const updated = { ...mockStore.cancelMakeups[idx], ...payload, updated_at: nowIso() };
    mockStore.cancelMakeups[idx] = updated;
    return updated;
  }
  return request<CancelMakeup>(`${ENDPOINTS.cancelMakeups}${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
}

// ===== Billing Policies =====
export async function getBillingPolicies(studentId?: number): Promise<StudentBillingPolicy[]> {
  const query = new URLSearchParams();
  if (studentId) query.set('student_id', String(studentId));
  const q = query.toString();
  const data = await request<StudentBillingPolicy[]>(`${ENDPOINTS.billingPolicies}${q ? `?${q}` : ''}`);
  return normalizeList<StudentBillingPolicy>(data);
}

export async function createBillingPolicy(payload: Partial<StudentBillingPolicy>): Promise<StudentBillingPolicy> {
  return request<StudentBillingPolicy>(ENDPOINTS.billingPolicies, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateBillingPolicy(id: number, payload: Partial<StudentBillingPolicy>): Promise<StudentBillingPolicy> {
  return request<StudentBillingPolicy>(`${ENDPOINTS.billingPolicies}${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteBillingPolicy(id: number): Promise<void> {
  await request(`${ENDPOINTS.billingPolicies}${id}/`, { method: 'DELETE' });
}

// ===== Regular Schedules =====
export async function getRegularSchedules(studentId?: number): Promise<StudentRegularSchedule[]> {
  const query = new URLSearchParams();
  if (studentId) query.set('student_id', String(studentId));
  const q = query.toString();
  const data = await request<StudentRegularSchedule[]>(`${ENDPOINTS.regularSchedules}${q ? `?${q}` : ''}`);
  return normalizeList<StudentRegularSchedule>(data);
}

export async function createRegularSchedule(payload: Partial<StudentRegularSchedule>): Promise<StudentRegularSchedule> {
  return request<StudentRegularSchedule>(ENDPOINTS.regularSchedules, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateRegularSchedule(id: number, payload: Partial<StudentRegularSchedule>): Promise<StudentRegularSchedule> {
  return request<StudentRegularSchedule>(`${ENDPOINTS.regularSchedules}${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteRegularSchedule(id: number): Promise<void> {
  await request(`${ENDPOINTS.regularSchedules}${id}/`, { method: 'DELETE' });
}

// ===== Payment Requests =====
export async function getPaymentRequests(params?: { student_id?: number; status?: string }): Promise<PaymentRequest[]> {
  const query = new URLSearchParams();
  if (params?.student_id) query.set('student_id', String(params.student_id));
  if (params?.status) query.set('status', params.status);
  const q = query.toString();
  const data = await request<PaymentRequest[]>(`${ENDPOINTS.paymentRequests}${q ? `?${q}` : ''}`);
  return normalizeList<PaymentRequest>(data);
}

export async function createPaymentRequest(payload: Partial<PaymentRequest>): Promise<PaymentRequest> {
  return request<PaymentRequest>(ENDPOINTS.paymentRequests, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updatePaymentRequest(id: number, payload: Partial<PaymentRequest>): Promise<PaymentRequest> {
  return request<PaymentRequest>(`${ENDPOINTS.paymentRequests}${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
}

// ===== Lesson Complete (auto-billing) =====
export async function completeLesson(id: number): Promise<{ status: string; lesson: Lesson }> {
  return request<{ status: string; lesson: Lesson }>(ENDPOINTS.lessonComplete(id), { method: 'POST' });
}

// ===== Home Dashboard =====
export async function getHomeSummary(): Promise<DashboardSummary> {
  if (USE_MOCK) return buildMockDashboard();
  return request<DashboardSummary>(ENDPOINTS.homeSummary);
}

export async function getTodayClasses(): Promise<Lesson[]> {
  if (USE_MOCK) return mockStore.lessons.filter(l => l.lesson_date === todayStr());
  const data = await request<Lesson[]>(ENDPOINTS.homeTodayClasses);
  return normalizeList<Lesson>(data);
}

export async function getTodayTasks(): Promise<Todo[]> {
  if (USE_MOCK) return mockStore.todos.filter(t => t.due_date === todayStr());
  const data = await request<Todo[]>(ENDPOINTS.homeTodayTasks);
  return normalizeList<Todo>(data);
}

export async function getHomeAlerts(): Promise<any[]> {
  if (USE_MOCK) return [];
  const data = await request<any[]>(ENDPOINTS.homeAlerts);
  return normalizeList<any>(data);
}

export async function getHomeDashboard(): Promise<DashboardSummary> {
  if (USE_MOCK) return buildMockDashboard();
  const [summary, today_todos, unpaid_payments, makeup_needed] = await Promise.all([
    getHomeSummary(),
    getTodayTasks(),
    getHomeAlerts().then(a => a.filter((i: any) => i.alert_type === 'payment')),
    getHomeAlerts().then(a => a.filter((i: any) => i.alert_type === 'makeup')),
  ]);
  return { ...summary, today_todos, unpaid_payments, makeup_needed };
}

// ===== API Object Adapters (for hooks) =====
export const studentsApi = {
  list: getStudents,
  get: getStudent,
  create: createStudent,
  update: updateStudent,
  delete: deleteStudent,
};

export const lessonsApi = {
  list: getLessons,
  create: createLesson,
  update: updateLesson,
  delete: deleteLesson,
};

export const todosApi = {
  list: getTodos,
  create: createTodo,
  update: updateTodo,
  delete: deleteTodo,
};

export const paymentsApi = {
  list: getPayments,
  update: updatePayment,
};

export const cancelMakeupsApi = {
  list: getCancelMakeups,
  create: createCancelMakeup,
  update: updateCancelMakeup,
};
