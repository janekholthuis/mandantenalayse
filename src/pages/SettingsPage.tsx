import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import ChangeEmailDialog from '../components/settings/ChangeEmailDialog';
import { showSuccess, showError } from '../lib/toast';

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
    error ? showError('Fehler beim Aktualisieren des Profils: ' + error.message) : showSuccess('Profil erfolgreich aktualisiert');
  };

  const handlePasswordChange = async () => {
    if (!password.trim()) {
      showError('Bitte geben Sie ein neues Passwort ein');
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      showError('Fehler beim Ändern des Passworts: ' + error.message);
    } else {
      showSuccess('Passwort erfolgreich geändert');
      setPassword(''); // Clear password field after successful change
    }
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
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unternehmen</label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <Button variant="primary" onClick={handleMetaChange}>Profil speichern</Button>
        </div>

        {/* E-Mail */}
         <label className="text-sm font-semibold text-gray-700">E-Mail-Adresse</label>
       <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
  

  <input
    type="email"
    disabled
    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 shadow-sm cursor-not-allowed"
    value={email}
  />

  <p className="mt-2 text-sm text-gray-500">
    Diese E-Mail-Adresse ist derzeit mit Ihrem Konto verknüpft. Änderungen sind über den Button möglich.
  </p>
         <div className="flex items-center justify-between mb-2">
   
    <ChangeEmailDialog />
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
              className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
            <Button variant="primary" onClick={handlePasswordChange}>Passwort ändern</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;