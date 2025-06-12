import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import ChangeEmailDialog from '../components/settings/ChangeEmailDialog';
import { showError, showSuccess } from '../../lib/toast';

const SettingsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setName(user?.user_metadata?.name || '');
    setCompany(user?.user_metadata?.company || '');
  }, [user]);

  const handleProfile = async () => {
    const { error } = await supabase.auth.updateUser({ data: { name, company } });
    if (error) return showError(error.message);
    showSuccess('Profil erfolgreich aktualisiert');
  };

  return (
    <div>
      {/* Name & Firma */}
      <div className="p-6">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="p-6">
        <label>Firma</label>
        <input value={company} onChange={e => setCompany(e.target.value)} />
      </div>
      <div className="p-6">
        <label>E-Mail</label>
        <ChangeEmailDialog onSuccess={(msg) => showSuccess(msg)} />
      </div>
      <div className="p-6">
        <Button onClick={handleProfile}>Profil speichern</Button>
      </div>
    </div>
  );
};
export default SettingsPage;
