import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Settings, Trash2 } from 'lucide-react';
import { Client } from '../../types';

interface Props {
  clients: Client[];
  onDelete: (id: string) => void;
}

const ClientTable: React.FC<Props> = ({ clients, onDelete }) => {
  const navigate = useNavigate();

  const goToDetails = (id: string) => {
    navigate(`/clients/${id}`);
  };

  const goToSettings = (id: string) => {
    navigate(`/clients/${id}/einstellungen`);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Mandant
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client, index) => (
              <tr
                key={client.id}
                className={`hover:bg-blue-50 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td 
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => goToDetails(client.id)}
                >
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.city && client.plz ? `${client.plz} ${client.city}` : client.city || 'Keine Adresse'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToDetails(client.id);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                      title="Details anzeigen"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSettings(client.id);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150"
                      title="Einstellungen"
                    >
                      <Settings size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(client.id);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                      title="Löschen"
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
      
      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Keine Mandanten gefunden</p>
        </div>
      )}
    </div>
  );
};

export default ClientTable;