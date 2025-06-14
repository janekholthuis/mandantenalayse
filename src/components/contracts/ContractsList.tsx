import React, { useState } from 'react';
import { FileText, Calendar, Euro, Building2, CheckCircle, Clock, AlertTriangle, Eye, Download } from 'lucide-react';
import Button from '../ui/Button';

interface Contract {
  id: string;
  name: string;
  provider: string;
  type: string;
  monthlyAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  analysisStatus: 'analyzed' | 'pending' | 'not-analyzed';
  optimizationPotential?: number;
}

interface ContractsListProps {
  contracts?: Contract[];
}

const ContractsList: React.FC<ContractsListProps> = ({ contracts = [] }) => {
  // Mock contracts data
  const mockContracts: Contract[] = [
    {
      id: '1',
      name: 'Stromvertrag Büro',
      provider: 'Lichtblick GmbH',
      type: 'Energie',
      monthlyAmount: 89.50,
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'active',
      analysisStatus: 'analyzed',
      optimizationPotential: 210
    },
    {
      id: '2',
      name: 'Internet & Telefon',
      provider: 'Telekom Deutschland',
      type: 'Kommunikation',
      monthlyAmount: 45.20,
      startDate: '2024-03-01',
      endDate: '2026-02-28',
      status: 'active',
      analysisStatus: 'analyzed',
      optimizationPotential: 150
    },
    {
      id: '3',
      name: 'Betriebshaftpflicht',
      provider: 'Allianz Versicherung',
      type: 'Versicherung',
      monthlyAmount: 156.80,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'expiring',
      analysisStatus: 'pending'
    },
    {
      id: '4',
      name: 'Office 365 Business',
      provider: 'Microsoft Deutschland',
      type: 'Software',
      monthlyAmount: 125.00,
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      status: 'active',
      analysisStatus: 'not-analyzed'
    }
  ];

  const displayContracts = contracts.length > 0 ? contracts : mockContracts;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'expiring':
        return 'Läuft aus';
      case 'expired':
        return 'Abgelaufen';
      default:
        return 'Unbekannt';
    }
  };

  const getAnalysisStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'not-analyzed':
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAnalysisStatusText = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'Analysiert';
      case 'pending':
        return 'In Bearbeitung';
      case 'not-analyzed':
        return 'Nicht analysiert';
      default:
        return 'Unbekannt';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Energie': 'bg-yellow-100 text-yellow-800',
      'Kommunikation': 'bg-blue-100 text-blue-800',
      'Versicherung': 'bg-purple-100 text-purple-800',
      'Software': 'bg-indigo-100 text-indigo-800',
      'Transport': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Verträge</h3>
        </div>
        <div className="text-sm text-gray-500">
          {displayContracts.length} Verträge
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayContracts.map((contract) => (
          <div key={contract.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {contract.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{contract.provider}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(contract.type)}`}>
                  {contract.type}
                </span>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                  {getStatusText(contract.status)}
                </span>
              </div>
            </div>

            {/* Contract Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Euro className="h-4 w-4 mr-1" />
                  <span>Monatlich:</span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(contract.monthlyAmount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Laufzeit:</span>
                </div>
                <span className="text-sm text-gray-900">
                  {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                </span>
              </div>
            </div>

            {/* Analysis Status */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-600">
                  {getAnalysisStatusIcon(contract.analysisStatus)}
                  <span className="ml-2">{getAnalysisStatusText(contract.analysisStatus)}</span>
                </div>
              </div>
              
              {contract.optimizationPotential && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Einsparpotential:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(contract.optimizationPotential)}/Jahr
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                icon={<Eye size={16} />}
                className="flex-1 text-sm"
              >
                Details
              </Button>
              <Button
                variant="secondary"
                icon={<Download size={16} />}
                className="flex-1 text-sm"
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {displayContracts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Verträge vorhanden</h3>
          <p className="text-gray-500 mb-6">
            Laden Sie Verträge hoch, um sie zu analysieren und zu verwalten.
          </p>
          <Button
            variant="primary"
            icon={<FileText size={16} />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Vertrag hochladen
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContractsList;