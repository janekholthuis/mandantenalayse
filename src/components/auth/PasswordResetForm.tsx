import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { showSuccess } from '../../lib/toast';

const PasswordResetForm: React.FC = () => {
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
              <div className="flex items-center justify-center mb-2">
                <Settings className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-blue-800">
                  Passwort in Einstellungen ändern
                </h3>
              </div>
              <p className="text-sm text-blue-700">
                Melden Sie sich an und gehen Sie zu den Einstellungen, um Ihr Passwort zu ändern.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleRedirectToSettings}
              icon={<ArrowRight size={16} />}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Zu den Einstellungen
            </Button>

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Zurück zur Anmeldung
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;