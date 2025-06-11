import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { EmailService } from '../services/emailService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Send welcome email when user confirms their email
      if (event === 'SIGNED_UP' && session?.user) {
        try {
          const userName = session.user.user_metadata?.name || 'Lieber Nutzer';
          const companyName = session.user.user_metadata?.company || 'Ihr Unternehmen';
          await EmailService.sendWelcomeEmail(session.user.email!, userName, companyName);
        } catch (error) {
          console.error('Failed to send welcome email on confirmation:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};