'use client';

import { CheckCircle, ChevronRight } from 'lucide-react';
import Card from '@/components/common/Card';
import type { Todo } from '@/lib/types';

interface TodayTodosProps {
  todos: Todo[];
  onToggle: (id: number, done: boolean) => void;
  onAddTodo: () => void;
}

export default function TodayTodos({ todos, onToggle, onAddTodo }: TodayTodosProps) {
  return (
    <section className="mb-6">
      <div className="text-[13px] font-semibold mb-2.5" style={{ color: '#222' }}>
        ✅ 오늘 할 일
      </div>

      {todos.length === 0 ? (
        <Card className="p-6 text-center" style={{ background: '#fafbfc' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2.5"
            style={{ background: '#e8faf0' }}
          >
            <CheckCircle size={24} color="#8FDCCF" />
          </div>
          <div className="text-[13px] font-semibold mb-1" style={{ color: '#222' }}>
            할 일이 없어요
          </div>
          <div className="text-[12px] mb-3" style={{ color: '#888' }}>
            할 일을 추가해서 체계적으로 관리하세요
          </div>
          <button
            onClick={onAddTodo}
            className="w-full py-2 rounded-lg text-[12px] font-medium text-white"
            style={{ background: '#8FDCCF' }}
          >
            할 일 추가
          </button>
        </Card>
      ) : (
        <div>
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 rounded-xl p-3.5 mb-2.5 bg-white border border-[#f0f0f0]"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
            >
              <button
                onClick={() => onToggle(todo.id, true)}
                className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                style={{ borderColor: '#8FDCCF', background: 'transparent' }}
              />
              <span className="text-[13px] flex-1" style={{ color: '#222' }}>
                {todo.text}
              </span>
              <ChevronRight size={16} color="#888" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
