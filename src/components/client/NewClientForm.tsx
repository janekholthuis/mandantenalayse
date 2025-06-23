import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { showError, showSuccess } from '../../lib/toast';
import { Building2, Users, MapPin, Building } from 'lucide-react';
import Button from '../ui/Button';

type FormValues = {
  name: string;
  employee_count: number;
  legal_form?: number;
  plz: number;
  ort: string;
  land: string;
  strasse: string;
};

interface LegalForm {
  id: number;
  name: string;
}

const NewClientForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [legalForms, setLegalForms] = useState<LegalForm[]>([]);

  useEffect(() => {
    const fetchLegalForms = async () => {
      const { data, error } = await supabase.from('legal_forms').select('*').order('name');
      if (error) console.error(error);
      else setLegalForms(data || []);
    };
    fetchLegalForms();
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      showError('Sie müssen angemeldet sein.');
      return;
    }

    try {
      const { error } = await supabase.from('clients').insert([
        {
          ...values,
          user_id: user.id,
        }
      ]);

      if (error) throw error;

      showSuccess('Mandant erfolgreich gespeichert');
      navigate('/clients');
    } catch (err: any) {
      showError(err.message || 'Fehler beim Anlegen des Mandanten');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg max-w-4xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-8">
        {/* Firmenname */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Firmenname *</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name', { required: 'Firmenname ist erforderlich' })}
              className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Musterfirma GmbH"
            />
          </div>
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {/* Mitarbeiter & Unternehmensform */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Anzahl Mitarbeiter *</label>
            <input
              type="number"
              {...register('employee_count', {
                required: 'Mitarbeiteranzahl ist erforderlich',
                min: { value: 0, message: 'Muss 0 oder mehr sein' },
                valueAsNumber: true,
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="25"
            />
            {errors.employee_count && <p className="text-sm text-red-600 mt-1">{errors.employee_count.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rechtsform (optional)</label>
            <select
              {...register('legal_form')}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Rechtsform auswählen</option>
              {legalForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse *</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                placeholder="Straße & Hausnummer"
                {...register('strasse', { required: 'Straße ist erforderlich' })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              {errors.strasse && <p className="text-sm text-red-600 mt-1">{errors.strasse.message}</p>}
            </div>

            <div>
              <input
                type="number"
                placeholder="PLZ"
                {...register('plz', {
                  required: 'PLZ ist erforderlich',
                  min: { value: 1000, message: 'Ungültige PLZ' },
                  max: { value: 99999, message: 'Ungültige PLZ' },
                  valueAsNumber: true,
                })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              {errors.plz && <p className="text-sm text-red-600 mt-1">{errors.plz.message}</p>}
            </div>

            <div>
              <input
                placeholder="Ort"
                {...register('ort', { required: 'Ort ist erforderlich' })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              {errors.ort && <p className="text-sm text-red-600 mt-1">{errors.ort.message}</p>}
            </div>

            <div>
              <input
                placeholder="Land"
                defaultValue="Deutschland"
                {...register('land', { required: 'Land ist erforderlich' })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              {errors.land && <p className="text-sm text-red-600 mt-1">{errors.land.message}</p>}
            </div>
          </div>
        </div>

        {/* Aktionen */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={() => navigate('/clients')}>Abbrechen</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>Mandant anlegen</Button>
        </div>
      </form>
    </div>
  );
};

export default NewClientForm;
