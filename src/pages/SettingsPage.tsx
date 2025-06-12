import React, { useEffect, useState } from 'react';
import { Save, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import ChangeEmailDialog from '../components/settings/ChangeEmailDialog';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setEmail(data.user.email ?? '');
        setName(data.user.user_metadata?.name ?? '');
        setCompany(data.user.user_metadata?.company ?? '');
      }
    });
  }, []);

  const handleMetaChange = async () => {
    const { error } = await supabase.auth.updateUser({ data: { name, company } });
    error ? toast.error('📛 ' + error.message) : toast.success('✅ Profil erfolgreich aktualisiert');
  };

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    error ? toast.error('📛 ' + error.message) : toast.success('🔒 Passwort erfolgreich geändert');
  };

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <p className="text-sm text-gray-500">Verwalten Sie Ihre Konto-Einstellungen</p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Profil */}
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-medium">Profil</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300 shadow-sm focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Unternehmen</label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300 shadow-sm focus:ring-blue-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <Button variant="primary" onClick={handleMetaChange}>Profil speichern</Button>
        </div>

      {/* E-Mail */}
<div className="p-6">
  <div className="space-y-4">
    <h2 className="text-lg font-medium">E-Mail-Adresse</h2>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Aktuelle E-Mail-Adresse
      </label>
      <input
        type="email"
        disabled
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm text-gray-700"
        value={email}
      />
      <p className="mt-1 text-sm text-gray-500">Diese E-Mail-Adresse ist aktuell aktiv.</p>
    </div>
    <div>
      <ChangeEmailDialog />
    </div>
  </div>
</div>


        {/* Passwort ändern */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Lock size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium">Passwort ändern</h2>
          </div>
          <div className="space-y-4 max-w-sm">
            <input
              type="password"
              placeholder="Neues Passwort"
              className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="primary" onClick={handlePasswordChange}>Passwort ändern</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" icon={<Save size={16} />}>
          Speichern
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
