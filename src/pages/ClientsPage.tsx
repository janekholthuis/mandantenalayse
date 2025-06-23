import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import { UserPlus, Trash2, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientCard from '../components/client/ClientCard';
import EnhancedClientImportForm from '../components/client/EnhancedClientImportForm';
import Button from '../components/ui/Button';
import { useClients } from '../hooks/useClients';
import { showSuccess } from '../lib/toast';
import { supabase } from '../lib/supabase';

const ClientsPage: React.FC = () => {
  const { active, deleted, isLoading, refresh } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showImportForm, setShowImportForm] = useState(false);

  // Debounced search
  const [searchText, setSearchText] = useState('');
  const debouncedSetSearch = useCallback(debounce(setSearchText, 300), []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const filter = (arr: typeof active | typeof deleted) => {
    if (!searchText) return arr;
    const t = searchText.toLowerCase();
    return arr.filter(c =>
      c.name.toLowerCase().includes(t) ||
      (c.legalForm?.toLowerCase().includes(t) ?? false)
    );
  };

  const filteredActive = filter(active);
  const filteredDeleted = filter(deleted);

  // Delete with undo toast
  const softDelete = async (id: string) => {
    await supabase.from('clients').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    refresh();
    const undo = async () => {
      await supabase.from('clients').update({ deleted_at: null }).eq('id', id);
      refresh();
    };
    showSuccess('Mandant gelöscht', { action: 'Undo', onAction: undo });
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{showTrash ? 'Papierkorb' : 'Mandanten'}</h1>
            <button onClick={() => setShowTrash(!showTrash)} className="...">Papierkorb ({deleted.length})</button>
          </div>
          <p className="mt-1 text-sm text-gray-500">{showTrash ? '...Trash UI...' : '...Manage your clients...'}</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {!showTrash && <>
            <Link to="/clients/add">
              <Button variant="primary" icon={<UserPlus size={16 />} className="bg-blue-600 hover:bg-blue-700">
                Mandanten hinzufügen
              </Button>
            </Link>
            <Button variant="secondary" onClick={() => setShowImportForm(true)}>
              CSV importieren
            </Button>
          </>}
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className="mb-6 flex gap-2 items-center">
        <input type="text" placeholder={showTrash ? "Gelöschte Mandanten suchen..." : "Mandanten suchen..."}
          className="flex-1 rounded-md border ..." value={searchTerm} onChange={handleSearch} />
        {!showTrash && (
          <div className="flex border rounded-md">
            <button className={`px-2 py-1 ${viewMode === 'grid' ? 'bg-blue-100' : ''}`} onClick={() => setViewMode('grid')}>
  <Grid size={16} />
</button>

            <button ... onClick={() => setViewMode('list')}><List size={16} /></button>
          </div>
        )}
      </div>

      {/* Loading / Content */}
      {isLoading ? (
        <div className="flex justify-center"><div className="spinner" /></div>
      ) : showTrash ? (
        filteredDeleted.length > 0 ? filteredDeleted.map(c => (
          <div key={c.id} className="...">
            <h3>{c.name}</h3>
            <Button onClick={() => softDelete(c.id)}>Undo Löschung</Button>
          </div>
        )) : <EmptyTrash />
      ) : (
        filteredActive.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid ...">{filteredActive.map(c =>
              <ClientCard key={c.id} client={c} onDelete={() => softDelete(c.id)} />
            )}</div>
          ) : (
            <ClientTable clients={filteredActive} onDelete={softDelete} />
          )
        ) : <EmptyState onAdd={() => setShowImportForm(true)} />
      )}

      {showImportForm && (
        <EnhancedClientImportForm onImportComplete={() => {setShowImportForm(false); refresh();}} onClose={() => setShowImportForm(false)} />
      )}
    </>
  );
};

export default ClientsPage;
