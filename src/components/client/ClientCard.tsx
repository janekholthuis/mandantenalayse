import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Settings, TrendingUp } from 'lucide-react';
import { Client } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  // Mock optimization KPIs - in a real app, these would come from the database
  const mockOptimizationKPIs = {
    implementedSavings: Math.floor(Math.random() * 5000) + 1000, // €1000-6000
    potentialSavings: Math.floor(Math.random() * 8000) + 2000,   // €2000-10000
    optimizationsCount: Math.floor(Math.random() * 8) + 2,       // 2-10 optimizations
    implementedCount: Math.floor(Math.random() * 4) + 1          // 1-5 implemented
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md border border-gray-100 group">
      <div className="p-6">
        {/* Header with Client Name and Settings */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {client.name}
            </h3>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {client.status === 'active' ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
          </div>
          
          {/* Settings Icon */}
          <Link
            to={`/clients/${client.id}?tab=settings`}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all opacity-0 group-hover:opacity-100"
            title="Mandanten-Einstellungen"
            onClick={(e) => e.stopPropagation()}
          >
            <Settings size={16} />
          </Link>
        </div>

        {/* Optimization KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Implemented Savings */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center justify-between mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Umgesetzt</span>
            </div>
            <div className="text-lg font-bold text-green-800">
              {formatCurrency(mockOptimizationKPIs.implementedSavings)}
            </div>
            <div className="text-xs text-green-600">
              {mockOptimizationKPIs.implementedCount} Optimierungen
            </div>
          </div>

          {/* Potential Savings */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Potenzial</span>
            </div>
            <div className="text-lg font-bold text-blue-800">
              {formatCurrency(mockOptimizationKPIs.potentialSavings)}
            </div>
            <div className="text-xs text-blue-600">
              {mockOptimizationKPIs.optimizationsCount - mockOptimizationKPIs.implementedCount} verfügbar
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
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
            
            <Link
              to={`/clients/${client.id}`}
              className="text-sm text-blue-600 hover:text-blue-500 flex items-center font-medium transition-colors"
            >
              Details
              <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;