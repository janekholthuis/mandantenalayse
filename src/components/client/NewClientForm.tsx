import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../lib/toast';
import { Building2, Users, MapPin, Building } from 'lucide-react';
import Button from '../ui/Button';

const LEGAL_FORMS = [
  'Einzelunternehmen (e.K.)',
  'Freiberufler',
  'Kleingewerbe',
  'Gesellschaft bürgerlichen Rechts (GbR)',
  'Offene Handelsgesellschaft (OHG)',
  'Kommanditgesellschaft (KG)',
  'GmbH & Co. KG',
  'Partnerschaftsgesellschaft (PartG)',
  'PartG mbB (mit beschränkter Berufshaftung)',
  'Gesellschaft mit beschränkter Haftung (GmbH)',
  'Unternehmergesellschaft (haftungsbeschränkt) – UG',
  'Aktiengesellschaft (AG)',
  'Societas Europaea (SE)',
  'Eingetragene Genossenschaft (eG)',
  'Eingetragener Verein (e.V.)',
  'Stiftung',
  'Körperschaft des öffentlichen Rechts',
  'Anstalt des öffentlichen Rechts',
  'Limited (Ltd.) – UK',
  'Sonstige ausländische Gesellschaft (z. B. BV, SARL, LLC)'
];

const NewClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    legalForm: '',
    employeeCount: '0',
    postalCode: '',
    city: '',
    street: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('Mandanten').insert([
        {
          name: formData.companyName,
          unternehmensform: formData.legalForm,
          Mitarbeiter_Anzahl: parseInt(formData.employeeCount) || 0,
          plz: formData.postalCode,
          ort: formData.city,
          strasse: formData.street,
          user_id: user.id
        }
      ]);

      if (error) throw error;

      showSuccess('Mandant erfolgreich angelegt');
      navigate('/clients');
    } catch (error) {
      console.error('Error creating client:', error);
      showError('Fehler beim Anlegen des Mandanten');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Firmenname</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="companyName"
              id="companyName"
              required
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Musterfirma GmbH"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="legalForm" className="block text-sm font-medium text-gray-700">Rechtsform (optional)</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="legalForm"
              id="legalForm"
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.legalForm}
              onChange={handleChange}
            >
              <option value="">Rechtsform auswählen</option>
              {LEGAL_FORMS.map(form => (
                <option key={form} value={form}>{form}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">Mitarbeiteranzahl</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="employeeCount"
              id="employeeCount"
              min="0"
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              value={formData.employeeCount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">PLZ</label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10115"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Stadt</label>
            <input
              type="text"
              name="city"
              id="city"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Berlin"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">Straße & Nr.</label>
            <input
              type="text"
              name="street"
              id="street"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Musterstraße 1"
              value={formData.street}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={() => navigate('/clients')}>Abbrechen</Button>
          <Button type="submit" variant="primary">Mandant anlegen</Button>
        </div>
      </form>
    </div>
  );
};

export default NewClientForm;
