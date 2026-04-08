'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Check, X, Calendar, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import AppHeader from '@/components/layout/AppHeader';
import TodoForm from '@/components/todo/TodoForm';
import type { Todo, TodoFormData } from '@/lib/types';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api';
import { groupTodosByDate, todayStr, fmtFull } from '@/lib/utils';
import { getHomeDashboard } from '@/lib/api';
import type { DashboardSummary } from '@/lib/types';

// ── 개별 할 일 아이템 ──────────────────────────────────────────────────────
function TodoItem({ todo, onToggle, onDelete, isTodayCard }: { todo: Todo; onToggle: () => void; onDelete: () => void; isTodayCard?: boolean }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('todoId', todo.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const textColor = isTodayCard ? '#4E342E' : (todo.done ? '#bbb' : '#333');
  const checkColor = isTodayCard ? '#B28900' : '#8FDCCF';

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        padding: isTodayCard ? '14px 16px' : '10px 0', 
        background: isTodayCard ? 'rgba(255, 255, 255, 0.35)' : 'transparent',
        borderRadius: isTodayCard ? '18px' : '0',
        border: isTodayCard ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
        borderBottom: isTodayCard ? 'none' : '1px solid #f2f2f2', 
        marginBottom: isTodayCard ? '10px' : '0',
        boxShadow: isTodayCard ? '0 4px 12px rgba(0,0,0,0.02)' : 'none',
        cursor: 'grab' 
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: 20, height: 20, borderRadius: '50%',
          border: `2px solid ${todo.done ? checkColor : (isTodayCard ? 'rgba(78, 52, 46, 0.2)' : '#e0e0e0')}`,
          background: todo.done ? checkColor : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        {todo.done && <Check size={12} color="#fff" strokeWidth={3} />}
      </button>
      <span style={{ 
        fontSize: 14, flex: 1, 
        color: textColor,
        textDecoration: todo.done ? 'line-through' : 'none',
        fontWeight: isTodayCard ? 600 : 400
      }}>
        {todo.text}
      </span>
      <button onClick={onDelete} style={{ background: 'none', border: 'none', color: isTodayCard ? 'rgba(78, 52, 46, 0.2)' : '#eee', cursor: 'pointer' }}>
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}

// ── 하루 단위 카드 ────────────────────────────────────────────────────────
function DailyCard({ group, onToggle, onDelete, onMoveTodo }: { group: any; onToggle: any; onDelete: any; onMoveTodo: (id: number, date: string) => void }) {
  const isToday = group.subLabel === '오늘';
  const [isExpanded, setIsExpanded] = useState(isToday || group.isOverdue);
  const [isDragOver, setIsDragOver] = useState(false);
  const pending = group.todos.filter((t: Todo) => !t.done);
  const completed = group.todos.filter((t: Todo) => t.done);
  const [showDone, setShowDone] = useState(false);

  const honeyYellow = 'linear-gradient(145deg, rgba(254, 243, 199, 0.95) 0%, rgba(254, 243, 199, 0.75) 100%)';
  const darkBrown = '#4E342E';   // 진한 브라운 텍스트

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!group.isOverdue) {
      setIsDragOver(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const todoId = e.dataTransfer.getData('todoId');
    if (todoId && !group.isOverdue) {
      onMoveTodo(Number(todoId), group.key);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      style={{ 
        background: isToday ? honeyYellow : 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: isToday ? 'none' : 'blur(10px)',
        WebkitBackdropFilter: isToday ? 'none' : 'blur(10px)',
        borderRadius: 32, 
        padding: isToday ? '24px 20px' : '20px', 
        marginBottom: 16,
        boxShadow: isToday ? '0 12px 36px rgba(254, 243, 199, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.5)' : '0 8px 24px rgba(0,0,0,0.03)',
        border: isDragOver ? '2px dashed #8FDCCF' : (group.isOverdue ? '1px solid #ffeaea' : '1px solid rgba(255, 255, 255, 0.6)'),
        transition: 'all 0.2s ease'
      }}
    >
      {/* 카드 헤더 */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: isExpanded ? (isToday ? 20 : 16) : 0 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isToday ? (
              <span style={{ fontSize: 16, fontWeight: 800, color: darkBrown }}>
                오늘 · {group.label}
              </span>
            ) : group.subLabel ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: group.isOverdue ? '#ff6b6b' : '#8FDCCF' }}>
                {group.isOverdue ? '이월' : group.subLabel}
              </span>
            ) : null}
            {!isToday && <span style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>{group.label}</span>}
          </div>
          {isToday && (
            <div style={{ fontSize: 13, color: darkBrown, marginTop: 4, fontWeight: 500, opacity: 0.9 }}>
              챙길 일 <span style={{ fontWeight: 800 }}>{pending.length}개</span>
              {completed.length > 0 && <span style={{ opacity: 0.6, marginLeft: 6 }}>· 완료 {completed.length}</span>}
            </div>
          )}
          {!isToday && !isExpanded && pending.length > 0 && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>할 일 {pending.length}개 남음</div>
          )}
        </div>
        {isExpanded ? <ChevronUp size={18} color={isToday ? darkBrown : "#ccc"} /> : <ChevronDown size={18} color={isToday ? darkBrown : "#ccc"} />}
      </div>

      {/* 카드 본문 */}
      {isExpanded && (
        <div>
          {pending.length === 0 && completed.length === 0 && (
            <div style={{ padding: '10px 0', fontSize: 13, color: '#bbb' }}>등록된 할 일이 없어요.</div>
          )}
          
          {pending.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} isTodayCard={isToday} onToggle={() => onToggle(todo.id, true)} onDelete={() => onDelete(todo.id)} />
          ))}

          {completed.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <button 
                onClick={() => setShowDone(!showDone)}
                style={{ background: 'none', border: 'none', color: isToday ? 'rgba(78, 52, 46, 0.4)' : '#ccc', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                완료됨 {completed.length}개 {showDone ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {showDone && completed.map((todo: Todo) => (
                <TodoItem key={todo.id} todo={todo} isTodayCard={isToday} onToggle={() => onToggle(todo.id, false)} onDelete={() => onDelete(todo.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────────────────
export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([getTodos(), getHomeDashboard()])
      .then(([todosData, dashboardData]) => {
        setTodos(todosData);
        setDashboard(dashboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
        setTodos([]);
        setDashboard(null);
        setLoading(false);
      });
  }, []);

  const groups = useMemo(() => groupTodosByDate(todos), [todos]);
  const thisWeekCount = todos.filter(t => !t.done).length; // 실제로는 날짜 필터링 필요

  // 자동 리마인더 생성
  const autoReminders = useMemo(() => {
    if (!dashboard) return [];

    const reminders = [];
    const { unpaid_payments = [], makeup_needed = [] } = dashboard;

    // 미납 리마인더
    if (unpaid_payments.length > 0) {
      reminders.push({
        key: 'unpaid',
        bg: '#ffeaea',
        icon: '💰',
        text: `${unpaid_payments.length}건 미납 확인 필요`
      });
    }

    // 보강 리마인더
    if (makeup_needed.length > 0) {
      reminders.push({
        key: 'makeup',
        bg: '#e8f4fd',
        icon: '🔄',
        text: `${makeup_needed.length}건 보강 일정 필요`
      });
    }

    return reminders;
  }, [dashboard]);

  const handleCreate = async (data: TodoFormData) => {
    if (!data.text || !data.text.trim()) {
      alert('할 일을 입력해주세요.');
      return;
    }

    try {
      const created = await createTodo(data);
      setTodos(prev => [created, ...prev]);
    } catch (error) {
      console.error('Failed to create todo:', error);
      alert('할 일 추가에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleToggle = async (id: number, done: boolean) => {
    try {
      const updated = await updateTodo(id, { done });
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleMoveTodo = async (id: number, newDate: string) => {
    try {
      const updated = await updateTodo(id, { due_date: newDate });
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (error) {
      console.error('Failed to move todo:', error);
    }
  };

  const jumpToDate = (date: string) => {
    const element = document.getElementById(`group-${date}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AppShell>
      <AppHeader greeting="오늘 할 일을 정리해요" />
      <div className="animate-fade-in" style={{ padding: '0 20px 100px', background: '#fcfcfc', minHeight: '100vh' }}>

        {/* 헤더 섹션 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.04em' }}>할 일</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4, fontWeight: 500 }}>이번 주 챙길 일 {thisWeekCount}개</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={() => dateInputRef.current?.showPicker()}
              style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
            >
              <Calendar size={18} color="#555" />
              <input 
                type="date" 
                ref={dateInputRef} 
                onChange={(e) => jumpToDate(e.target.value)} 
                style={{ position: 'absolute', opacity: 0, width: 0 }} 
              />
            </button>
            <button
              onClick={() => setFormOpen(true)}
              style={{ width: 44, height: 44, borderRadius: 14, background: '#8FDCCF', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 20px rgba(92,198,186,0.3)' }}
            >
              <X size={20} style={{ transform: 'rotate(45deg)' }} />
            </button>
          </div>
        </div>

        {/* 자동 리마인더 요약 카드 */}
        {autoReminders.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: 28, padding: '20px', marginBottom: 28, border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#ffb300', marginBottom: 12, letterSpacing: '0.06em' }}>AUTOMATIC REMINDERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {autoReminders.map(r => (
                <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: '1px solid rgba(255,255,255,0.4)' }}>{r.icon}</div>
                  <span style={{ fontSize: 13, color: '#444', fontWeight: 500 }}>{r.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 날짜별 그룹 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>일정 불러오는 중...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {groups.map(group => (
              <div key={group.key} id={`group-${group.key}`}>
                <DailyCard group={group} onToggle={handleToggle} onDelete={handleDelete} onMoveTodo={handleMoveTodo} />
              </div>
            ))}
          </div>
        )}
      </div>

      <TodoForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleCreate}
      />
    </AppShell>
  );
}
