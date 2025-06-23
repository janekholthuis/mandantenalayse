import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Client } from '../types';

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [deletedClients, setDeletedClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [{ data: active }, { data: deleted }] = await Promise.all([
        supabase
          .from('clients').select('*').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false }),
        supabase
          .from('clients').select('*').eq('user_id', user.id).not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
      ]);
      setClients(active ?? []);
      setDeletedClients(deleted ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  const transform = (rows: any[]): Client[] =>
    rows.map(r => ({
      id: r.id,
      name: r.name || 'Unbekannt',
      industry: r.branchenschluessel_bezeichnung,
      legalForm: r.unternehmensform,
      city: r.ort,
      postalCode: r.plz ? parseInt(r.plz) : undefined,
      status: r.deleted_at ? 'inactive' : 'active',
      created_at: r.created_at,
      updated_at: r.updated_at,
      deleted_at: r.deleted_at,
      employeeCount: r.employee_count ?? 0,
      mandanten_id: r.Mandanten_ID,
      beraternummer: r.beraternummer,
    }));

  const active = useMemo(() => transform(clients), [clients]);
  const deleted = useMemo(() => transform(deletedClients), [deletedClients]);

  return { active, deleted, isLoading, refresh: fetch };
}
