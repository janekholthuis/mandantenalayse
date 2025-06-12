import React from 'react';
import { Save, Lock, Globe } from 'lucide-react';
import Button from '../components/ui/Button';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Verwalten Sie Ihre Konto- und Anwendungseinstellungen
        </p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Profil Einstellungen */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profil</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="Max Steuerberater"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="max@beispiel.de"
              />
            </div>
          </div>
        </div>

        {/* Sicherheit */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Lock size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Sicherheit</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Button variant="secondary">
                Passwort ändern
              </Button>
            </div>
            <div>
              <Button variant="secondary">
                E-Mail-Adresse ändern
              </Button>
            </div>
          </div>
        </div>

        {/* Sprache & Zeitzone */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Globe size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Sprache & Zeitzone</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Sprache
              </label>
              <select
                id="language"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="de"
                disabled
              >
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Zeitzone
              </label>
              <select
                id="timezone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="Europe/Berlin"
              >
                <option value="Europe/Berlin">Berlin (UTC+1)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          icon={<Save size={16} />}
        >
          Einstellungen speichern
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
