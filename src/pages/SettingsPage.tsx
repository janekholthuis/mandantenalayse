import React, { useState } from 'react';
import { Save, Bell, Lock, Globe, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: false,
    updates: true
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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

        {/* Benachrichtigungen */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Bell size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Benachrichtigungen</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">E-Mail-Benachrichtigungen</p>
                <p className="text-sm text-gray-500">Erhalten Sie wichtige Updates per E-Mail</p>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Desktop-Benachrichtigungen</p>
                <p className="text-sm text-gray-500">Erhalten Sie Echtzeit-Benachrichtigungen im Browser</p>
              </div>
              <button
                onClick={() => handleNotificationChange('desktop')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  notifications.desktop ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.desktop ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
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
                Zwei-Faktor-Authentifizierung aktivieren
              </Button>
            </div>
          </div>
        </div>

        {/* Sprache und Region */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Globe size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Sprache und Region</h2>
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
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
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
                <option value="Europe/London">London (UTC)</option>
                <option value="America/New_York">New York (UTC-5)</option>
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