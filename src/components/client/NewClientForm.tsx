import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../lib/toast';
import { Building2, Users, MapPin, Building } from 'lucide-react';
import Button from '../ui/Button';

interface LegalForm {
  id: number;
  name: string;
  category: string;
}

const NewClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [legalForms, setLegalForms] = useState<LegalForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic required fields
    name: '',
    employee_count: '',
    legal_form: '',
    
    // Address fields
    plz: '',
    ort: '',
    land: 'Deutschland',
    strasse: ''
  });

  // Fetch legal forms on component mount
  useEffect(() => {
    const fetchLegalForms = async () => {
      try {
        const { data, error } = await supabase
          .from('legal_forms')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching legal forms:', error);
        } else {
          setLegalForms(data || []);
        }
      } catch (error) {
        console.error('Error fetching legal forms:', error);
      }
    };

    fetchLegalForms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showError('Sie müssen angemeldet sein, um einen Mandanten zu erstellen');
      return;
    }

    if (!formData.name.trim()) {
      showError('Bitte geben Sie einen Firmennamen ein');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for insertion, only including non-empty values
      const insertData: any = {
        name: formData.name.trim(),
        user_id: user.id
  
      };

      // Add optional fields only if they have values
      if (formData.employee_count.trim()) {
        insertData.employee_count = parseInt(formData.employee_count);
      }
      if (formData.legal_form.trim()) {
        insertData.legal_form = parseInt(formData.legal_form);
      }
      if (formData.plz.trim()) insertData.plz = formData.plz.trim();
      if (formData.ort.trim()) insertData.ort = formData.ort.trim();
      if (formData.land.trim()) insertData.land = formData.land.trim();
      if (formData.strasse.trim()) insertData.strasse = formData.strasse.trim();

      const { data, error } = await supabase
        .from('clients')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      showSuccess('Mandant erfolgreich angelegt');
      navigate('/clients');
    } catch (error: any) {
      console.error('Error creating client:', error);
      
      // Handle specific error cases
      if (error.code === '23505') {
        showError('Ein Mandant mit dieser Mandanten-ID existiert bereits');
      } else if (error.message) {
        showError(`Fehler beim Anlegen des Mandanten: ${error.message}`);
      } else {
        showError('Fehler beim Anlegen des Mandanten');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8 p-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grunddaten</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Firmenname <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Musterfirma GmbH"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700">
                Anzahl Mitarbeiter
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="employee_count"
                  id="employee_count"
                  min="0"
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="25"
                  value={formData.employee_count}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="legal_form" className="block text-sm font-medium text-gray-700">
                Rechtsform
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="legal_form"
                  id="legal_form"
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.legal_form}
                  onChange={handleChange}
                >
                  <option value="">Rechtsform auswählen</option>
                  {legalForms.map(form => (
                    <option key={form.id} value={form.id}>{form.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="strasse" className="block text-sm font-medium text-gray-700">
                Straße & Hausnummer
              </label>
              <input
                type="text"
                name="strasse"
                id="strasse"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Musterstraße 1"
                value={formData.strasse}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="plz" className="block text-sm font-medium text-gray-700">
                PLZ
              </label>
              <input
                type="text"
                name="plz"
                id="plz"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10115"
                value={formData.plz}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="ort" className="block text-sm font-medium text-gray-700">
                Stadt
              </label>
              <input
                type="text"
                name="ort"
                id="ort"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Berlin"
                value={formData.ort}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="land" className="block text-sm font-medium text-gray-700">
                Land
              </label>
              <input
                type="text"
                name="land"
                id="land"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Deutschland"
                value={formData.land}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button 
            type="button"
            variant="secondary" 
            onClick={() => navigate('/clients')}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting || !formData.name.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Speichere...' : 'Mandant anlegen'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewClientForm;