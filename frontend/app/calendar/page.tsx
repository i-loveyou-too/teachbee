'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import AppHeader from '@/components/layout/AppHeader';
import Modal from '@/components/common/Modal';
import { getLessons, getStudents, getTodos, updateLesson, createTodo, updateTodo } from '@/lib/api';
import type { Lesson, Student, StudentColorKey, Todo } from '@/lib/types';
import { KO_DAYS, DEFAULT_STUDENT_COLOR_KEY, STUDENT_COLOR_BY_ID, getStudentPalette } from '@/lib/constants';
import { dateToStr, fmtFull, todayStr } from '@/lib/utils';

const TODAY_STR = todayStr();
const TOMORROW_STR = dateToStr(new Date(Date.now() + 24 * 60 * 60 * 1000));

function buildMonth(baseDate: Date): Date[][] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(1 - firstDay.getDay());

  const weeks: Date[][] = [];
  let current = new Date(start);

  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: '#e8faf0', color: '#2ba862', label: '완료' },
  cancelled: { bg: '#ffeaea', color: '#d94a4a', label: '결석' },
  makeup_scheduled: { bg: '#e8f4fd', color: '#3a8fd4', label: '보강' },
  scheduled: { bg: '#f0f0f0', color: '#888', label: '예정' },
};

const MAX_DOTS = 4;

// ... (동일한 LessonCheckRow 선언 생략) ...

