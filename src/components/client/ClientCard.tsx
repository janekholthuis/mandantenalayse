import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Building2, Users, MapPin } from 'lucide-react';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {client.name}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {client.status === 'active' ? 'Aktiv' : 'Inaktiv'}
          </span>
        </div>

        <div className="space-y-3">
          {client.industry && (
            <div className="flex items-center text-sm">
              <Building2 className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">{client.industry}</span>
            </div>
          )}

          {client.legalForm && (
            <div className="flex items-center text-sm">
              <Building2 className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">{client.legalForm}</span>
            </div>
          )}

          <div className="flex items-center text-sm">
            <Users className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-gray-900">{client.employeeCount || 0} Mitarbeiter</span>
          </div>

          {(client.city || client.postalCode) && (
            <div className="flex items-center text-sm">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">
                {client.postalCode && `${client.postalCode} `}{client.city}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {client.lastAnalyzed ? (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle size={16} className="mr-1" />
                <span>Analysiert: {new Date(client.lastAnalyzed).toLocaleDateString('de-DE')}</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-amber-600">
                <Clock size={16} className="mr-1" />
                <span>Nicht analysiert</span>
              </div>
            )}
            
            <Link
              to={`/clients/${client.id}`}
              className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
            >
              Details
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;