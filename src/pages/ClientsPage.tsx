import React, { useState, useMemo } from 'react';
import { UserPlus, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PageHeader from '../components/layout/PageHeader';
import ClientCard from '../components/client/ClientCard';
import ClientSearch from '../components/client/ClientSearch';
import ClientImportForm from '../components/client/ClientImportForm';
import Button from '../components/ui/Button';
import { mockClients } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const ClientsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);
  const [clients, setClients] = useState(mockClients);
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredClients = useMemo(() => {
    if (!searchTerm) return mockClients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.industry.toLowerCase().includes(term) ||
      client.legalForm.toLowerCase().includes(term)
    );
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Mandanten')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Client interface
      const transformedClients = data.map(client => ({
        id: client.id.toString(),
        name: client.Firmenname,
        industry: 'Unbekannt', // Default since not in schema
        revenue: 0, // Default since not in schema
        profit: 0, // Default since not in schema
        legalForm: 'Unbekannt', // Default since not in schema
        status: 'active' as const,
        lastAnalyzed: undefined,
        employeeCount: 0,
        city: client.Stadt,
        postalCode: client.PLZ
      }));

      setClients([...mockClients, ...transformedClients]);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportComplete = () => {
    fetchClients(); // Refresh the client list after import
  };

  // Fetch clients on component mount
  React.useEffect(() => {
    fetchClients();
  }, [user]);
  
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mandanten</h1>
            <p className="mt-1 text-sm text-gray-500">
              Verwalten und analysieren Sie Ihr Mandantenportfolio
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowImportForm(true)}
              icon={<Upload size={16} />}
              className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
            >
              Mandanten hochladen
            </Button>
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
        </div>
        
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Mandanten nach Name, Branche oder Rechtsform suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
            
            {filteredClients.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Keine Mandanten gefunden für "{searchTerm}"</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Suche zurücksetzen
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSV Import Modal */}
      {showImportForm && (
        <ClientImportForm
          onImportComplete={handleImportComplete}
          onClose={() => setShowImportForm(false)}
        />
      )}
    </>
  );
};

export default ClientsPage;