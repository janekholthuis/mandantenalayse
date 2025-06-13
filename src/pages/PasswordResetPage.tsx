import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ArrowRight, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import { showSuccess } from '../lib/toast';

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirectToSettings = () => {
    showSuccess('Sie können Ihr Passwort in den Einstellungen ändern 🔐');
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Passwort zurücksetzen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sie können Ihr Passwort in den Kontoeinstellungen ändern.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-3">
                <Info className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-blue-800">
                  Passwort in Einstellungen ändern
                </h3>
              </div>
              <p className="text-sm text-blue-700">
                Melden Sie sich an und gehen Sie zu den Einstellungen, um Ihr Passwort sicher zu ändern.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">So funktioniert's:</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-2 mt-0.5 flex items-center justify-center">1</span>
                  Melden Sie sich mit Ihrem aktuellen Passwort an
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-2 mt-0.5 flex items-center justify-center">2</span>
                  Gehen Sie zu den Einstellungen
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-2 mt-0.5 flex items-center justify-center">3</span>
                  Geben Sie Ihr neues Passwort ein
                </li>
              </ol>
            </div>

            <Button
              variant="primary"
              onClick={handleRedirectToSettings}
              icon={<ArrowRight size={16} />}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Zu den Einstellungen
            </Button>

            <div className="text-sm text-center space-y-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-blue-600 hover:text-blue-500 block w-full"
              >
                Zurück zur Anmeldung
              </button>
              <p className="text-xs text-gray-500">
                Kein Konto? <button
                  onClick={() => navigate('/signup')}
                  className="font-medium text-blue-600 hover:text-blue-500 underline"
                >
                  Jetzt registrieren
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;