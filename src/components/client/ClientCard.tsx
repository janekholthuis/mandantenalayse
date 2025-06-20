import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Settings,
  Building2,
  Scale,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
  onDelete?: (clientId: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Möchten Sie den Mandanten "${client.name}" wirklich löschen? Er wird in den Papierkorb verschoben.`)) {
      onDelete?.(client.id);
    }
  };

  const getStatusBadge = () => {
    const isActive = client.status === 'active';
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {isActive ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Aktiv
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3 mr-1" />
            Inaktiv
          </>
        )}
      </span>
    );
  };

  return (
    <Link to={`/clients/${client.id}`} className="block hover:no-underline">
      <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md border border-gray-100 group p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {client.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge()}
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={`/clients/${client.id}/einstellungen`}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              title="Mandanten-Einstellungen"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Mandant löschen"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Infos */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-700">
            <Scale className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">Rechtsform:</span>
            <span className="ml-1">{client.legalForm || 'nicht angegeben'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {client.lastAnalyzed ? (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle size={14} className="mr-1" />
                <span className="text-xs">
                  Analysiert: {new Date(client.lastAnalyzed).toLocaleDateString('de-DE')}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-amber-600">
                <Clock size={14} className="mr-1" />
                <span className="text-xs">Nicht analysiert</span>
              </div>
            )}

            <div className="text-sm text-blue-600 hover:text-blue-500 flex items-center font-medium transition-colors">
              Details
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClientCard;
