import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, RefreshCw, ChevronDown, ChevronUp, Users, Settings, AlertCircle, BarChart3, List, Wand2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import OptimizationCard from '../components/optimization/OptimizationCard';
import OptimizationSettings from '../components/optimization/OptimizationSettings';
import ClientAnalysis from '../components/client/ClientAnalysis';
import CostAnalysisTab from '../components/cost-analysis/CostAnalysisTab';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ClientDetail, OptimizationItem, Employee } from '../types';
import { formatCurrency } from '../utils/formatters';

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

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeOptimizations, setActiveOptimizations] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'optimizations' | 'transactions'>('transactions');
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
  const optimizationsRef = useRef<HTMLDivElement>(null);
  
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
        description={`${client.industry} | ${client.legalForm}`}
        actions={
          <div className="flex space-x-3">
            {/* Hide MA-Benefits analysis buttons for now */}
            {false && (
              <>
                <Button
                  variant="secondary"
                  icon={<RefreshCw size={16} />}
                  onClick={() => setIsAnalyzing(true)}
                  className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                >
                  {client.lastAnalyzed ? 'Neu analysieren' : 'Analysieren'}
                </Button>
                {client.lastAnalyzed && (
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
                )}
              </>
            )}
          </div>
        }
      />
      
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            KI-gestützte Kostenanalyse
          </h3>
          {/* Unified analysis metrics */}
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
                {bankConnected ? (
                  <span>
                    {formatCurrency(0)}
                    <span className="text-sm font-normal text-gray-500 ml-1">p.a.</span>
                  </span>
                ) : (
                  <span>
                    {formatCurrency(0)}
                    <span className="text-sm font-normal text-gray-500 ml-1">p.a.</span>
                  </span>
                )}
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
                {bankConnected ? (
                  <span>
                    {formatCurrency(calculateCostOptimizationPotential())}
                    <span className="text-sm font-normal text-blue-500 ml-1">p.a.</span>
                  </span>
                ) : (
                  <span>
                    {formatCurrency(0)}
                    <span className="text-sm font-normal text-blue-500 ml-1">p.a.</span>
                  </span>
                )}
              </p>
              <p className="text-xs text-blue-600 mt-1">KI-identifizierte Potentiale</p>
            </div>
          </div>

          {/* Analysis Status */}
          {!bankConnected && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Bereit für KI-Analyse</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Laden Sie Buchungsdaten hoch, um automatisch Optimierungspotenziale zu identifizieren.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            {/* Mitarbeiterliste entfernt für mehr Simplizität */}
          </div>
        </div>
      </div>
      
      {/* KI-gestützte Kostenanalyse */}
      <div className="mb-8" ref={optimizationsRef}>
        <CostAnalysisTab 
          onBankConnection={handleBankConnection}
          onDocumentUploaded={handleDocumentUploaded}
          onEmailSent={handleEmailSent}
          onOptimizationStatusChange={handleOptimizationStatusChange}
        />
      </div>

    </div>
  );
};

export default ClientDetailPage;