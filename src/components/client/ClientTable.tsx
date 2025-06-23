import React from 'react';
import { Trash2 } from 'lucide-react';
import { Client } from '../../types';
import Button from '../ui/Button';

interface Props {
  clients: Client[];
  onDelete: (id: string) => void;
}

const ClientTable: React.FC<Props> = ({ clients, onDelete }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mandant</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rechtsform</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ort</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Erstellt</th>
          <th className="px-6 py-3 relative"><span className="sr-only">Aktion</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {clients.map(c => (
          <tr key={c.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{c.legalForm ?? '—'}</td>
            <td className="px-6 py-4 whitespace-nowrap">{c.city ?? '—'}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {c.created_at ? new Date(c.created_at).toLocaleDateString('de-DE') : '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <Button variant="danger" size="sm" icon={<Trash2 size={16} />} onClick={() => onDelete(c.id)}>
                Löschen
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ClientTable;
