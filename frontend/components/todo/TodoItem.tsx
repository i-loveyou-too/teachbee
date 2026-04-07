'use client';

import { Check, X } from 'lucide-react';
import type { Todo } from '@/lib/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, done: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3 mb-1"
      style={{
        background: '#f7f8fa',
        opacity: todo.done ? 0.5 : 1,
      }}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.done)}
        className="w-[22px] h-[22px] rounded-full border-2 flex-shrink-0 flex items-center justify-center"
        style={{
          borderColor: '#8FDCCF',
          background: todo.done ? '#8FDCCF' : 'transparent',
        }}
      >
        {todo.done && <Check size={12} color="#fff" />}
      </button>

      <span
        className="text-[13px] flex-1"
        style={{
          color: '#222',
          textDecoration: todo.done ? 'line-through' : 'none',
        }}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        style={{ color: '#888' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
