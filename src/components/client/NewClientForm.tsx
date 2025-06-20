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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic required fields
    name: '',
    
    // Optional fields matching the database schema
    mandanten_id: '',
    anrede: '',
    akad_grad: '',
    adelstitel: '',
    unternehmensform: '',
    unternehmensgegenstand: '',
    branchenschluessel: '',
    branchenschluessel_bezeichnung: '',
    typ: '',
    typbezeichnung: '',
    status: 'aktiv',
    vdb_info: '',
    vdb_info_textuell: '',
    beraternummer: '',
    
    // Address fields
    plz: '',
    ort: '',
    land: 'Deutschland',
    strasse: '',
    postfach: '',
    telefon: '',
    
    // Additional fields
    sepa: ''
  });

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
        user_id: user.id,
        status: formData.status || 'aktiv'
      };

      // Add optional fields only if they have values
      if (formData.mandanten_id.trim()) insertData.Mandanten_ID = formData.mandanten_id.trim();
      if (formData.anrede.trim()) insertData.anrede = formData.anrede.trim();
      if (formData.akad_grad.trim()) insertData.akad_grad = formData.akad_grad.trim();
      if (formData.adelstitel.trim()) insertData.adelstitel = formData.adelstitel.trim();
      if (formData.unternehmensform.trim()) insertData.unternehmensform = formData.unternehmensform.trim();
      if (formData.unternehmensgegenstand.trim()) insertData.unternehmensgegenstand = formData.unternehmensgegenstand.trim();
      if (formData.branchenschluessel.trim()) insertData.branchenschluessel = formData.branchenschluessel.trim();
      if (formData.branchenschluessel_bezeichnung.trim()) insertData.branchenschluessel_bezeichnung = formData.branchenschluessel_bezeichnung.trim();
      if (formData.typ.trim()) insertData.typ = formData.typ.trim();
      if (formData.typbezeichnung.trim()) insertData.typbezeichnung = formData.typbezeichnung.trim();
      if (formData.vdb_info.trim()) insertData.vdb_info = formData.vdb_info.trim();
      if (formData.vdb_info_textuell.trim()) insertData.vdb_info_textuell = formData.vdb_info_textuell.trim();
      if (formData.beraternummer.trim()) insertData.beraternummer = formData.beraternummer.trim();
      if (formData.plz.trim()) insertData.plz = formData.plz.trim();
      if (formData.ort.trim()) insertData.ort = formData.ort.trim();
      if (formData.land.trim()) insertData.land = formData.land.trim();
      if (formData.strasse.trim()) insertData.strasse = formData.strasse.trim();
      if (formData.postfach.trim()) insertData.postfach = formData.postfach.trim();
      if (formData.telefon.trim()) insertData.telefon = formData.telefon.trim();
      if (formData.sepa.trim()) insertData.sepa = formData.sepa.trim();

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
              <label htmlFor="mandanten_id" className="block text-sm font-medium text-gray-700">
                Mandanten-ID
              </label>
              <input
                type="text"
                name="mandanten_id"
                id="mandanten_id"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="12345"
                value={formData.mandanten_id}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="beraternummer" className="block text-sm font-medium text-gray-700">
                Beraternummer
              </label>
              <input
                type="text"
                name="beraternummer"
                id="beraternummer"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="001"
                value={formData.beraternummer}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="unternehmensform" className="block text-sm font-medium text-gray-700">
                Rechtsform
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="unternehmensform"
                  id="unternehmensform"
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.unternehmensform}
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                id="status"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="aktiv">Aktiv</option>
                <option value="inaktiv">Inaktiv</option>
              </select>
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

            <div>
              <label htmlFor="postfach" className="block text-sm font-medium text-gray-700">
                Postfach
              </label>
              <input
                type="text"
                name="postfach"
                id="postfach"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Postfach 123456"
                value={formData.postfach}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kontakt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="telefon" className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                name="telefon"
                id="telefon"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+49 30 12345678"
                value={formData.telefon}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Unternehmensdaten</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="branchenschluessel" className="block text-sm font-medium text-gray-700">
                Branchenschlüssel
              </label>
              <input
                type="text"
                name="branchenschluessel"
                id="branchenschluessel"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="z.B. 62010"
                value={formData.branchenschluessel}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="branchenschluessel_bezeichnung" className="block text-sm font-medium text-gray-700">
                Branchenbezeichnung
              </label>
              <input
                type="text"
                name="branchenschluessel_bezeichnung"
                id="branchenschluessel_bezeichnung"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="z.B. Softwareentwicklung"
                value={formData.branchenschluessel_bezeichnung}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="unternehmensgegenstand" className="block text-sm font-medium text-gray-700">
                Unternehmensgegenstand
              </label>
              <textarea
                name="unternehmensgegenstand"
                id="unternehmensgegenstand"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Beschreibung der Geschäftstätigkeit..."
                value={formData.unternehmensgegenstand}
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