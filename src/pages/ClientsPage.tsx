import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import { UserPlus, Trash2, Grid, List, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientCard from '../components/client/ClientCard';
import EnhancedClientImportForm from '../components/client/EnhancedClientImportForm';
import Button from '../components/ui/Button';
import { useClients } from '../hooks/useClients';
import { showSuccess } from '../lib/toast';
import { supabase } from '../lib/supabase';
import ClientTable from '../components/client/ClientTable';
import EmptyState from '../components/client/EmptyState';
import EmptyTrash from '../components/client/EmptyTrash';

const ClientsPage: React.FC = () => {
  const { active, deleted, isLoading, refresh } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showImportForm, setShowImportForm] = useState(false);

  const debouncedSetSearch = useCallback(debounce(setSearchText, 300), []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const filterClients = (clients: typeof active | typeof deleted) => {
    if (!searchText) return clients;
    const t = searchText.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(t) ||
      (c.legalForm?.toLowerCase().includes(t) ?? false)
    );
  };

  const filteredActive = filterClients(active);
  const filteredDeleted = filterClients(deleted);

  const softDelete = async (id: string) => {
    await supabase.from('clients').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    refresh();
    showSuccess('Mandant gelöscht – Rückgängig möglich', {
      action: 'Rückgängig',
      onAction: async () => {
        await supabase.from('clients').update({ deleted_at: null }).eq('id', id);
        refresh();
      },
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{showTrash ? 'Papierkorb' : 'Mandanten'}</h1>
            <button
              onClick={() => setShowTrash(!showTrash)}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Trash2 size={14} className="mr-1" />
              Papierkorb ({deleted.length})
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {showTrash
              ? 'Gelöschte Mandanten verwalten und wiederherstellen'
              : 'Verwalten und analysieren Sie Ihr Mandantenportfolio'}
          </p>
        </div>

        {!showTrash && (
          <div className="flex space-x-3">
            <Link to="/clients/add">
              <Button variant="primary" icon={<UserPlus size={16} />}>
                Mandanten hinzufügen
              </Button>
            </Link>
            <Button variant="secondary" icon={<Upload size={16} />} onClick={() => setShowImportForm(true)}>
              CSV Importieren
            </Button>
          </div>
        )}
      </div>

      {/* Suche */}
      <div className="mb-6 flex gap-2 items-center">
        <input
          type="text"
          placeholder={showTrash ? "Gelöschte Mandanten suchen..." : "Mandanten suchen..."}
          className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
        {!showTrash && (
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Loading oder Inhalt */}
      {isLoading ? (
        <div className="text-center text-gray-500 mt-16">⏳ Lade Mandanten...</div>
      ) : showTrash ? (
        filteredDeleted.length > 0 ? (
          <div className="space-y-4">
            {filteredDeleted.map(c => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-gray-500">{c.city}</p>
                  </div>
                  <Button variant="secondary" onClick={() => softDelete(c.id)}>
                    Wiederherstellen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyTrash />
      ) : (
        filteredActive.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredActive.map(client => (
                <ClientCard key={client.id} client={client} onDelete={() => softDelete(client.id)} />
              ))}
            </div>
          ) : (
            <ClientTable clients={filteredActive} onDelete={softDelete} />
          )
        ) : (
          <EmptyState onAdd={() => setShowImportForm(true)} />
        )
      )}

      {/* Modal */}
      {showImportForm && (
        <EnhancedClientImportForm
          onImportComplete={() => {
            setShowImportForm(false);
            refresh();
          }}
          onClose={() => setShowImportForm(false)}
        />
      )}
    </>
  );
};

export default ClientsPage;