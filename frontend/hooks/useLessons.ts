'use client';

import { useState, useEffect, useCallback } from 'react';
import { lessonsApi } from '@/lib/api';
import type { Lesson, LessonFormData } from '@/lib/types';

export function useLessons(params?: { date?: string; student?: number }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await lessonsApi.list(params);
      setLessons(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.date, params?.student]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: LessonFormData) => {
    const created = await lessonsApi.create(data);
    setLessons(prev => [...prev, created]);
    return created;
  };

  const update = async (id: number, data: Partial<LessonFormData>) => {
    const updated = await lessonsApi.update(id, data);
    setLessons(prev => prev.map(l => l.id === id ? updated : l));
    return updated;
  };

  const remove = async (id: number) => {
    await lessonsApi.delete(id);
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  return { lessons, loading, error, refetch: fetch, create, update, remove };
}
