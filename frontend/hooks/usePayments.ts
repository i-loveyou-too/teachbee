'use client';

import { useState, useEffect, useCallback } from 'react';
import { paymentsApi } from '@/lib/api';
import type { Payment, PaymentFormData } from '@/lib/types';

export function usePayments(params?: { student?: number }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsApi.list(params);
      setPayments(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.student]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = async (id: number, data: Partial<PaymentFormData>) => {
    const updated = await paymentsApi.update(id, data);
    setPayments(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  return { payments, loading, error, refetch: fetch, update };
}
