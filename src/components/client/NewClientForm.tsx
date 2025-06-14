import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../lib/toast';
import { Building2, Users, TrendingUp, Wallet, Building } from 'lucide-react';
import Button from '../ui/Button';

const NewClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    legalForm: '',
    employeeCount: '0',
    profit: '',
    revenue: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('Mandanten')
        .insert([
          {
            name: formData.companyName,
            unternehmensform: formData.legalForm,
            Mitarbeiter_Anzahl: parseInt(formData.employeeCount) || 0,
            user_id: user.id
          }
        ])
        .select();

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Firmenname
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
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
          <label htmlFor="legalForm" className="block text-sm font-medium text-gray-700">
            Rechtsform
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="legalForm"
              id="legalForm"
              required
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.legalForm}
              onChange={handleChange}
            >
              <option value="">Rechtsform auswählen</option>
              <option value="GmbH">GmbH</option>
              <option value="GmbH & Co. KG">GmbH & Co. KG</option>
              <option value="AG">AG</option>
              <option value="KG">KG</option>
              <option value="OHG">OHG</option>
              <option value="GbR">GbR</option>
              <option value="Einzelunternehmen">Einzelunternehmen</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
            Mitarbeiteranzahl
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
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

        <div>
          <label htmlFor="profit" className="block text-sm font-medium text-gray-700">
            Gewinn
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="profit"
              id="profit"
              required
              min="0"
              className="block w-full pl-10 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100000"
              value={formData.profit}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="revenue" className="block text-sm font-medium text-gray-700">
            Umsatz
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="revenue"
              id="revenue"
              required
              min="0"
              className="block w-full pl-10 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="500000"
              value={formData.revenue}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/clients')}
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Mandant anlegen
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewClientForm;