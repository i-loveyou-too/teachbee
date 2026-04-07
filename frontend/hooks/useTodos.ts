'use client';

import { useState, useEffect, useCallback } from 'react';
import { todosApi } from '@/lib/api';
import type { Todo, TodoFormData } from '@/lib/types';

export function useTodos(params?: { due_date?: string; done?: boolean }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todosApi.list(params);
      setTodos(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.due_date, params?.done]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: TodoFormData) => {
    const created = await todosApi.create(data);
    setTodos(prev => [...prev, created]);
    return created;
  };

  const toggle = async (id: number, done: boolean) => {
    const updated = await todosApi.update(id, { done });
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
  };

  const remove = async (id: number) => {
    await todosApi.delete(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return { todos, loading, error, refetch: fetch, create, toggle, remove };
}
