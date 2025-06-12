import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const ChangeEmailDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleEmailChange = async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    error
      ? toast.error('📛 ' + error.message)
      : toast.success('📧 Bestätigungs-E-Mail gesendet');

    setOpen(false);
    setNewEmail('');
  };

  return (
    <div className="mt-2">
      {!open ? (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          E-Mail ändern
        </Button>
      ) : (
        <div className="space-y-2 max-w-md">
          <input
            type="email"
            placeholder="Neue E-Mail-Adresse"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleEmailChange}>Ändern</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Abbrechen</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeEmailDialog;
