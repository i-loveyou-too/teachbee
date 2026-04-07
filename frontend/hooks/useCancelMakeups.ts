'use client';

import { useState, useEffect, useCallback } from 'react';
import { cancelMakeupsApi } from '@/lib/api';
import type { CancelMakeup, CancelMakeupFormData } from '@/lib/types';

export function useCancelMakeups(params?: { student?: number; makeup_done?: boolean }) {
  const [cancelMakeups, setCancelMakeups] = useState<CancelMakeup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cancelMakeupsApi.list(params);
      setCancelMakeups(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.student, params?.makeup_done]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CancelMakeupFormData) => {
    const created = await cancelMakeupsApi.create(data);
    setCancelMakeups(prev => [...prev, created]);
    return created;
  };

  const update = async (id: number, data: Partial<CancelMakeupFormData>) => {
    const updated = await cancelMakeupsApi.update(id, data);
    setCancelMakeups(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  return { cancelMakeups, loading, error, refetch: fetch, create, update };
}
