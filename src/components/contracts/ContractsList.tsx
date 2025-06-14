import React, { useState } from 'react';
import { FileText, Calendar, Euro, Building2, CheckCircle, Clock, AlertTriangle, Eye, Download, Upload, TrendingDown, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { Contract } from '../../types';

interface ContractsListProps {
  contracts?: Contract[];
}

const ContractsList: React.FC<ContractsListProps> = ({ contracts = [] }) => {
  // Mock contracts data based on Supabase schema
  const mockContracts: Contract[] = [
    {
      id: '1',
      kategorie: 'Energie',
      anbieter_name: 'Lichtblick GmbH',
      kosten_monat: 89.50,
      laufzeit_monate: 24,
      vertragsbeginn: '2024-01-01',
      vertragsende: '2025-12-31',
      kuendigungsfrist_tage: 30,
      erkannt_durch: 'AI',
      status: 'aktiv',
      wechsel_empfohlen: true,
      kommentar: 'Stromvertrag mit Optimierungspotential',
      mandant_id: '',
      optimizationPotential: 210,
      requirements: ['Aktueller Stromvertrag', 'Jahresverbrauch', 'Letzte Stromrechnung']
    },
    {
      id: '2',
      kategorie: 'Kommunikation',
      anbieter_name: 'Telekom Deutschland',
      kosten_monat: 45.20,
      laufzeit_monate: 24,
      vertragsbeginn: '2024-03-01',
      vertragsende: '2026-02-28',
      kuendigungsfrist_tage: 90,
      erkannt_durch: 'AI',
      status: 'aktiv',
      wechsel_empfohlen: true,
      kommentar: 'Internet & Telefon mit besseren Alternativen',
      mandant_id: '',
      optimizationPotential: 150,
      requirements: ['Aktueller Vertrag', 'Nutzungsanalyse']
    },
    {
      id: '3',
      kategorie: 'Versicherung',
      anbieter_name: 'Allianz Versicherung',
      kosten_monat: 156.80,
      laufzeit_monate: 12,
      vertragsbeginn: '2024-01-01',
      vertragsende: '2024-12-31',
      kuendigungsfrist_tage: 90,
      erkannt_durch: 'AI',
      status: 'gekündigt',
      wechsel_empfohlen: false,
      kommentar: 'Betriebshaftpflicht läuft aus',
      mandant_id: ''
    },
    {
      id: '4',
      kategorie: 'Software',
      anbieter_name: 'Microsoft Deutschland',
      kosten_monat: 125.00,
      laufzeit_monate: 12,
      vertragsbeginn: '2024-06-01',
      vertragsende: '2025-05-31',
      kuendigungsfrist_tage: 30,
      erkannt_durch: 'Manuell',
      status: 'aktiv',
      wechsel_empfohlen: false,
      kommentar: 'Office 365 Business - aktuell optimal',
      mandant_id: ''
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
      case 'aktiv':
        return 'bg-green-100 text-green-800';
      case 'gekündigt':
        return 'bg-yellow-100 text-yellow-800';
      case 'unbekannt':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aktiv':
        return 'Aktiv';
      case 'gekündigt':
        return 'Gekündigt';
      case 'unbekannt':
        return 'Unbekannt';
      default:
        return status || 'Unbekannt';
    }
  };

  const getKategorieColor = (kategorie: string) => {
    const colors: Record<string, string> = {
      'Energie': 'bg-yellow-100 text-yellow-800',
      'Kommunikation': 'bg-blue-100 text-blue-800',
      'Versicherung': 'bg-purple-100 text-purple-800',
      'Software': 'bg-indigo-100 text-indigo-800',
      'Transport': 'bg-green-100 text-green-800'
    };
    return colors[kategorie] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Verträge</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {displayContracts.length} Verträge
          </div>
          <Button
            variant="primary"
            icon={<Upload size={16} />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Vertrag hochladen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayContracts.map((contract) => (
          <div key={contract.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {contract.kategorie}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{contract.anbieter_name}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getKategorieColor(contract.kategorie)}`}>
                  {contract.kategorie}
                </span>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                  {getStatusText(contract.status || '')}
                </span>
                {contract.wechsel_empfohlen && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    <Zap className="h-3 w-3 mr-1" />
                    Wechsel empfohlen
                  </span>
                )}
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
                  {formatCurrency(contract.kosten_monat || 0)}
                </span>
              </div>
              
              {contract.vertragsbeginn && contract.vertragsende && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Laufzeit:</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {formatDate(contract.vertragsbeginn)} - {formatDate(contract.vertragsende)}
                  </span>
                </div>
              )}
              
              {contract.kuendigungsfrist_tage && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Kündigungsfrist:</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {contract.kuendigungsfrist_tage} Tage
                  </span>
                </div>
              )}
            </div>

            {/* Optimization Potential */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              {contract.optimizationPotential && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm font-medium text-green-800">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      Einsparpotential:
                    </div>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(contract.optimizationPotential)}/Jahr
                    </span>
                  </div>
                  {contract.requirements && contract.requirements.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-800 mb-1">Anforderungen:</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        {contract.requirements.slice(0, 2).map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1 h-1 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                        {contract.requirements.length > 2 && (
                          <li className="text-green-600">+{contract.requirements.length - 2} weitere</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {contract.erkannt_durch && (
                <div className="mt-2 text-xs text-gray-500">
                  Erkannt durch: {contract.erkannt_durch}
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
              {contract.wechsel_empfohlen ? (
                <Button
                  variant="primary"
                  className="flex-1 text-sm bg-orange-600 hover:bg-orange-700"
                >
                  Optimieren
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  icon={<Download size={16} />}
                  className="flex-1 text-sm"
                >
                  Download
                </Button>
              )}
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