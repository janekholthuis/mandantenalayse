import React, { useState, useMemo } from 'react';
import { UserPlus, Upload, Trash2, RotateCcw, Grid, List, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientCard from '../components/client/ClientCard';
import EnhancedClientImportForm from '../components/client/EnhancedClientImportForm';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { showSuccess, showError } from '../lib/toast';
import { Client } from '../types';

const ClientsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [clients, setClients] = useState<Client[]>([]);
  const [deletedClients, setDeletedClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      (client.industry && client.industry.toLowerCase().includes(term)) ||
      (client.legalForm && client.legalForm.toLowerCase().includes(term))
    );
  }, [searchTerm, clients]);

  const filteredDeletedClients = useMemo(() => {
    if (!searchTerm) return deletedClients;
    
    const term = searchTerm.toLowerCase();
    return deletedClients.filter(client => 
      client.name.toLowerCase().includes(term)
    );
  }, [searchTerm, deletedClients]);

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      const { data: mandantenData, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Client interface
      const transformedClients: Client[] = (mandantenData || []).map(clientData => ({
        id: clientData.id,
        name: clientData.name || 'Unbekannt',
        industry: clientData.branchenschluessel_bezeichnung || undefined,
        revenue: 0,
        profit: 0,
        legalForm: clientData.unternehmensform || undefined,
        status: 'active', // Default to active for non-deleted clients
        lastAnalyzed: undefined, // Will be determined by checking contracts
        employeeCount: 0, // Not in clients table
        city: clientData.ort || undefined,
        postalCode: clientData.plz ? parseInt(clientData.plz) : undefined,
        // Include Supabase specific fields
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
      }));

      // Check for contracts to determine lastAnalyzed


      setClients(transformedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeletedClients = async () => {
    if (!user) return;
    
    try {
      const { data: deletedData, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;

      const transformedDeletedClients: Client[] = (deletedData || []).map(clientData => ({
        id: clientData.id,
        name: clientData.name || 'Unbekannt',
        status: 'inactive',
        employeeCount: clientData.employee_count || 0,
        city: clientData.ort || undefined,
        postalCode: clientData.plz ? parseInt(clientData.plz) : undefined,
        plz: clientData.plz,
        ort: clientData.ort,
        created_at: clientData.created_at,
        updated_at: clientData.updated_at,
        deleted_at: clientData.deleted_at
      }));

      setDeletedClients(transformedDeletedClients);
    } catch (error) {
      console.error('Error fetching deleted clients:', error);
      setDeletedClients([]);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', clientId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Remove from active clients and refresh
      setClients(prev => prev.filter(client => client.id !== clientId));
      fetchDeletedClients(); // Refresh deleted clients
      showSuccess('Mandant wurde in den Papierkorb verschoben');
    } catch (error) {
      console.error('Error deleting client:', error);
      showError('Fehler beim Löschen des Mandanten');
    }
  };

  const handleRestoreClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ deleted_at: null })
        .eq('id', clientId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Remove from deleted clients and refresh active clients
      setDeletedClients(prev => prev.filter(client => client.id !== clientId));
      fetchClients(); // Refresh active clients
      showSuccess('Mandant wurde wiederhergestellt');
    } catch (error) {
      console.error('Error restoring client:', error);
      showError('Fehler beim Wiederherstellen des Mandanten');
    }
  };

  const handlePermanentDelete = async (clientId: string) => {
    if (!confirm('Möchten Sie diesen Mandanten PERMANENT löschen? Diese Aktion kann nicht rückgängig gemacht werden!')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setDeletedClients(prev => prev.filter(client => client.id !== clientId));
      showSuccess('Mandant wurde permanent gelöscht');
    } catch (error) {
      console.error('Error permanently deleting client:', error);
      showError('Fehler beim permanenten Löschen des Mandanten');
    }
  };

  const handleImportComplete = () => {
    fetchClients(); // Refresh the client list after import
  };

  // Fetch clients on component mount
  React.useEffect(() => {
    if (user && isLoading) {
      fetchClients();
      fetchDeletedClients();
    }
  }, [user, isLoading]);
  
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {showTrash ? 'Papierkorb' : 'Mandanten'}
              </h1>
              <button
                onClick={() => setShowTrash(!showTrash)}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  showTrash 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Trash2 size={14} className="mr-1" />
                Papierkorb ({deletedClients.length})
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {showTrash 
                ? 'Gelöschte Mandanten verwalten und wiederherstellen'
                : 'Verwalten und analysieren Sie Ihr Mandantenportfolio'
              }
            </p>
          </div>
          {!showTrash && (
            <div className="flex space-x-3">
              <Link to="/clients/add">
                <Button
                  variant="primary"
                  icon={<UserPlus size={16} />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Mandanten hinzufügen
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={showTrash ? "Gelöschte Mandanten suchen..." : "Mandanten nach Name oder Unternehmensform suchen..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {!showTrash && (
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                  title="Kachel-Ansicht"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                  title="Listen-Ansicht"
                >
                  <List size={16} />
                </button>
              </div>
            )}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {/* Search functionality already handled by filteredClients */}}
            >
              Suchen
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : showTrash ? (
          // Trash View
          <div className="space-y-4">
            {filteredDeletedClients.map(client => (
              <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      {client.city && <span>📍 {client.city}</span>}
                      <span>🗑️ Gelöscht: {client.deleted_at ? new Date(client.deleted_at).toLocaleDateString('de-DE') : 'Unbekannt'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleRestoreClient(client.id)}
                      icon={<RotateCcw size={16} />}
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    >
                      Wiederherstellen
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handlePermanentDelete(client.id)}
                      icon={<Trash2 size={16} />}
                    >
                      Permanent löschen
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredDeletedClients.length === 0 && (
              <div className="text-center py-12">
                <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Papierkorb ist leer</h3>
                <p className="text-gray-500">
                  {searchTerm ? `Keine gelöschten Mandanten gefunden für "${searchTerm}"` : 'Keine gelöschten Mandanten vorhanden'}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Normal View
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                  <ClientCard key={client.id} client={client} onDelete={handleDeleteClient} />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mandant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unternehmensform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ort
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
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                          
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.name}
                              </div>
                            
                            </div>
                          </div>
                    
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.legalForm || 'Nicht angegeben'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.city || 'Nicht angegeben'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.created_at ? new Date(client.created_at).toLocaleDateString('de-DE') : 'Unbekannt'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/clients/${client.id}`}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Details anzeigen"
                            >
                              Details
                            </Link>
                            <Link
                              to={`/clients/${client.id}/einstellungen`}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Einstellungen"
                            >
                              <Settings size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Löschen"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}</tr><<<<<
                  </tbody>
                </table>
              </div>
            )}
            
            {filteredClients.length === 0 && !isLoading && (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <p className="text-gray-500">Keine Mandanten gefunden für "{searchTerm}"</p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={() => setSearchTerm('')}
                    >
                      Suche zurücksetzen
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">Noch keine Mandanten vorhanden</p>
                    <Link to="/clients/add">
                      <Button
                        variant="primary"
                        icon={<UserPlus size={16} />}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Ersten Mandanten hinzufügen
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* CSV Import Modal */}
      {showImportForm && (
        <EnhancedClientImportForm
          onImportComplete={handleImportComplete}
          onClose={() => setShowImportForm(false)}
        />
      )}
    </>
  );
};

export default ClientsPage;