import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import ChangeEmailDialog from '../components/settings/ChangeEmailDialog';
import { showSuccess, showError } from '../lib/toast';

const LabeledInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const passwordSectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  useEffect(() => {
    const fromReset = searchParams.get('from');
    if (fromReset === 'reset') {
      setShowResetSuccess(true);
      showSuccess('Sie sind erfolgreich angemeldet! Sie können jetzt Ihr Passwort ändern. 🔐');
      navigate(location.pathname, { replace: true });
      setTimeout(() => passwordSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    const toastParam = searchParams.get('toast');
    if (toastParam === 'passwordUpdated') {
      showSuccess('Ihr Passwort wurde erfolgreich aktualisiert.');
      navigate(location.pathname, { replace: true });
      setTimeout(() => passwordSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setEmail(data.user.email ?? '');
        setName(data.user.user_metadata?.name ?? '');
        setCompany(data.user.user_metadata?.company ?? '');
      }
    });
  }, [searchParams, navigate, location.pathname]);

  const handleMetaChange = async () => {
    if (!name.trim() || name.length < 2) return showError('Bitte gültigen Namen eingeben');
    const { error } = await supabase.auth.updateUser({ data: { name, company } });
    error ? showError('Fehler beim Aktualisieren des Profils: ' + error.message) : showSuccess('Profil erfolgreich aktualisiert');
  };

  const handlePasswordChange = async () => {
    if (!password.trim()) return showError('Bitte geben Sie ein neues Passwort ein');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      showError('Fehler beim Ändern des Passworts: ' + error.message);
    } else {
      showSuccess('Passwort erfolgreich geändert');
      setPassword('');
      setShowResetSuccess(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <p className="text-sm text-gray-500">Verwalten Sie Ihre Konto-Einstellungen</p>
      </div>

      {showResetSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">Erfolgreich über Passwort-Reset angemeldet</h3>
              <p className="text-sm text-green-700 mt-1">Sie können jetzt Ihr Passwort im Abschnitt unten sicher ändern.</p>
            </div>
            <button onClick={() => setShowResetSuccess(false)} className="text-green-400 hover:text-green-600">×</button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-medium">Profil</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <LabeledInput label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <LabeledInput label="Unternehmen" type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <Button variant="primary" onClick={handleMetaChange}>Profil speichern</Button>
        </div>

        <div className="p-6">
          <label className="text-sm font-semibold text-gray-700">E-Mail-Adresse</label>
          <input
            type="email"
            disabled
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 shadow-sm cursor-not-allowed"
            value={email}
          />
          <p className="mt-2 text-sm text-gray-500">Diese E-Mail-Adresse ist derzeit mit Ihrem Konto verknüpft. Änderungen sind über den Button möglich.</p>
          <ChangeEmailDialog />
        </div>

        <div className="p-6" ref={passwordSectionRef}>
          <div className="flex items-center mb-4">
            <Lock size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium">Passwort ändern</h2>
          </div>
          {showResetSuccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Passwort zurücksetzen</h4>
                  <p className="text-sm text-blue-700 mt-1">Geben Sie unten Ihr neues Passwort ein und klicken Sie auf \"Passwort ändern\".</p>
                </div>
              </div>
            </div>
          )}
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