function LessonDetailModal({
  lesson: initialLesson,
  date,
  onClose,
  onRefresh,
}: {
  lesson: Lesson | null;
  date: string;
  onClose: () => void;
  onRefresh?: () => void;
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
    const data = await getTodos({ lesson: lid });
    setTasks(data);
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
    await createTodo({
      text: newTodoTitle,
      due_date: lesson.class_date || date,
      done: false,
      related_student: lesson.student,
      related_lesson: lesson.id,
    } as any);
    setNewTodoTitle('');
    fetchTasks(lesson.id);
  };

  const handleToggleTodo = async (id: number, done: boolean) => {
    const updated = await updateTodo(id, { done });
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const s = STATUS_STYLE[lesson.status] ?? STATUS_STYLE['scheduled'];

  return (
    <Modal open onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: '?????', value: lesson.subject || '-' },
          { label: '????', value: lesson.location || '-' },
          { label: '?????', value: lesson.method || '-' },
          { label: '????', value: lesson.homework || '-' },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#f7f8fa', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {(['?????????', '???? ?????'] as const).map(label => {
          const active = label === '?????????' ? lesson.prep_done : lesson.homework_checked;
          return (
            <button
              key={label}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                background: active ? '#EEF9F6' : '#f7f8fa',
                color: active ? '#8FDCCF' : '#888',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {active ? '????' : '???????'} {label}
            </button>
          );
        })}
      </div>

      {lesson.memo && (
        <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>?????{lesson.memo}</div>
      )}

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9aa', marginBottom: 8 }}>연결된 할일</div>
        {tasks.length === 0 ? (
          <div style={{ fontSize: 12, color: '#aaa', padding: '6px 2px' }}>연결된 할일이 없어요</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map(t => (
              <button
                key={t.id}
                onClick={() => handleToggleTodo(t.id, !t.done)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 12,
                  background: '#f7f8fa',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: `2px solid ${t.done ? '#8FDCCF' : '#d0d0d0'}`,
                    background: t.done ? '#8FDCCF' : 'transparent',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: t.done ? '#bbb' : '#333',
                    textDecoration: t.done ? 'line-through' : 'none',
                  }}
                >
                  {t.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {lesson.status === '????' && (
          <>
            <button style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: '#8FDCCF', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
              ???? ????
            </button>
            <button style={{ padding: '10px 16px', borderRadius: 12, background: '#ffeaea', color: '#d94a4a', fontSize: 13, border: 'none', cursor: 'pointer' }}>
              ?????
            </button>
          </>
        )}
        <button style={{ padding: '10px 16px', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}>
          ????
        </button>
      </div>
      <button onClick={onClose} style={{ width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}>
        ????
      </button>
    </Modal>
  );
}

function AddLessonModal({ date, onClose }: { date: string; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title="수업 추가">
      <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
        날짜: {date}
      </div>
      <select
        style={{ width: '100%', borderRadius: 12, padding: 12, marginBottom: 12, border: '1px solid #eee', background: '#f7f8fa', fontSize: 13 }}
      >
        <option value="">학생 선택</option>
        <option>김지민</option>
        <option>이수진</option>
        <option>박민준</option>
      </select>
      <input
        type="time"
        defaultValue="15:00"
        style={{ width: '100%', borderRadius: 12, padding: 12, marginBottom: 12, border: '1px solid #eee', background: '#f7f8fa', fontSize: 13 }}
      />
      <input
        placeholder="과목"
        style={{ width: '100%', borderRadius: 12, padding: 12, marginBottom: 12, border: '1px solid #eee', background: '#f7f8fa', fontSize: 13 }}
      />
      <input
        placeholder="장소"
        style={{ width: '100%', borderRadius: 12, padding: 12, marginBottom: 16, border: '1px solid #eee', background: '#f7f8fa', fontSize: 13 }}
      />
      <button
        onClick={onClose}
        style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#8FDCCF', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
      >
        추가하기
      </button>
      <button
        onClick={onClose}
        style={{ width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}
      >
        취소
      </button>
    </Modal>
  );
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [viewDate, setViewDate] = useState(new Date());
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const weeks = useMemo(() => buildMonth(viewDate), [viewDate]);

  useEffect(() => {
    let mounted = true;
    Promise.all([getLessons(), getStudents()])
      .then(([lessonsData, studentsData]) => {
        if (!mounted) return;
        setLessons(lessonsData);
        setStudents(studentsData);
      })
      .catch(() => {
        if (!mounted) return;
        setLessons([]);
        setStudents([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(viewDate.getMonth() + offset);
    setViewDate(next);
  };

  const studentColorById = useMemo(() => {
    const map = new Map<number, StudentColorKey>();
    students.forEach(s => {
      const key = s.color_key ?? STUDENT_COLOR_BY_ID[s.id] ?? DEFAULT_STUDENT_COLOR_KEY;
      map.set(s.id, key);
    });
    return map;
  }, [students]);

  const lessonsByDate = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons.forEach(l => {
      if (!map[l.lesson_date]) map[l.lesson_date] = [];
      map[l.lesson_date].push(l);
    });
    return map;
  }, [lessons]);

  const dayLessons = (lessonsByDate[selectedDate] ?? [])
    .slice()
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const getPaletteForStudent = (studentId?: number) => {
    const key = studentId ? (studentColorById.get(studentId) ?? STUDENT_COLOR_BY_ID[studentId]) : undefined;
    return getStudentPalette(key ?? DEFAULT_STUDENT_COLOR_KEY);
  };

  const selectedBadge = selectedDate === TODAY_STR ? '오늘' : (selectedDate === TOMORROW_STR ? '내일' : null);

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const palette = getPaletteForStudent(lesson.student);
    const status = STATUS_STYLE[lesson.status] ?? { bg: '#f0f0f0', color: '#888' };
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
          {lesson.status}
        </span>
      </div>
    );
  };

  return (
    <AppShell>
      <AppHeader greeting="수업 일정을 확인하세요" />

      <div className="animate-fade-in" style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.03em' }}>
            {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 4,
              background: '#f7f8fa',
              borderRadius: 999,
              border: '1px solid #eef0f3',
            }}
          >
            <button
              onClick={() => changeMonth(-1)}
              style={{
                minWidth: 56,
                height: 30,
                padding: '0 12px',
                borderRadius: 999,
                border: 'none',
                background: 'transparent',
                color: '#666',
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              이전
            </button>
            <button
              onClick={() => setViewDate(new Date())}
              style={{
                minWidth: 56,
                height: 30,
                padding: '0 12px',
                borderRadius: 999,
                border: 'none',
                background: '#FFF5D6',
                color: '#8E6A14',
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(244,212,122,0.35)',
              }}
            >
              오늘
            </button>
            <button
              onClick={() => changeMonth(1)}
              style={{
                minWidth: 56,
                height: 30,
                padding: '0 12px',
                borderRadius: 999,
                border: 'none',
                background: 'transparent',
                color: '#666',
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              다음
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: '16px 12px', boxShadow: '0 10px 26px rgba(0,0,0,0.06)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 12 }}>
            {KO_DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: d === '일' ? '#ff6b6b' : d === '토' ? '#4dabf7' : '#adb5bd' }}>
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
              {week.map((date, dIdx) => {
                const ds = dateToStr(date);
                const isToday = ds === TODAY_STR;
                const isSelected = ds === selectedDate;
                const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                const dayLessons = lessonsByDate[ds] ?? [];
                const studentIds = Array.from(new Set(dayLessons.map(l => l.student)));
                const hasLesson = studentIds.length > 0;
                const overflow = studentIds.length - MAX_DOTS;

                return (
                  <div
                    key={dIdx}
                    onClick={() => setSelectedDate(ds)}
                    style={{
                      aspectRatio: '1 / 1.1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      paddingTop: 6,
                      paddingBottom: 6,
                      gap: 4,
                      cursor: 'pointer',
                      borderRadius: 12,
                      background: isSelected ? 'rgba(143, 220, 207, 0.22)' : 'transparent',
                      border: isSelected ? '1px solid rgba(143, 220, 207, 0.55)' : '1px solid transparent',
                      boxShadow: isSelected ? '0 6px 14px rgba(143, 220, 207, 0.18)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: isToday || isSelected ? 700 : 500,
                        color: isSelected ? '#1a1a1a' : !isCurrentMonth ? '#eee' : isToday ? '#8FDCCF' : '#444',
                      }}
                    >
                      {date.getDate()}
                    </span>
                    {hasLesson && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
                        {studentIds.slice(0, MAX_DOTS).map(id => {
                          const palette = getPaletteForStudent(id);
                          return (
                            <span
                              key={id}
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: palette.main,
                                boxShadow: isSelected ? '0 0 0 1px rgba(255,255,255,0.9)' : 'none',
                              }}
                            />
                          );
                        })}
                        {overflow > 0 && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: isSelected ? '#fff' : '#999' }}>+{overflow}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
              onClick={() => setAddOpen(true)}
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
              {dayLessons.map(l => (
                <LessonCard key={l.id} lesson={l} />
              ))}
            </div>
          )}
        </div>
      </div>

      {addOpen && <AddLessonModal date={selectedDate} onClose={() => setAddOpen(false)} />}
      <LessonDetailModal
        lesson={selectedLesson}
        date={selectedDate}
        onClose={() => setSelectedLesson(null)}
      />
    </AppShell>
  );
}
