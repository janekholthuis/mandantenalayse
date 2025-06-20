import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Gift, Users, Settings, Building2, MapPin, Phone } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Client } from '../types';
import { showSuccess, showError } from '../lib/toast';

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

type TabType = 'benefits' | 'mitarbeiter' | 'einstellungen';

// Mock data for optimizations
const mockOptimizations = [
  {
    id: '1',
    title: 'Sachbezüge optimieren',
    description: 'Einführung von steuerfreien Sachbezügen bis 50€ pro Monat pro Mitarbeiter',
    potentialSavings: 600,
    status: 'potential',
    category: 'Steueroptimierung',
    requirements: [
      'Dokumentation der Sachbezüge',
      'Einhaltung der monatlichen Grenze von 50€',
      'Keine Bargeldauszahlung'
    ]
  },
  {
    id: '2',
    title: 'Betriebliche Altersvorsorge',
    description: 'Einführung oder Optimierung der betrieblichen Altersvorsorge',
    potentialSavings: 800,
    status: 'in-progress',
    category: 'Mitarbeiterbenefits',
    requirements: [
      'Auswahl eines geeigneten bAV-Systems',
      'Dokumentation der Vereinbarungen',
      'Information der Mitarbeiter'
    ]
  },
  {
    id: '3',
    title: 'Jobticket',
    description: 'Steuerfreies oder pauschalbesteuertes Ticket für den ÖPNV',
    potentialSavings: 400,
    status: 'completed',
    category: 'Mobilität',
    requirements: [
      'Vereinbarung mit ÖPNV-Anbieter',
      'Dokumentation der Nutzung',
      'Steuerliche Behandlung klären'
    ]
  }
];

