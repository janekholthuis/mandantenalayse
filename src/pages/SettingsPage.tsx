import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import ChangeEmailDialog from '../components/settings/ChangeEmailDialog';
import { showError, showSuccess } from '../lib/toast';
import PageHeader from '../components/layout/PageHeader';

const SettingsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || '');
      setCompany(user.user_metadata?.company || '');
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!name.trim() || !company.trim()) {
      return showError('Name und Firma dürfen nicht leer sein.');
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { name: name.trim(), company: company.trim() }
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess('✅ Profil erfolgreich aktualisiert');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Einstellungen"
        description="Verwalten Sie Ihr Profil, Ihre E-Mail-Adresse und Ihr Unternehmen"
      />

      {/* Name & Firma */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profil</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Unternehmen</label>
              <input
                type="text"
                id="company"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* E-Mail ändern */}
        <div className="p-6 border-t border-gray-100">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">E-Mail</label>
          </div>
          <ChangeEmailDialog onSuccess={showSuccess} />
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-100 text-right">
          <Button
            variant="primary"
            onClick={handleProfileUpdate}
            isLoading={loading}
          >
            Profil speichern
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
