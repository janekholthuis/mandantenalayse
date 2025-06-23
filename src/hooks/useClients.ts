import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Client } from '../types';

interface UseClients {
  active: Client[];
  deleted: Client[];
  isLoading: boolean;
  refresh: () => void;
}

export function useClients(): UseClients {
  const [active, setActive] = useState<Client[]>([]);
  const [deleted, setDeleted] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!supabase.auth.getUser()) return;

    setIsLoading(true);
    const user = supabase.auth.user()!;

    const [{ data: act, error: e1 }, { data: del, error: e2 }] = await Promise.all([
      supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false })
    ]);

    if (!e1 && act) setActive(act as any);
    if (!e2 && del) setDeleted(del as any);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { active, deleted, isLoading, refresh: fetch };
}
