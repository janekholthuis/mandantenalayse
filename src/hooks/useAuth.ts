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
      
      // Send welcome email when user confirms their email (only if email is confirmed)
      if (event === 'SIGNED_IN' && session?.user && session.user.email_confirmed_at) {
        try {
          const userName = session.user.user_metadata?.name || 'Lieber Nutzer';
          const companyName = session.user.user_metadata?.company || 'Ihr Unternehmen';
          
          // Only send welcome email if this is the first time the user is signing in after confirmation
          const lastSignIn = new Date(session.user.last_sign_in_at || '');
          const emailConfirmed = new Date(session.user.email_confirmed_at || '');
          const timeDiff = Math.abs(lastSignIn.getTime() - emailConfirmed.getTime());
          
          // If the sign-in happened within 5 minutes of email confirmation, send welcome email
          if (timeDiff < 5 * 60 * 1000) {
            await EmailService.sendWelcomeEmail(session.user.email!, userName, companyName);
          }
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};