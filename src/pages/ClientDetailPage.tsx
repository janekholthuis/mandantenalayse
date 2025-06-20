import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, RefreshCw, BarChart3, FileText, Settings } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Client, Contract } from '../types';
import { formatCurrency } from '../utils/formatters';
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
type TabType = 'Benefits' | 'Mitarbeiter' | 'Einstellungen';

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
    legalForm: ''
  });
  
  // Determine current tab from URL
  const getCurrentTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('/benefits')) return 'Benefits';
    if (path.includes('/employees')) return 'Mitarbeiter';
    if (path.includes('/settings')) return 'Einstellungen';
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
        // Fetch client data
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

        // Fetch contracts
        const { data: contractsData, error: contractsError } = await supabase
          .from('contracts')
          .select('*')
          .eq('mandant_id', id);

        if (contractsError) {
          console.error('Error fetching contracts:', contractsError);
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
          employeeCount: 0, // Not in clients table
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
        
        // Set contracts
        if (contractsData) {
          setContracts(contractsData);
        }
        
        // Initialize edit form with current client data
        setEditForm({
          name: transformedClient.name,
          legalForm: transformedClient.legalForm || ''
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
          unternehmensform: editForm.legalForm,
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
        legalForm: editForm.legalForm
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
        legalForm: client.legalForm || ''
      });
    }
    setIsEditing(false);
  };
  const handleBankConnection = () => {
    setBankConnected(true);
  };

  const handleDocumentUploaded = () => {
    setDocumentsUploaded(true);
  };

  const handleEmailSent = () => {
    setEmailSent(true);
  };

  const handleOptimizationStatusChange = (optimizationId: string, newStatus: string) => {
    setCostOptimizations(prev => 
      prev.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, status: newStatus }
          : opt
      )
    );
  };

  const calculateCostOptimizationPotential = () => {
    if (!bankConnected) return 0;
    
    return costOptimizations
      .filter(opt => opt.status === 'waiting-for-client')
      .reduce((sum, opt) => sum + opt.potentialSavings, 0);
  };

  const calculateTotalSavings = () => {
    return contracts
      .filter(contract => contract.wechsel_empfohlen)
      .reduce((sum, contract) => sum + (contract.optimizationPotential || 0), 0);
  };

  const calculateImplementedSavings = () => {
    return contracts
      .filter(contract => contract.status === 'optimiert')
      .reduce((sum, contract) => sum + (contract.optimizationPotential || 0), 0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Benefits':
        return (
           <h3 className="text-lg font-medium text-gray-900">Mandanten-Einstellungen</h3>
        );
      
   
      
      case 'Einstellungen':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Mandanten-Einstellungen</h3>
              </div>
              
              {/* Client Information */}
              <div className="space-y-6">
                <div>
          
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
                        Rechtsform
                      </label>
                      <select
                        value={editForm.legalForm}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, legalForm: e.target.value }));
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
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium">Rechtsform:</span>
              <span className="ml-1">{client.legalForm || 'Nicht angegeben'}</span>
            </div>
          </div>
        }
        actions={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              icon={<Upload size={16} />}
              onClick={() => document.getElementById('document-upload')?.click()}
              className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
            >
              Dokumente hochladen
            </Button>
            <div className="relative">
              <input
                type="file"
                id="document-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </div>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('Benefits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'Benefits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Transaktionen
              </div>
            </button>
            <button
              onClick={() => handleTabChange('Mitabeiter')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contracts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Verträge
              </div>
            </button>
            <button
              onClick={() => handleTabChange('Einstellungen')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
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
      
      {/* Summary Cards */}
      {/* Summary Cards - Hidden in Settings tab */}
      {activeTab !== 'settings' && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Übersicht
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Analysierte Verträge</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {bankConnected ? '3' : '0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">KI-Analyse durchgeführt</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Bereits eingespart</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  <span>
                    {formatCurrency(calculateImplementedSavings())}
                    <span className="text-sm font-normal text-gray-500 ml-1">p.a.</span>
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Umgesetzte Optimierungen</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Identifizierte Potentiale</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {bankConnected ? '2' : '0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Optimierungsmöglichkeiten</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Einsparungspotential</p>
                <p className="mt-1 text-2xl font-semibold text-blue-900">
                  <span>
                    {formatCurrency(calculateTotalSavings() + calculateCostOptimizationPotential())}
                    <span className="text-sm font-normal text-blue-500 ml-1">p.a.</span>
                  </span>
                </p>
                <p className="text-xs text-blue-600 mt-1">Gesamtpotential</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="mb-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ClientDetailPage;