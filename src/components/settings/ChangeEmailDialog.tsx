import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { showError, showSuccess } from '../../lib/toast';

interface Props {
  onSuccess?: (msg: string) => void;
}

const ChangeEmailDialog: React.FC<Props> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setCurrentEmail(data.user.email);
      }
    });
  }, []);

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      showError('Bitte gültige neue E-Mail-Adresse eingeben');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      // Track beide E-Mails lokal
      localStorage.setItem('email_change_steps', JSON.stringify({
        oldEmail: currentEmail,
        newEmail: newEmail,
        oldConfirmed: false,
        newConfirmed: false
      }));

      const msg = '📧 Bestätige den Link in deiner alten und neuen E-Mail-Adresse.';
      showSuccess(msg);
      onSuccess?.(msg);
      setNewEmail('');
      setOpen(false);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  return open ? (
    <div className="mt-2 space-y-2">
      <input
        type="email"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Neue E-Mail-Adresse"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <div className="flex gap-2">
        <Button onClick={handleChangeEmail} isLoading={loading}>
          Aktualisieren
        </Button>
        <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
          Abbrechen
        </Button>
      </div>
    </div>
  ) : (
    <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
      E-Mail-Adresse ändern
    </Button>
  );
};

export default ChangeEmailDialog;
