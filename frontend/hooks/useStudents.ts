'use client';

import { useState, useEffect, useCallback } from 'react';
import { studentsApi } from '@/lib/api';
import type { Student, StudentFormData } from '@/lib/types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentsApi.list();
      setStudents(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: StudentFormData) => {
    const created = await studentsApi.create(data);
    setStudents(prev => [...prev, created]);
    return created;
  };

  const update = async (id: number, data: Partial<StudentFormData>) => {
    const updated = await studentsApi.update(id, data);
    setStudents(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  };

  const remove = async (id: number) => {
    await studentsApi.delete(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return { students, loading, error, refetch: fetch, create, update, remove };
}