// Mock data for employees
const mockEmployees = [
  {
    id: '1',
    name: 'Max Mustermann',
    position: 'Geschäftsführer',
    benefits: ['Jobticket', 'Betriebliche Altersvorsorge'],
    potentialBenefits: ['Sachbezüge']
  },
  {
    id: '2',
    name: 'Anna Schmidt',
    position: 'Buchhalterin',
    benefits: ['Jobticket'],
    potentialBenefits: ['Sachbezüge', 'Betriebliche Altersvorsorge']
  },
  {
    id: '3',
    name: 'Thomas Weber',
    position: 'Entwickler',
    benefits: [],
    potentialBenefits: ['Sachbezüge', 'Jobticket', 'Betriebliche Altersvorsorge']
  }
];

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    employee_count: '',
    unternehmensform: '',
    strasse: '',
    plz: '',
    ort: '',
    telefon: ''
  });
  
  // Determine current tab from URL
  const getCurrentTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('/mitarbeiter')) return 'mitarbeiter';
    if (path.includes('/einstellungen')) return 'einstellungen';
    return 'benefits'; // Default tab
  };

  const [activeTab, setActiveTab] = useState<TabType>(getCurrentTab());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/clients/${id}/${tab}`);
  };
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!id || !user) return;
      
      setIsLoading(true);
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (clientError) {
          console.error('Fehler beim Laden des Mandanten:', clientError);
          setClient(null);
          return;
        }

        if (!clientData) {
          setClient(null);
          return;
        }

        // Transform Supabase data to Client interface
        const transformedClient: Client = {
          id: clientData.id.toString(),
          name: clientData.name || 'Unbekannt',
          revenue: 0,
          profit: 0,
          legalForm: clientData.unternehmensform || 'Nicht angegeben',
          status: clientData.status === 'aktiv' ? 'active' : 'inactive',
          lastAnalyzed: undefined,
          employeeCount: clientData.employee_count || 0,
          city: clientData.ort || undefined,
          postalCode: clientData.plz ? parseInt(clientData.plz) : undefined,
          // Supabase specific fields
          mandanten_id: clientData.Mandanten_ID,
          beraternummer: clientData.beraternummer,
          branchenschluessel: clientData.branchenschluessel,
          branchenschluessel_bezeichnung: clientData.branchenschluessel_bezeichnung,
          unternehmensform: clientData.unternehmensform,
          unternehmensgegenstand: clientData.unternehmensgegenstand,
          typ: clientData.typ,
          typbezeichnung: clientData.typbezeichnung,
          vdb_info: clientData.vdb_info,
          vdb_info_textuell: clientData.vdb_info_textuell,
          plz: clientData.plz,
          ort: clientData.ort,
          land: clientData.land,
          strasse: clientData.strasse,
          postfach: clientData.postfach,
          telefon: clientData.telefon,
          sepa: clientData.sepa,
          created_at: clientData.created_at,
          updated_at: clientData.updated_at
        };

        setClient(transformedClient);
        
        // Initialize edit form with current client data
        setEditForm({
          name: transformedClient.name,
          employee_count: transformedClient.employeeCount?.toString() || '',
          unternehmensform: transformedClient.unternehmensform || '',
          strasse: transformedClient.strasse || '',
          plz: transformedClient.plz || '',
          ort: transformedClient.ort || '',
          telefon: transformedClient.telefon || ''
        });
      } catch (error) {
        console.error('Error fetching client:', error);
        setClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id, user]);

  const handleSaveSettings = async () => {
    if (!client || !user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: editForm.name,
          employee_count: editForm.employee_count ? parseInt(editForm.employee_count) : null,
          unternehmensform: editForm.unternehmensform,
          strasse: editForm.strasse,
          plz: editForm.plz,
          ort: editForm.ort,
          telefon: editForm.telefon,
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local client state
      setClient(prev => prev ? {
        ...prev,
        name: editForm.name,
        employeeCount: editForm.employee_count ? parseInt(editForm.employee_count) : 0,
        unternehmensform: editForm.unternehmensform,
        strasse: editForm.strasse,
        plz: editForm.plz,
        ort: editForm.ort,
        telefon: editForm.telefon
      } : null);

      setIsEditing(false);
      showSuccess('Mandanten-Einstellungen erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving client settings:', error);
      showError('Fehler beim Speichern der Einstellungen');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (client) {
      setEditForm({
        name: client.name,
        employee_count: client.employeeCount?.toString() || '',
        unternehmensform: client.unternehmensform || '',
        strasse: client.strasse || '',
        plz: client.plz || '',
        ort: client.ort || '',
        telefon: client.telefon || ''
      });
    }
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'potential': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800'
    };
    const labels = {
      'potential': 'Potenzial',
      'in-progress': 'In Bearbeitung',
      'completed': 'Umgesetzt'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'benefits':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <Gift className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Aktuelle Optimierungen</h3>
              </div>
              
              <div className="space-y-4">
                {mockOptimizations.map((optimization) => (
                  <div key={optimization.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-lg font-medium text-gray-900 mr-3">
                            {optimization.title}
                          </h4>
                          {getStatusBadge(optimization.status)}
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {optimization.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {optimization.potentialSavings.toLocaleString('de-DE')} €
                        </div>
                        <div className="text-xs text-gray-500">pro Jahr</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm">{optimization.description}</p>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Anforderungen:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {optimization.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'mitarbeiter':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Mitarbeiter & Benefits</h3>
              </div>
              
              <div className="space-y-4">
                {mockEmployees.map((employee) => (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-700 mb-2">Aktive Benefits</h5>
                        {employee.benefits.length > 0 ? (
                          <div className="space-y-1">
                            {employee.benefits.map((benefit, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mr-1 mb-1">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">Keine aktiven Benefits</p>
                        )}
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-blue-700 mb-2">Mögliche Benefits</h5>
                        {employee.potentialBenefits.length > 0 ? (
                          <div className="space-y-1">
                            {employee.potentialBenefits.map((benefit, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mr-1 mb-1">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">Alle Benefits bereits aktiv</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'einstellungen':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <Settings className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Mandanten-Einstellungen</h3>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Grunddaten</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Firmenname
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, name: e.target.value }));
                          setIsEditing(true);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Anzahl Mitarbeiter
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.employee_count}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, employee_count: e.target.value }));
                          setIsEditing(true);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rechtsform
                      </label>
                      <select
                        value={editForm.unternehmensform}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, unternehmensform: e.target.value }));
                          setIsEditing(true);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Rechtsform auswählen</option>
                        {LEGAL_FORMS.map(form => (
                          <option key={form} value={form}>{form}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Adresse</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Straße & Hausnummer
                      </label>
                      <input
                        type="text"
                        value={editForm.strasse}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, strasse: e.target.value }));
                          setIsEditing(true);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Musterstraße 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PLZ
                      </label>
                      <input
                        type="text"
                        value={editForm.plz}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, plz: e.target.value }));
                          setIsEditing(true);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10115"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stadt
                      </label>
                      <input
                        type="text"
                        value={editForm.ort}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, ort: e.target.value }));
                          setIsEditing(true);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Berlin"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Kontakt</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={editForm.telefon}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, telefon: e.target.value }));
                          setIsEditing(true);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+49 30 12345678"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Abbrechen
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSaveSettings}
                        isLoading={isSaving}
                        disabled={!editForm.name.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSaving ? 'Speichere...' : 'Einstellungen speichern'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <h2 className="text-xl font-medium text-gray-900">Mandant nicht gefunden</h2>
        <p className="mt-2 text-gray-500">Der gesuchte Mandant existiert nicht oder wurde entfernt.</p>
        <Link to="/clients" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
          Zurück zur Mandantenliste
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/clients" className="text-blue-600 hover:text-blue-500 flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zu Mandanten
        </Link>
      </div>
      
      <PageHeader
        title={client.name}
        description={
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{client.legalForm || 'Nicht angegeben'}</span>
            </div>
            {client.employeeCount > 0 && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{client.employeeCount} Mitarbeiter</span>
              </div>
            )}
            {client.city && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{client.city}</span>
              </div>
            )}
            {client.telefon && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{client.telefon}</span>
              </div>
            )}
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('benefits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'benefits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Benefits
              </div>
            </button>
            <button
              onClick={() => handleTabChange('mitarbeiter')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mitarbeiter'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Mitarbeiter
              </div>
            </button>
            <button
              onClick={() => handleTabChange('einstellungen')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'einstellungen'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Einstellungen
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ClientDetailPage;