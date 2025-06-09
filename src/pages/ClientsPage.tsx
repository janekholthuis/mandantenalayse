import React, { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PageHeader from '../components/layout/PageHeader';
import ClientCard from '../components/client/ClientCard';
import ClientSearch from '../components/client/ClientSearch';
import Button from '../components/ui/Button';
import { mockClients } from '../data/mockData';

const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = useMemo(() => {
    if (!searchTerm) return mockClients;
    
    const term = searchTerm.toLowerCase();
    return mockClients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.industry.toLowerCase().includes(term) ||
      client.legalForm.toLowerCase().includes(term)
    );
  }, [searchTerm]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mandanten</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verwalten und analysieren Sie Ihr Mandantenportfolio
          </p>
        </div>
        <Link to="/clients/new">
          <Button
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Neuen Mandanten hinzufügen
          </Button>
        </Link>
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
          >
            Suchen
          </button>
        </div>
      </div>
      
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
    </div>
  );
};

export default ClientsPage;