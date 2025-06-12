import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

const ChangeEmailDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleEmailChange = async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage(
        'Bitte bestätigen Sie Ihre neue E-Mail-Adresse über den Link, den wir Ihnen geschickt haben.'
      );
    }
  };

  const reset = () => {
    setOpen(false);
    setNewEmail('');
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="mt-2">
      {!open ? (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          E-Mail-Adresse ändern
        </Button>
      ) : (
        <div className="space-y-2 max-w-md">
          <input
            type="email"
            placeholder="Neue E-Mail-Adresse"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleEmailChange}>Ändern</Button>
            <Button variant="secondary" onClick={reset}>Abbrechen</Button>
          </div>
          {status === 'success' && <p className="text-sm text-green-600">{message}</p>}
          {status === 'error' && <p className="text-sm text-red-600">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default ChangeEmailDialog;
