import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Gift, Users, Settings, Plus, Edit, Trash2, Grid, List, Building2, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Client } from '../types';
import { showSuccess, showError } from '../lib/toast';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import OptimizationsList from '../components/optimization/OptimizationsList';
import OptimizationCard from '../components/optimization/OptimizationCard';
import OptimizationSettings from '../components/optimization/OptimizationSettings';

interface LegalForm {
  id: number;
  name: string;
  category: string;
}

interface Benefit {
  id: number;
  name: string;
  beschreibung: string;
  max_betrag_monat: number;
  paragraf: string;
}

interface Employee {
  id: string;
  vorname: string;
  nachname: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}

type TabType = 'benefits' | 'mitarbeiter' | 'einstellungen';
type ViewMode = 'list' | 'kanban';

const Tabs = [
  { id: 'benefits', label: 'Benefits', icon: Gift },
  { id: 'mitarbeiter', label: 'Mitarbeiter', icon: Users },
  { id: 'einstellungen', label: 'Einstellungen', icon: Settings },
];

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [client, setClient] = useState<Client | null>(null);
  const [legalForms, setLegalForms] = useState<LegalForm[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [clientBenefits, setClientBenefits] = useState<Benefit[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showOptimizationSettings, setShowOptimizationSettings] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    employee_count: '',
    legal_form: '',
    plz: '',
    ort: '',
    strasse: ''
  });

  const [employeeForm, setEmployeeForm] = useState({
    vorname: '',
    nachname: ''
  });

  // Determine current tab from URL
  const getCurrentTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('/benefits')) return 'benefits';
    if (path.includes('/mitarbeiter')) return 'mitarbeiter';
    if (path.includes('/einstellungen')) return 'einstellungen';
    return 'benefits';
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

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user || id === 'undefined') {
        setClient(null);
        setIsLoading(false);
        return;
      }
      
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
          console.error('Error fetching client:', clientError);
          setClient(null);
          return;
        }

        // Transform client data
        const transformedClient: Client = {
          id: clientData.id.toString(),
          name: clientData.name || 'Unbekannt',
          revenue: 0,
          profit: 0,
          legalForm: clientData.legal_form || undefined,
          status: 'active',
          lastAnalyzed: undefined,
          employeeCount: clientData.employee_count || 0,
          employee_count: clientData.employee_count || 0,
          city: clientData.ort || undefined,
          postalCode: clientData.plz ? parseInt(clientData.plz) : undefined,
          plz: clientData.plz,
          ort: clientData.ort,
          strasse: clientData.strasse,
          created_at: clientData.created_at,
          updated_at: clientData.updated_at
        };

        setClient(transformedClient);

        // Initialize edit form
        setEditForm({
          name: transformedClient.name,
          employee_count: transformedClient.employee_count?.toString() || '',
          legal_form: transformedClient.legalForm?.toString() || '',
          plz: transformedClient.plz || '',
          ort: transformedClient.ort || '',
          strasse: transformedClient.strasse || ''
        });

        // Fetch legal forms
        const { data: legalFormsData, error: legalFormsError } = await supabase
          .from('legal_forms')
          .select('*')
          .order('name');

        if (!legalFormsError) {
          setLegalForms(legalFormsData || []);
        }

        // Fetch benefits
        const { data: benefitsData, error: benefitsError } = await supabase
          .from('benefits')
          .select('*')
          .order('name');

        if (!benefitsError) {
          setBenefits(benefitsData || []);
        }

        // Fetch benefits linked to this client
        const { data: clientBenefitsData, error: clientBenefitsError } = await supabase
          .from('client_benefits')
          .select('*')
          .eq('client', id);

        if (!clientBenefitsError) {
          setClientBenefits(clientBenefitsData || []);
        }

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('client_id', id)
          .order('nachname', { ascending: true });

        if (!employeesError) {
          setEmployees(employeesData || []);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // Handle client settings save
  const handleSaveSettings = async () => {
    if (!client || !user) return;
    
    setIsSaving(true);
    try {
      const updateData: any = {
        name: editForm.name,
        updated_at: new Date().toISOString()
      };

      if (editForm.employee_count) {
        updateData.employee_count = parseInt(editForm.employee_count);
      }
      if (editForm.legal_form) {
        updateData.legal_form = parseInt(editForm.legal_form);
      }
      if (editForm.plz) updateData.plz = editForm.plz;
      if (editForm.ort) updateData.ort = editForm.ort;
      if (editForm.strasse) updateData.strasse = editForm.strasse;

      const { error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', client.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local client state
      setClient(prev => prev ? {
        ...prev,
        name: editForm.name,
        employee_count: editForm.employee_count ? parseInt(editForm.employee_count) : 0,
        legalForm: editForm.legal_form,
        plz: editForm.plz,
        ort: editForm.ort,
        strasse: editForm.strasse
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

  // Handle employee operations
  const handleSaveEmployee = async () => {
    if (!client || !user) return;

    try {
      if (editingEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update({
            vorname: employeeForm.vorname,
            nachname: employeeForm.nachname,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEmployee.id);

        if (error) throw error;

        setEmployees(prev => prev.map(emp => 
          emp.id === editingEmployee.id 
            ? { ...emp, vorname: employeeForm.vorname, nachname: employeeForm.nachname }
            : emp
        ));

        showSuccess('Mitarbeiter erfolgreich aktualisiert');
      } else {
        // Create new employee
        const { data, error } = await supabase
          .from('employees')
          .insert([{
            vorname: employeeForm.vorname,
            nachname: employeeForm.nachname,
            client_id: client.id
          }])
          .select()
          .single();

        if (error) throw error;

        setEmployees(prev => [...prev, data]);
        showSuccess('Mitarbeiter erfolgreich hinzugefügt');
      }

      setShowEmployeeForm(false);
      setEditingEmployee(null);
      setEmployeeForm({ vorname: '', nachname: '' });
    } catch (error) {
      console.error('Error saving employee:', error);
      showError('Fehler beim Speichern des Mitarbeiters');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Möchten Sie diesen Mitarbeiter wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      showSuccess('Mitarbeiter erfolgreich gelöscht');
    } catch (error) {
      console.error('Error deleting employee:', error);
      showError('Fehler beim Löschen des Mitarbeiters');
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      vorname: employee.vorname,
      nachname: employee.nachname
    });
    setShowEmployeeForm(true);
  };

  // Handle benefit toggle
  const handleBenefitToggle = async (benefitId: number, benefitName: string) => {
    if (!client) return;

    try {
      const isCurrentlyLinked = clientBenefits.some(cb => cb.id === benefitId);
      
      if (!isCurrentlyLinked) {
        // Link benefit to client by updating the client field
        const { error } = await supabase
          .from('benefits')
          .update({ client: client.id })
          .eq('id', benefitId);

        if (error) throw error;

        // Refresh benefits linked to this client
        const { data: updatedBenefitsData } = await supabase
          .from('client_benefits')
          .select('*')
          .eq('client', client.id);

        setClientBenefits(updatedBenefitsData || []);
        showSuccess('Benefit erfolgreich hinzugefügt');
      } else {
        // Unlink benefit from client by setting client field to null
        const { error } = await supabase
          .from('benefits')
          .update({ client: null })
          .eq('id', benefitId);

        if (error) throw error;

        setClientBenefits(prev => prev.filter(cb => cb.id !== benefitId));
        showSuccess('Benefit erfolgreich entfernt');
      }
    } catch (error) {
      console.error('Error toggling benefit:', error);
      showError('Fehler beim Aktualisieren des Benefits');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'benefits':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Gift className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Aktive Benefits</h3>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowOptimizationSettings(true)}
                  icon={<Settings size={16} />}
                >
                  Benefits verwalten
                </Button>
              </div>

              {clientBenefits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clientBenefits.map((benefit) => (
                    <div key={benefit.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {benefit.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {benefit.beschreibung}
                      </p>
                      <div className="text-xs text-gray-500">
                        <div>Max: {benefit.max_betrag_monat}€/Monat</div>
                        <div>{benefit.paragraf}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Benefits aktiv</h3>
                  <p className="text-gray-500 mb-4">
                    Fügen Sie Benefits hinzu, um Steuervorteile für Ihre Mitarbeiter zu nutzen.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowOptimizationSettings(true)}
                    icon={<Plus size={16} />}
                  >
                    Benefits hinzufügen
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'mitarbeiter':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Mitarbeiter ({employees.length})
                  </h3>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                    >
                      <List size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('kanban')}
                      className={`p-2 ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                    >
                      <Grid size={16} />
                    </button>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setShowEmployeeForm(true)}
                    icon={<Plus size={16} />}
                  >
                    Mitarbeiter hinzufügen
                  </Button>
                </div>
              </div>

              {employees.length > 0 ? (
                viewMode === 'list' ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Erstellt
                          </th>
                          <th className="relative px-6 py-3">
                            <span className="sr-only">Aktionen</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((employee) => (
                          <tr key={employee.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.vorname} {employee.nachname}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(employee.created_at).toLocaleDateString('de-DE')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditEmployee(employee)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((employee) => (
                      <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {employee.vorname} {employee.nachname}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditEmployee(employee)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Erstellt: {new Date(employee.created_at).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Mitarbeiter</h3>
                  <p className="text-gray-500 mb-4">
                    Fügen Sie Mitarbeiter hinzu, um Benefits zu verwalten.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowEmployeeForm(true)}
                    icon={<Plus size={16} />}
                  >
                    Ersten Mitarbeiter hinzufügen
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'einstellungen':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Mandanten-Einstellungen</h3>
              </div>
              
              <div className="space-y-6">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rechtsform
                    </label>
                    <select
                      value={editForm.legal_form}
                      onChange={(e) => {
                        setEditForm(prev => ({ ...prev, legal_form: e.target.value }));
                        setIsEditing(true);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Rechtsform auswählen</option>
                      {legalForms.map(form => (
                        <option key={form.id} value={form.id}>{form.name}</option>
                      ))}
                    </select>
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Straße
                    </label>
                    <input
                      type="text"
                      value={editForm.strasse}
                      onChange={(e) => {
                        setEditForm(prev => ({ ...prev, strasse: e.target.value }));
                        setIsEditing(true);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (client) {
                            setEditForm({
                              name: client.name,
                              employee_count: client.employee_count?.toString() || '',
                              legal_form: client.legalForm?.toString() || '',
                              plz: client.plz || '',
                              ort: client.ort || '',
                              strasse: client.strasse || ''
                            });
                          }
                          setIsEditing(false);
                        }}
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
              <span className="font-medium">Mitarbeiter:</span>
              <span className="ml-1">{client.employee_count || 0}</span>
            </div>
            {client.ort && (
              <div className="flex items-center">
                <span className="font-medium">Ort:</span>
                <span className="ml-1">{client.ort}</span>
              </div>
            )}
          </div>
        }
      />


      

     {/* Overview & Tab Navigation */}
<div className="bg-white rounded-lg shadow mb-8 px-6 py-4">
  {/* Overview Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    
    {/* Mitarbeiter */}
    <div className="flex items-center">
      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
        <Users className="h-5 w-5 text-gray-600" />
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">
          {employees.length} Mitarbeiter
        </div>
        <div className="text-sm text-gray-500">
          {client.employee_count ? `von ${client.employee_count} erfasst` : 'erfasst'}
        </div>
      </div>
    </div>

    {/* Benefits */}
    <div className="flex items-center">
      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
        <Gift className="h-5 w-5 text-green-600" />
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">
          {clientBenefits.length} Benefits
        </div>
        <div className="text-sm text-gray-500">aktiv</div>
      </div>
    </div>

    {/* Letzte Analyse */}
    <div className="flex items-center">
      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
        <Calendar className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">
          {client.created_at 
            ? new Date(client.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : 'Nie'}
        </div>
        <div className="text-sm text-gray-500">Analysiert</div>
      </div>
    </div>

    {/* Sparpotenzial */}
    <div className="flex items-center">
      <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
        <TrendingUp className="h-5 w-5 text-yellow-600" />
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">
          {clientBenefits.length > 0 
            ? `${(clientBenefits.length * 600).toLocaleString('de-DE')} €` 
            : '0 €'}
        </div>
        <div className="text-sm text-gray-500">Potenzial/Jahr</div>
      </div>
    </div>
  </div>

  {/* Tabs */}
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      {Tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => handleTabChange(id as TabType)}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <Icon className="h-5 w-5 mr-2" />
            {label}
          </div>
        </button>
      ))}
    </nav>
  </div>
</div>

      {/* Tab Content */}
      <div className="mb-8">
        {renderTabContent()}
      </div>

  
      {/* Benefits Management Modal */}
      {showOptimizationSettings && (
        <OptimizationSettings
          optimizations={benefits.map(benefit => ({
            id: benefit.id.toString(),
            title: benefit.name,
            description: benefit.beschreibung,
            isActive: clientBenefits.some(cb => cb.id === benefit.id)
          }))}
          onToggle={(id, title) => {
            handleBenefitToggle(parseInt(id), title);
          }}
          isOpen={showOptimizationSettings}
          onClose={() => setShowOptimizationSettings(false)}
        />
      )}

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingEmployee ? 'Mitarbeiter bearbeiten' : 'Neuen Mitarbeiter hinzufügen'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vorname
                </label>
                <input
                  type="text"
                  value={employeeForm.vorname}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, vorname: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nachname
                </label>
                <input
                  type="text"
                  value={employeeForm.nachname}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, nachname: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEmployeeForm(false);
                  setEditingEmployee(null);
                  setEmployeeForm({ vorname: '', nachname: '' });
                }}
              >
                Abbrechen
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEmployee}
                disabled={!employeeForm.vorname.trim() || !employeeForm.nachname.trim()}
              >
                {editingEmployee ? 'Aktualisieren' : 'Hinzufügen'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailPage;