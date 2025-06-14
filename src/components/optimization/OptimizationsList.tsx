import React from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, Zap, TrendingDown } from 'lucide-react';
import Button from '../ui/Button';

interface Optimization {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  requirements: string[];
  category: string;
  status: 'potential' | 'in-progress' | 'completed';
}

interface OptimizationsListProps {
  optimizations: Optimization[];
}

const OptimizationsList: React.FC<OptimizationsListProps> = ({ optimizations }) => {
  // Mock optimizations data
  const mockOptimizations: Optimization[] = [
    {
      id: '1',
      title: 'Sachbezug optimieren',
      description: 'Einführung von steuerfreien Sachbezügen bis 50€ pro Monat pro Mitarbeiter',
      potentialSavings: 600,
      requirements: ['Dokumentation der Sachbezüge', 'Einhaltung der monatlichen Grenze'],
      category: 'Steueroptimierung',
      status: 'potential'
    },
    {
      id: '2',
      title: 'Betriebliche Altersvorsorge',
      description: 'Einführung oder Optimierung der betrieblichen Altersvorsorge',
      potentialSavings: 800,
      requirements: ['Auswahl eines geeigneten bAV-Systems', 'Information der Mitarbeiter'],
      category: 'Mitarbeiterbenefits',
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Jobticket',
      description: 'Steuerfreies oder pauschalbesteuertes Ticket für den ÖPNV',
      potentialSavings: 400,
      requirements: ['Vereinbarung mit ÖPNV-Anbieter', 'Steuerliche Behandlung klären'],
      category: 'Mobilität',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Gesundheitsförderung',
      description: 'Bis zu 600€ jährlich für zertifizierte Gesundheitsmaßnahmen steuerfrei',
      potentialSavings: 600,
      requirements: ['Zertifizierte Anbieter finden', 'Dokumentation der Maßnahmen'],
      category: 'Gesundheit',
      status: 'potential'
    },
    {
      id: '5',
      title: 'Internetpauschale',
      description: 'Steuerfreier Zuschuss bis 50€ monatlich für private Internetnutzung',
      potentialSavings: 600,
      requirements: ['Vereinbarung mit Mitarbeitern', 'Dokumentation der Nutzung'],
      category: 'Digitalisierung',
      status: 'potential'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'potential':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Umgesetzt';
      case 'in-progress':
        return 'In Bearbeitung';
      case 'potential':
        return 'Potenzial';
      default:
        return 'Unbekannt';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'potential':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Steueroptimierung': 'bg-purple-100 text-purple-800',
      'Mitarbeiterbenefits': 'bg-blue-100 text-blue-800',
      'Mobilität': 'bg-green-100 text-green-800',
      'Gesundheit': 'bg-red-100 text-red-800',
      'Digitalisierung': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayOptimizations = mockOptimizations;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Zap className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Verfügbare Optimierungen</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayOptimizations.map((optimization) => (
            <div key={optimization.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-900 mr-3">
                      {optimization.title}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(optimization.status)}`}>
                      {getStatusIcon(optimization.status)}
                      <span className="ml-1">{getStatusText(optimization.status)}</span>
                    </span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(optimization.category)}`}>
                    {optimization.category}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">{optimization.description}</p>
              
              <div className="mb-4">
                <div className="flex items-center text-green-600 mb-2">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="font-medium">{formatCurrency(optimization.potentialSavings)}/Jahr</span>
                </div>
                <p className="text-xs text-gray-500">Potenzielle Einsparung pro Mitarbeiter</p>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Anforderungen:</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {optimization.requirements.slice(0, 2).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                  {optimization.requirements.length > 2 && (
                    <li className="text-gray-500">+{optimization.requirements.length - 2} weitere</li>
                  )}
                </ul>
              </div>
              
              <Button
                variant={optimization.status === 'completed' ? 'secondary' : 'primary'}
                className={`w-full ${
                  optimization.status === 'completed' 
                    ? 'bg-gray-100 text-gray-700' 
                    : optimization.status === 'in-progress'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={optimization.status === 'completed'}
              >
                {optimization.status === 'completed' 
                  ? 'Umgesetzt' 
                  : optimization.status === 'in-progress'
                  ? 'In Bearbeitung'
                  : 'Implementieren'
                }
              </Button>
            </div>
          ))}
        </div>
        
        {displayOptimizations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Optimierungen verfügbar</h3>
            <p className="text-gray-500">
              Führen Sie eine Analyse durch, um Optimierungsmöglichkeiten zu identifizieren.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationsList;