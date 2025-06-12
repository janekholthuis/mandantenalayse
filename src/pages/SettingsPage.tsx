import React, { useEffect, useState } from 'react';
import { Save, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import ChangeEmailDialog from '../components/settings/ChangeEmailDialog';

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  const [userMetaStatus, setUserMetaStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [userMetaMessage, setUserMetaMessage] = useState('');

  const [password, setPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setEmail(data.user.email || '');
        setName(data.user.user_metadata?.name || '');
        setCompany(data.user.user_metadata?.company || '');
      }
    };
    fetchUser();
  }, []);

  const handleMetaChange = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name, company },
    });

    if (error) {
      setUserMetaStatus('error');
      setUserMetaMessage(error.message);
    } else {
      setUserMetaStatus('success');
      setUserMetaMessage('Profil erfolgreich aktualisiert.');
    }
  };

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setPasswordStatus('error');
      setPasswordMessage(error.message);
    } else {
      setPasswordStatus('success');
      setPasswordMessage('Passwort erfolgreich geändert.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="mt-1 text-sm text-gray-500">Verwalten Sie Ihre Konto-Einstellungen</p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Profil */}
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Profil</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Unternehmen</label>
              <input
                id="company"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="primary" onClick={handleMetaChange}>Änderungen speichern</Button>
            {userMetaStatus === 'success' && <p className="text-sm text-green-600">{userMetaMessage}</p>}
            {userMetaStatus === 'error' && <p className="text-sm text-red-600">{userMetaMessage}</p>}
          </div>
        </div>

        {/* E-Mail */}
        <div className="p-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Mail</label>
          <div className="mt-1 flex gap-2">
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="flex-1 rounded-md border-gray-300 shadow-sm bg-gray-100"
            />
            <ChangeEmailDialog />
          </div>
        </div>

        {/* Passwort ändern */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Lock size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Passwort ändern</h2>
          </div>
          <div className="space-y-4 max-w-sm">
            <input
              type="password"
              placeholder="Neues Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <Button variant="primary" onClick={handlePasswordChange}>Passwort ändern</Button>
            {passwordStatus === 'success' && <p className="text-green-600">{passwordMessage}</p>}
            {passwordStatus === 'error' && <p className="text-red-600">{passwordMessage}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" icon={<Save size={16} />}>
          Einstellungen speichern
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
