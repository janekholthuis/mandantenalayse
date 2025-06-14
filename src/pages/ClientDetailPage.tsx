import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, RefreshCw, BarChart3, FileText, Settings, Zap, AlertCircle, Wand2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import OptimizationCard from '../components/optimization/OptimizationCard';
import OptimizationSettings from '../components/optimization/OptimizationSettings';
import ClientAnalysis from '../components/client/ClientAnalysis';
import CostAnalysisTab from '../components/cost-analysis/CostAnalysisTab';
import OptimizationsList from '../components/optimization/OptimizationsList';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ClientDetail, OptimizationItem, Employee } from '../types';
import { formatCurrency } from '../utils/formatters';
import { showSuccess, showError } from '../lib/toast';

const OPTIMIZATIONS = [
  {
    id: 'sachbezug',
    title: 'Sachbezug',
    description: 'Steuerfreier oder pauschalversteuerter geldwerter Vorteil bis zu 50 € pro Monat, z. B. als Gutschein.'
  },
  {
    id: 'essenszuschuss',
    title: 'Essenszuschuss',
    description: 'Arbeitgeberzuschuss für Mahlzeiten, z. B. durch Essensmarken oder Kantine.'
  },
  {
    id: 'jobticket',
    title: 'Jobticket',
    description: 'Steuerfreies oder pauschalbesteuertes Ticket für den ÖPNV.'
  },
  {
    id: 'fahrtkostenzuschuss',
    title: 'Fahrtkostenzuschuss',
    description: 'Zuschuss für Fahrten zwischen Wohnung und Arbeitsstätte.'
  },
  {
    id: 'internetpauschale',
    title: 'Internetpauschale',
    description: 'Steuerfreier Zuschuss bis 50 € monatlich für private Internetnutzung.'
  },
  {
    id: 'gesundheitsfoerderung',
    title: 'Gesundheitsförderung',
    description: 'Bis zu 600 € jährlich für zertifizierte Gesundheitsmaßnahmen steuerfrei.'
  },
  {
    id: 'kinderbetreuung',
    title: 'Kinderbetreuungskosten',
    description: 'Steuerfreier Zuschuss zu Kita, Tagesmutter etc.'
  },
  {
    id: 'bav',
    title: 'Betriebliche Altersvorsorge (bAV)',
    description: 'Beiträge sind steuer- und sozialversicherungsfrei bis zur Höchstgrenze.'
  },
  {
    id: 'erholungsbeihilfe',
    title: 'Erholungsbeihilfe',
    description: 'Steuerbegünstigter Zuschuss für Urlaub und Erholung.'
  },
  {
    id: 'tankgutschein',
    title: 'Tankgutschein',
    description: 'Monatlicher Gutschein im Rahmen des Sachbezugs.'
  },
  {
    id: 'gutscheinkarten',
    title: 'Gutscheinkarten',
    description: 'Prepaid-Karten im Rahmen des Sachbezugs, z. B. für Shopping oder Tanken.'
  },
  {
    id: 'dienstwagen',
    title: 'Dienstwagen',
    description: 'Private Nutzung eines Firmenwagens mit 1 %-Regel oder Fahrtenbuch.'
  },
  {
    id: 'vl',
    title: 'Vermögenswirksame Leistungen (VL)',
    description: 'Arbeitgeberleistung zur privaten Vermögensbildung.'
  }
];

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
type TabType = 'transactions' | 'contracts' | 'optimizations' | 'settings';

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeOptimizations, setActiveOptimizations] = useState<Set<string>>(new Set());
  const [bankConnected, setBankConnected] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [costOptimizations, setCostOptimizations] = useState([
    {
      id: 'stromvertrag',
      title: 'Stromvertrag optimieren',
      description: 'Wechsel zu günstigerem Stromanbieter mit besseren Konditionen',
      status: 'document-missing',
      potentialSavings: 210,
      requirements: ['Aktueller Stromvertrag', 'Jahresverbrauch'],
      missingDocuments: ['Stromvertrag', 'Letzte Stromrechnung']
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    legalForm: ''
  });
  const optimizationsRef = useRef<HTMLDivElement>(null);
  
  // Determine current tab from URL
  const getCurrentTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('/transactions')) return 'transactions';
    if (path.includes('/contracts')) return 'contracts';
    if (path.includes('/optimizations')) return 'optimizations';
    if (path.includes('/settings')) return 'settings';
    return 'transactions'; // Default tab
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
          .from('Mandanten')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (clientError) {
          console.error('Error fetching client:', clientError);
          setClient(null);
          return;
        }

        if (!clientData) {
          setClient(null);
          return;
        }

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('mandant_id', id)
          .eq('user_id', user.id);

        if (employeesError) {
          console.error('Error fetching employees:', employeesError);
        }

        // Fetch optimizations
        const { data: optimizationsData, error: optimizationsError } = await supabase
          .from('optimizations')
          .select('*')
          .eq('mandant_id', id)
          .eq('user_id', user.id);

        if (optimizationsError) {
          console.error('Error fetching optimizations:', optimizationsError);
        }

        // Transform Supabase data to ClientDetail interface
        const transformedClient: ClientDetail = {
          id: clientData.id.toString(),
          name: clientData.name || 'Unbekannt',
          industry: clientData.branchenschluessel_bezeichnung || 'Nicht angegeben',
          revenue: 0,
          profit: 0,
          legalForm: clientData.unternehmensform || 'Nicht angegeben',
          status: clientData.status === 'aktiv' ? 'active' : 'inactive',
          lastAnalyzed: optimizationsData && optimizationsData.length > 0 ? clientData.updated_at : undefined,
          employeeCount: clientData.Mitarbeiter_Anzahl || 0,
          city: clientData.ort || undefined,
          postalCode: clientData.plz ? parseInt(clientData.plz) : undefined,
          optimizations: (optimizationsData || []).map(opt => ({
            id: opt.id,
            title: opt.title,
            description: opt.description || '',
            potentialSavings: opt.potential_savings || 0,
            status: opt.status as any,
            category: opt.category as any,
            requirements: opt.requirements || [],
            employeeCount: opt.employee_count || 0,
            employeesAnalyzed: opt.employees_analyzed || 0,
            employeesBenefiting: opt.employees_benefiting || 0,
            netBenefitEmployee: opt.net_benefit_employee || 0,
            employerCost: opt.employer_cost || 0,
            mandant_id: opt.mandant_id,
            user_id: opt.user_id
          })),
          employees: (employeesData || []).map(emp => ({
            id: emp.id,
            name: emp.name,
            position: emp.position || '',
            department: emp.department || '',
            mandant_id: emp.mandant_id,
            user_id: emp.user_id
          })),
          totalEmployeesAnalyzed: employeesData?.length || 0
        };

        setClient(transformedClient);
      } catch (error) {
        console.error('Error fetching client:', error);
        setClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id, user]);

  // Initialize edit form when client data is loaded
  useEffect(() => {
    if (client && !isEditing) {
      setEditForm({
        name: client.name || '',
        legalForm: client.legalForm || ''
      });
    }
  }, [client, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values when canceling
      setEditForm({
        name: client?.name || '',
        legalForm: client?.legalForm || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveClient = async () => {
    if (!client || !user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('Mandanten')
        .update({
          name: editForm.name,
          unternehmensform: editForm.legalForm,
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local client state
      setClient(prev => prev ? {
        ...prev,
        name: editForm.name,
        legalForm: editForm.legalForm
      } : null);

      setIsEditing(false);
      showSuccess('Mandantendaten erfolgreich aktualisiert');
    } catch (error) {
      console.error('Error updating client:', error);
      showError('Fehler beim Speichern der Mandantendaten');
    } finally {
      setIsSaving(false);
    }
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
    if (!client?.optimizations) return 0;
    return client.optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);
  };

  const calculateImplementedSavings = () => {
    if (!client?.optimizations) return 0;
    return client.optimizations
      .filter(opt => opt.status === 'implemented' || opt.status === 'used')
      .reduce((sum, opt) => sum + opt.potentialSavings, 0);
  };

  const getOptimizationStats = () => {
    if (!client?.optimizations) return { used: 0, total: OPTIMIZATIONS.length };
    const used = client.optimizations.filter(opt => 
      opt.status === 'implemented' || opt.status === 'used'
    ).length;
    return {
      used,
      total: OPTIMIZATIONS.length
    };
  };

  const handleToggleOptimization = (optId: string, title: string) => {
    setActiveOptimizations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const handleAnalysisComplete = async (newOptimizations: OptimizationItem[]) => {
    if (!client || !user) return;
    
    try {
      // Save optimizations to database
      const optimizationsToInsert = newOptimizations.map(opt => ({
        title: opt.title,
        description: opt.description,
        status: opt.status,
        category: opt.category,
        potential_savings: opt.potentialSavings,
        mandant_id: client.id,
        user_id: user.id,
        employee_count: opt.employeeCount,
        employees_analyzed: opt.employeesAnalyzed || 0,
        employees_benefiting: opt.employeesBenefiting || 0,
        net_benefit_employee: opt.netBenefitEmployee || 0,
        employer_cost: opt.employerCost || 0,
        requirements: opt.requirements
      }));

      const { error } = await supabase
        .from('optimizations')
        .insert(optimizationsToInsert);

      if (error) {
        console.error('Error saving optimizations:', error);
      }

      // Update client state
      setClient({
        ...client,
        lastAnalyzed: new Date().toISOString(),
        optimizations: newOptimizations
      });
      
      setIsAnalyzing(false);
      setShowOptimizations(true);
      
      setTimeout(() => {
        optimizationsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error in analysis complete:', error);
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transactions':
        return (
          <CostAnalysisTab 
            onBankConnection={handleBankConnection}
            onDocumentUploaded={handleDocumentUploaded}
            onEmailSent={handleEmailSent}
            onOptimizationStatusChange={handleOptimizationStatusChange}
          />
        );
      
      case 'contracts':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Vertragsmanagement</h3>
              </div>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Verträge verwalten</h3>
                <p className="text-gray-500 mb-6">
                  Hier können Sie alle Verträge des Mandanten einsehen und verwalten.
                </p>
                <Button
                  variant="primary"
                  icon={<Upload size={16} />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Vertrag hochladen
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'optimizations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">MA-Benefits Optimierungen</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                  title="Optimierungen konfigurieren"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {!client?.lastAnalyzed ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-amber-800 mb-2">
                  Noch keine Analyse durchgeführt
                </h3>
                <p className="text-amber-700 mb-4">
                  Führen Sie eine Analyse durch, um Optimierungspotenziale zu identifizieren.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setIsAnalyzing(true)}
                  className="bg-white text-amber-700 border border-amber-300 hover:bg-amber-50"
                  icon={<Wand2 size={16} />}
                >
                  Jetzt analysieren
                </Button>
              </div>
            ) : client.optimizations.length > 0 ? (
              <div className="space-y-4">
                {client.optimizations.map(opt => (
                  <OptimizationCard
                    key={opt.id}
                    title={opt.title}
                    description={opt.description}
                    isActive={activeOptimizations.has(opt.title)}
                    onToggle={() => handleToggleOptimization(opt.id, opt.title)}
                    employeeCount={opt.employeeCount}
                    totalEmployees={client.employeeCount}
                    employeesAnalyzed={opt.employeesAnalyzed}
                    employeesBenefiting={opt.employeesBenefiting}
                    requirements={opt.requirements}
                    netBenefitEmployee={opt.netBenefitEmployee}
                    employerCost={opt.employerCost}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Keine Optimierungen gefunden
                </h3>
                <p className="text-gray-600">
                  Für diesen Mandanten wurden noch keine Optimierungen identifiziert.
                </p>
              </div>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Settings className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Mandanten-Einstellungen</h3>
                </div>
                <div className="flex items-center space-x-3">
                  {isEditing ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={handleEditToggle}
                        disabled={isSaving}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Abbrechen
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSaveClient}
                        isLoading={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Speichern
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleEditToggle}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Bearbeiten
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Client Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Grunddaten</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Firmenname <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Firmenname eingeben"
                          required
                        />
                      ) : (
                        <div className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-900">
                          {client?.name || 'Nicht angegeben'}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rechtsform <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <select
                          value={editForm.legalForm}
                          onChange={(e) => handleFormChange('legalForm', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Rechtsform auswählen</option>
                          {LEGAL_FORMS.map((form) => (
                            <option key={form} value={form}>
                              {form}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-900">
                          {client?.legalForm || 'Nicht angegeben'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="text-sm font-medium text-blue-900 mb-1">Hinweis</h5>
                          <p className="text-sm text-blue-800">
                            Änderungen an den Grunddaten können sich auf bestehende Analysen und Optimierungen auswirken. 
                            Stellen Sie sicher, dass alle Angaben korrekt sind.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

  const optimizationStats = getOptimizationStats();

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
              <span className="font-medium">Branche:</span>
              <span className="ml-1">{client.industry || 'Nicht angegeben'}</span>
            </div>
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
              icon={<RefreshCw size={16} />}
              onClick={() => setIsAnalyzing(true)}
              className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
            >
              Neu analysieren
            </Button>
            <div className="relative">
              <input
                type="file"
                id="document-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
              <Button
                variant="primary"
                icon={<Upload size={16} />}
                onClick={() => document.getElementById('document-upload')?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Dokumente hochladen
              </Button>
            </div>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Transaktionen
              </div>
            