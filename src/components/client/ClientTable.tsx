import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Info } from 'lucide-react';
import { Client } from '../../types';
import Button from '../ui/Button';

interface Props {
  clients: Client[];
  onDelete: (id: string) => void;
}

const ClientTable: React.FC<Props> = ({ clients, onDelete }) => {
  const navigate = useNavigate();

  const goToDetails = (id: string) => {
    navigate(`/clients/${id}`);
  };

  const goToEdit = (id: string) => {
    navigate(`/clients/${id}/edit`);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mandant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rechtsform</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ort</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Erstellt</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map(c => (
            <tr
              key={c.id}
              onClick={() => goToDetails(c.id)}
              className="hover:bg-blue-50 cursor-pointer transition"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.legalForm ?? '—'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.city ?? '—'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {c.created_at ? new Date(c.created_at).toLocaleDateString('de-DE') : '—'}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-right space-x-2"
                onClick={e => e.stopPropagation()} // Prevent row click
              >
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => goToEdit(c.id)}
                  title="Bearbeiten"
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => goToDetails(c.id)}
                  title="Details"
                >
                  <Info size={16} />
                </Button>

                <Button
                  size="icon-sm"
                  variant="danger"
                  onClick={() => onDelete(c.id)}
                  title="Löschen"
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
