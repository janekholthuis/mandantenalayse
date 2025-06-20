import React, { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientCard from '../components/client/ClientCard';
import EnhancedClientImportForm from '../components/client/EnhancedClientImportForm';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Client } from '../types';

const ClientsPage: React.FC = () => {
const { user } = useAuth();
const \[searchTerm, setSearchTerm] = useState('');
const \[showImportForm, setShowImportForm] = useState(false);
const \[clients, setClients] = useState\<Client\[]>(\[]);
const \[isLoading, setIsLoading] = useState(true);

const filteredClients = useMemo(() => {
if (!searchTerm) return clients;

```
const term = searchTerm.toLowerCase();
return clients.filter(client => 
  client.name.toLowerCase().includes(term) ||
  (client.legalForm && client.legalForm.toLowerCase().includes(term))
);
```

}, \[searchTerm, clients]);

const fetchClients = async () => {
if (!user) return;

```
try {
  const { data: mandantenData, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const transformedClients: Client[] = (mandantenData || []).map(clientData => ({
    id: clientData.id.toString(),
    name: clientData.name || 'Unbekannt',
    legalForm: clientData.unternehmensform || undefined,
    status: clientData.status === 'aktiv' ? 'active' : 'inactive',
    employeeCount: 0,
    city: clientData.ort || undefined,
    postalCode: clientData.plz ? parseInt(clientData.plz) : undefined
  }));

  setClients(transformedClients);
} catch (error) {
  console.error('Error fetching clients:', error);
  setClients([]);
} finally {
  setIsLoading(false);
}
```

};

const handleImportComplete = () => {
fetchClients();
};

React.useEffect(() => {
if (user && isLoading) {
fetchClients();
}
}, \[user, isLoading]);

return (
<> <div> <div className="flex justify-between items-center mb-6"> <div> <h1 className="text-2xl font-bold text-gray-900">Mandanten</h1> <p className="mt-1 text-sm text-gray-500">
Verwalten und analysieren Sie Ihr Mandantenportfolio </p> </div> <div className="flex space-x-3"> <Link to="/clients/add">
\<Button
variant="primary"
icon={<UserPlus size={16} />}
className="bg-blue-600 hover\:bg-blue-700"
\>
Mandanten hinzufügen </Button> </Link> </div> </div>

```
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Mandanten nach Name oder Rechtsform suchen..."
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

    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}

        {filteredClients.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12">
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
      </div>
    )}
  </div>

  {showImportForm && (
    <EnhancedClientImportForm
      onImportComplete={handleImportComplete}
      onClose={() => setShowImportForm(false)}
    />
  )}
</>
```

);
};

export default ClientsPage;
