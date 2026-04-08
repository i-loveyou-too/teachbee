'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Check, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import AppHeader from '@/components/layout/AppHeader';
import Modal from '@/components/common/Modal';
import LessonFormSheet from '@/components/lessons/LessonFormSheet';
import { getHomeDashboard, getLessons, updateTodo, updateLesson, getTodos, createTodo, completeLesson } from '@/lib/api';
import type { DashboardSummary, Lesson, Todo } from '@/lib/types';
import { DEFAULT_STUDENT_COLOR_KEY, STUDENT_COLOR_BY_ID, getStudentPalette } from '@/lib/constants';
import { todayStr } from '@/lib/utils';

const TODAY = new Date();
const TODAY_STR = todayStr();
const KO_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function dateToStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fmtFull(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${KO_DAYS[d.getDay()]})`;
}

function buildOneWeek(): Date[] {
  const days: Date[] = [];
  const base = new Date(TODAY);
  base.setHours(0, 0, 0, 0);
  for (let d = 0; d < 7; d++) {
    const date = new Date(base);
    date.setDate(base.getDate() + d);
    days.push(date);
  }
  return days;
}

// ── 수업 상세 내 체크 컴포넌트 ──────────────────────────────────────────
function LessonCheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <div 
      onClick={onToggle}
      style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '14px 16px', borderRadius: 18, background: checked ? '#EEF9F6' : 'rgba(255,255,255,0.5)',
        border: checked ? '1.5px solid #8FDCCF' : '1.5px solid rgba(0,0,0,0.05)',
        cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color: checked ? '#1a4a44' : '#666' }}>{label}</span>
      <div style={{ 
        width: 24, height: 24, borderRadius: '50%', background: checked ? '#8FDCCF' : '#eee',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </div>
    </div>
  );
}

function LessonDetailModal({
  lesson: initialLesson,
  date,
  onClose,
  onRefresh,
  onEdit,
}: {
  lesson: Lesson | null;
  date: string;
  onClose: () => void;
  onRefresh?: () => void;
  onEdit?: (lesson: Lesson) => void;
}) {
  const [lesson, setLesson] = useState<Lesson | null>(initialLesson);
  const [memo, setMemo] = useState(initialLesson?.memo || '');
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    setLesson(initialLesson);
    setMemo(initialLesson?.memo || '');
    if (initialLesson) fetchTasks(initialLesson.id);
  }, [initialLesson]);

  const fetchTasks = async (lid: number) => {
    try {
      const data = await getTodos({ lesson: lid });
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    }
  };

  if (!lesson) return null;

  const handlePatch = async (data: any) => {
    try {
      const updated = await updateLesson(lesson.id, data);
      setLesson(updated);
      onRefresh?.();
    } catch (err) { console.error(err); }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;
    try {
      await createTodo({
        text: newTodoTitle,
        due_date: lesson.lesson_date || date,
        done: false,
        related_student: lesson.student,
        related_lesson: lesson.id,
      } as any);
      setNewTodoTitle('');
      fetchTasks(lesson.id);
    } catch (error) {
      console.error('Failed to add todo:', error);
      alert('할 일 추가에 실패했습니다.');
    }
  };

  const statusInfo: Record<string, { bg: string; color: string; label: string }> = {
    '완료': { bg: '#e8faf0', color: '#2ba862', label: '완료' },
    '결석': { bg: '#ffeaea', color: '#d94a4a', label: '결석' },
    '예정': { bg: '#f0f0f0', color: '#888', label: '예정' },
    '보강': { bg: '#e8f4fd', color: '#3a8fd4', label: '보강' },
  };
  const s = statusInfo[lesson.status] ?? statusInfo['예정'];

  return (
    <Modal open onClose={onClose}>
      {/* 상단 헤더 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>{lesson.student_name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#888' }}>{date} {lesson.start_time}</span>
          <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
            {s.label}
          </span>
        </div>
      </div>

      {/* 정보 카드 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: '과목', value: lesson.subject || '-' },
          { label: '장소', value: lesson.location || '-' },
          { label: '방식', value: lesson.method === '대면' ? '대면' : '온라인' },
          { label: '메모', value: lesson.memo || '-' },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card" style={{ padding: 12, borderRadius: 16 }}>
            <div style={{ fontSize: 11, color: '#9aa', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 체크 섹션 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <LessonCheckRow
          label="수업 자료 준비"
          checked={!!lesson.prep_done}
          onToggle={() => handlePatch({ prep_done: !lesson.prep_done })}
        />
        <LessonCheckRow
          label="숙제 검사"
          checked={!!lesson.homework_checked}
          onToggle={() => handlePatch({ homework_checked: !lesson.homework_checked })}
        />
      </div>

      {/* 메모 섹션 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa', marginBottom: 8, paddingLeft: 4 }}>수업 메모</div>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          onBlur={() => handlePatch({ memo })}
          placeholder="특이사항을 메모하세요"
          style={{ width: '100%', borderRadius: 18, padding: 16, background: '#f7f8fa', border: 'none', fontSize: 13, minHeight: 80, resize: 'none' }}
        />
      </div>

      {/* 연결된 할 일 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa', marginBottom: 10, paddingLeft: 4 }}>연결된 할 일</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {tasks.map(t => (
            <div key={t.id} style={{ fontSize: 13, color: '#444', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.done ? '#ccc' : '#8FDCCF' }} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>{t.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input 
            value={newTodoTitle} 
            onChange={e => setNewTodoTitle(e.target.value)}
            placeholder="할 일을 입력하세요" 
            style={{ flex: 1, borderRadius: 12, padding: '10px 14px', border: '1px solid #eee', fontSize: 13 }}
          />
          <button onClick={handleAddTodo} style={{ padding: '0 16px', borderRadius: 12, background: '#EEF9F6', color: '#8FDCCF', fontSize: 12, fontWeight: 800 }}>추가</button>
        </div>
      </div>

      {/* 하단 액션 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={async () => {
            try {
              await completeLesson(lesson.id);
              onRefresh?.();
              onClose();
            } catch (err) {
              console.error('Failed to complete lesson:', err);
              alert('수업 완료 처리에 실패했습니다.');
            }
          }}
          style={{ flex: 1, padding: '14px 0', borderRadius: 18, background: '#8FDCCF', color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer' }}
        >
          수업 완료
        </button>
        <button
          onClick={() => handlePatch({ status: '결석' })}
          style={{ padding: '14px 20px', borderRadius: 18, background: '#ffeaea', color: '#d94a4a', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer' }}
        >
          결석
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={() => {
            if (lesson) {
              onEdit?.(lesson);
              onClose();
            }
          }}
          style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: '#e8f4fd', color: '#3a8fd4', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          수정
        </button>
        <button onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}>
          닫기
        </button>
      </div>
    </Modal>
  );
}

function AddMenuModal({ onClose, onAddLesson }: { onClose: () => void; onAddLesson: () => void }) {
  const items = [
    { icon: '+', label: '수업 추가', bg: '#EEF9F6', action: 'addLesson' },
    { icon: '+', label: '학생 추가', bg: '#fff8e1', action: 'addStudent' },
    { icon: '+', label: '할 일 추가', bg: '#e8f4fd', action: 'addTodo' },
    { icon: '+', label: '보강 등록', bg: '#ffeaea', action: 'addMakeup' },
  ];

  const handleItemClick = (action: string) => {
    if (action === 'addLesson') {
      onAddLesson();
    }
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="추가하기">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {items.map(({ icon, label, bg, action }) => (
          <button
            key={label}
            onClick={() => handleItemClick(action)}
            style={{
              borderRadius: 20,
              padding: 16,
              textAlign: 'left',
              border: '1px solid #f0f0f0',
              background: '#fff',
              cursor: 'pointer',
              boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 18 }}>
              {icon}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{label}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        style={{ width: '100%', marginTop: 16, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}
      >
        닫기
      </button>
    </Modal>
  );
}

export default function HomePage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);

  const oneWeek = useMemo(() => buildOneWeek(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [dashboardData, lessonsData] = await Promise.all([getHomeDashboard(), getLessons()]);
        if (mounted) {
          setDashboard(dashboardData);
          setTodos(dashboardData.today_todos);
          setLessons(lessonsData);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        if (mounted) {
          setDashboard(null);
          setLessons([]);
          setTodos([]);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [dashboardData, lessonsData] = await Promise.all([getHomeDashboard(), getLessons()]);
      setDashboard(dashboardData);
      setTodos(dashboardData.today_todos);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Failed to reload dashboard data:', error);
      setDashboard(null);
      setLessons([]);
      setTodos([]);
    }
  }, []);

  const lessonsByDate = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons.forEach(lesson => {
      const dateKey = lesson.lesson_date;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(lesson);
    });
    return map;
  }, [lessons]);

  const dayLessons = (lessonsByDate[selectedDate] ?? [])
    .slice()
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  const todayLessons = lessonsByDate[TODAY_STR] ?? [];

  const pendingTodos = todos.filter(t => !t.done && t.text && t.text.trim() !== '');
  const doneTodos = todos.filter(t => t.done && t.text && t.text.trim() !== '');

  const unpaidPayments = dashboard?.unpaid_payments ?? [];
  const makeupNeeded = dashboard?.makeup_needed ?? [];

  const stats = [
    { value: todayLessons.length, label: '수업', color: '#8FDCCF' },
    { value: unpaidPayments.length, label: '미납', color: '#f0907e' },
    { value: makeupNeeded.length, label: '보강', color: '#7ec8e3' },
    { value: pendingTodos.length, label: '할 일', color: '#f5c842' },
  ];

  const cardShell = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    boxShadow: '0 10px 26px rgba(0,0,0,0.06)',
  };

  const getPaletteForStudent = (studentId?: number) => {
    const key = studentId ? STUDENT_COLOR_BY_ID[studentId] : undefined;
    return getStudentPalette(key ?? DEFAULT_STUDENT_COLOR_KEY);
  };

  const selectedBadge = selectedDate === TODAY_STR ? '오늘' : null;

  const lessonStatusStyle: Record<string, { bg: string; color: string; label: string }> = {
    완료: { bg: '#e8faf0', color: '#2ba862', label: '완료' },
    결석: { bg: '#ffeaea', color: '#d94a4a', label: '결석' },
    보강: { bg: '#e8f4fd', color: '#3a8fd4', label: '보강' },
    예정: { bg: '#f0f0f0', color: '#888', label: '예정' },
  };

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const palette = getPaletteForStudent(lesson.student);
    const status = lessonStatusStyle[lesson.status] ?? lessonStatusStyle['예정'];

    return (
      <div
        onClick={() => setSelectedLesson(lesson)}
        style={{
          borderRadius: 22,
          padding: '14px 16px',
          background: palette.soft,
          border: `1px solid ${palette.chip}`,
          boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{ width: 6, alignSelf: 'stretch', borderRadius: 999, background: palette.main }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.main }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>
                {lesson.student_name ?? '학생'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: palette.chip,
                  color: palette.text,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '-0.1px',
                }}
              >
                {lesson.start_time}
              </span>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>
                {lesson.end_time ?? '종료 미정'} · {lesson.subject}
                {lesson.location ? ` · ${lesson.location}` : ''}
              </span>
            </div>
          </div>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            background: status.bg,
            color: status.color,
            flexShrink: 0,
          }}
        >
          {status.label}
        </span>
      </div>
    );
  };

  const toggleTodo = async (id: number, done: boolean) => {
    try {
      const updated = await updateTodo(id, { done });
      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch {
      setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, done } : todo)));
    }
  };

  return (
    <AppShell>
      <AppHeader greeting="오늘도 좋은 수업 되세요 🍯" />

      <div className="animate-fade-in" style={{ padding: '12px 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="glass-card" style={{ ...cardShell, padding: '16px 12px', borderRadius: 28 }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {oneWeek.map(date => {
              const ds = dateToStr(date);
              const isToday = ds === TODAY_STR;
              const isSelected = ds === selectedDate;
              const count = (lessonsByDate[ds] ?? []).length;
              const hasLesson = count > 0;
              return (
                <button
                  key={ds}
                  onClick={() => setSelectedDate(ds)}
                  style={{
                    flexShrink: 0,
                    width: 52,
                    borderRadius: 20,
                    padding: '12px 0',
                    textAlign: 'center',
                    background: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.4)',
                    border: isSelected ? '1.5px solid rgba(255,255,255,0.4)' : (!isSelected && isToday ? '1.5px solid var(--accent)' : '1.5px solid rgba(255,255,255,0.6)'),
                    boxShadow: isSelected ? '0 8px 16px rgba(105,231,216,0.25)' : '0 4px 12px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div style={{ fontSize: 11, color: isSelected ? '#fff' : '#aaa', fontWeight: 800 }}>
                    {KO_DAYS[date.getDay()]}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isSelected ? '#fff' : '#1a1a1a', marginTop: 4 }}>
                    {date.getDate()}
                  </div>
                  {hasLesson && (
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: isSelected ? '#fff' : 'var(--accent)',
                        margin: '4px auto 0',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card" style={{ ...cardShell, padding: '24px 20px', borderRadius: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#9aa', letterSpacing: '0.1em' }}>SCHEDULE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>
                  {fmtFull(selectedDate)}
                </div>
                {selectedBadge && (
                  <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, background: '#FFF5D6', color: '#8E6A14' }}>
                    {selectedBadge}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setAddMenuOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                background: '#EEF9F6',
                color: '#8FDCCF',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + 수업 추가
            </button>
          </div>

          {dayLessons.length === 0 ? (
            <div
              style={{
                borderRadius: 18,
                padding: '18px 16px',
                textAlign: 'center',
                fontSize: 13,
                background: '#f7f8fa',
                color: '#888',
              }}
            >
              선택한 날짜에 수업이 없어요
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dayLessons.map(lesson => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ ...cardShell, padding: '22px 20px', borderRadius: 30 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#9aa', letterSpacing: '0.1em', marginBottom: 12 }}>
            DASHBOARD SUMMARY
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {stats.map(({ value, label, color }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: 18,
                  padding: '16px 0',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 900, color, marginBottom: 2, letterSpacing: '-0.05em' }}>{value}</div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {(pendingTodos.length > 0 || doneTodos.length > 0) && (
          <div className="glass-card" style={{ ...cardShell, padding: '24px 20px', borderRadius: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>오늘 할 일</div>
              <div style={{ fontSize: 12, color: '#f5c842', fontWeight: 800 }}>{pendingTodos.length}개 남음</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingTodos.map(todo => (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    borderRadius: 18,
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <button
                    onClick={() => toggleTodo(todo.id, true)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: '2.5px solid var(--accent)',
                      background: 'transparent',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: 14, color: '#222', flex: 1, fontWeight: 500 }}>{todo.text}</span>
                </div>
              ))}
              {doneTodos.map(todo => (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    borderRadius: 18,
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    opacity: 0.6,
                  }}
                >
                  <button
                    onClick={() => toggleTodo(todo.id, false)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      flexShrink: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </button>
                  <span style={{ fontSize: 14, color: '#888', flex: 1, textDecoration: 'line-through' }}>{todo.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(unpaidPayments.length > 0 || makeupNeeded.length > 0) && (
          <div className="glass-card" style={{ ...cardShell, padding: '24px 20px', borderRadius: 32 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginBottom: 18 }}>정산 처리 필요</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {unpaidPayments.slice(0, 2).map((s, idx) => (
                <div
                  key={`unpaid-${s.student_name}-${s.amount}`}
                  style={{
                    borderRadius: 20,
                    padding: '16px',
                    background: 'rgba(255, 245, 245, 0.6)',
                    border: '1px solid rgba(255, 235, 235, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#d94a4a' }}>{s.student_name} 미납</div>
                    <div style={{ fontSize: 12, color: '#d94a4a', opacity: 0.8, marginTop: 2 }}>{(s as any).amount.toLocaleString()}원 결제 필요</div>
                  </div>
                  <ChevronRight size={18} color="#d94a4a" />
                </div>
              ))}
              {makeupNeeded.slice(0, 2).map(c => (
                <div
                  key={c.id}
                  style={{
                    borderRadius: 20,
                    padding: '16px',
                    background: 'rgba(240, 249, 255, 0.6)',
                    border: '1px solid rgba(224, 242, 254, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#3a8fd4' }}>{c.student_name} 보강</div>
                    <div style={{ fontSize: 12, color: '#3a8fd4', opacity: 0.8, marginTop: 2 }}>결석일 {c.cancel_date}</div>
                  </div>
                  <ChevronRight size={18} color="#3a8fd4" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setAddMenuOpen(true)}
        style={{
          position: 'fixed',
          width: 58,
          height: 58,
          borderRadius: 24,
          background: 'rgba(92, 198, 186, 0.9)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          bottom: 100,
          right: 20,
          boxShadow: '0 12px 32px rgba(92,198,186,0.4), inset 0 2px 2px rgba(255,255,255,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontWeight: 300,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        +
      </button>

      <LessonDetailModal
        lesson={selectedLesson}
        date={selectedDate}
        onClose={() => setSelectedLesson(null)}
        onRefresh={loadData}
        onEdit={(lesson) => {
          setEditingLesson(lesson);
          setLessonFormOpen(true);
        }}
      />

      <LessonFormSheet
        open={lessonFormOpen}
        lesson={editingLesson}
        onClose={() => {
          setLessonFormOpen(false);
          setEditingLesson(null);
        }}
        onSuccess={() => {
          setSelectedLesson(null);
          loadData();
        }}
      />

      {addMenuOpen && (
        <AddMenuModal
          onClose={() => setAddMenuOpen(false)}
          onAddLesson={() => {
            setEditingLesson(null);
            setLessonFormOpen(true);
          }}
        />
      )}
    </AppShell>
  );
}
