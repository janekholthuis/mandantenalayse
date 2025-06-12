import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

interface Props { onSuccess?: (msg: string) => void }

const ChangeEmailDialog: React.FC<Props> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handle = async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) return alert(error.message);
    const msg = 'Bestätigungs-E-Mail gesendet';
    onSuccess?.(msg);
    setOpen(false);
  };

  return open ? (
    <div>
      <input value={newEmail} onChange={e => setNewEmail(e.target.value)} />
      <Button onClick={handle}>Ändern</Button>
      <Button onClick={() => setOpen(false)}>Abbrechen</Button>
    </div>
  ) : (
    <Button onClick={() => setOpen(true)}>E-Mail-Adresse ändern</Button>
  );
};

export default ChangeEmailDialog;
