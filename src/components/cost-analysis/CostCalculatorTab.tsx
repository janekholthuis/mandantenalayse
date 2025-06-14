import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Upload, Zap, TrendingDown, FileText } from 'lucide-react';
import Button from '../ui/Button';
import DocumentUploadPopup from './DocumentUploadPopup';

interface Optimization {
  id: string;
  title: string;
  description: string;
  status: 'document-missing' | 'send-offers' | 'waiting-for-client' | 'completed';
  potentialSavings: number;
  requirements: string[];
  missingDocuments?: string[];
  currentProvider?: string;
  recommendedProvider?: string;
}

interface CostCalculatorTabProps {
  onOptimizationStatusChange?: (optimizationId: string, newStatus: string) => void;
}

const CostCalculatorTab: React.FC<CostCalculatorTabProps> = ({ onOptimizationStatusChange }) => {
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedOptimization, setSelectedOptimization] = useState<Optimization | null>(null);
  const [optimizations, setOptimizations] = useState<Optimization[]>([
    {
      id: 'stromvertrag',
      title: 'Stromvertrag optimieren',
      description: 'Wechsel zu günstigerem Stromanbieter mit besseren Konditionen und Ökostrom-Garantie',
      status: 'document-missing',
      potentialSavings: 210,
      requirements: ['Aktueller Stromvertrag', 'Jahresverbrauch', 'Letzte Stromrechnung'],
      missingDocuments: ['Stromvertrag'],
      currentProvider: 'Lichtblick GmbH',
      recommendedProvider: 'Vattenfall'
    },
    {
      id: 'versicherung',
      title: 'Betriebshaftpflicht optimieren',
      description: 'Überprüfung der Betriebshaftpflichtversicherung auf bessere Konditionen und Deckung',
      status: 'send-offers',
      potentialSavings: 150,
      requirements: ['Versicherungspolice', 'Risikoanalyse', 'Vergleichsangebote'],
      currentProvider: 'Allianz Versicherung'
    },
    {
      id: 'kommunikation',
      title: 'Telekommunikation optimieren',
      description: 'Bündel-Angebote für Internet, Telefon und Mobilfunk mit besseren Tarifen',
      status: 'document-missing',
      potentialSavings: 180,
      requirements: ['Aktuelle Verträge', 'Nutzungsanalyse'],
      missingDocuments: ['Mobilfunk-Vertrag'],
      currentProvider: 'Telekom Deutschland & Vodafone'
    },
    
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'send-offers':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'waiting-for-client':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'document-missing':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'send-offers':
        return 'Angebote schicken';
      case 'waiting-for-client':
        return 'Warten auf Mandant';
      case 'document-missing':
        return 'Dokument fehlend';
      default:
        return 'Unbekannt';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'send-offers':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waiting-for-client':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'document-missing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDocumentUpload = (optimization: Optimization) => {
    setSelectedOptimization(optimization);
    setShowUploadPopup(true);
  };

  const handleUploadComplete = (filename: string, type: string) => {
    setShowUploadPopup(false);
    setSelectedOptimization(null);
    
    // Update the optimization status based on the action
    if (selectedOptimization) {
      setOptimizations(prev => 
        prev.map(opt => 
          opt.id === selectedOptimization.id 
            ? { ...opt, status: type === 'vertrag' ? 'completed' as const : type as const }
            : opt
        )
      );
      
      // Notify parent component about status change
      if (onOptimizationStatusChange) {
        const newStatus = type === 'vertrag' ? 'completed' : type;
        onOptimizationStatusChange(selectedOptimization.id, newStatus);
      }
    }
  };

  const handleShowOffers = (optimizationId: string) => {
    // Update optimization status to send-offers when "Angebote anzeigen" is clicked
    setOptimizations(prev => 
      prev.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, status: 'send-offers' as const }
          : opt
      )
    );
    
    // Notify parent component about status change
    if (onOptimizationStatusChange) {
      onOptimizationStatusChange(optimizationId, 'send-offers');
    }
  };

  const handleCompleteOptimization = (optimizationId: string) => {
    setOptimizations(prev => 
      prev.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, status: 'completed' as const }
          : opt
      )
    );
  };

  const groupedOptimizations = {
    'document-missing': optimizations.filter(opt => opt.status === 'document-missing'),
    'send-offers': optimizations.filter(opt => opt.status === 'send-offers'),
    'waiting-for-client': optimizations.filter(opt => opt.status === 'waiting-for-client'),
    'completed': optimizations.filter(opt => opt.status === 'completed')
  };

  const getTotalPotentialSavings = () => {
    return optimizations
      .filter(opt => opt.status !== 'completed')
      .reduce((sum, opt) => sum + opt.potentialSavings, 0);
  };

  const getCompletedSavings = () => {
    return optimizations
      .filter(opt => opt.status === 'completed')
      .reduce((sum, opt) => sum + opt.potentialSavings, 0);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Analysierte Verträge</p>
              <p className="text-2xl font-bold text-gray-900">
                {optimizations.filter(opt => opt.status !== 'document-missing').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Bearbeitung</p>
              <p className="text-2xl font-bold text-gray-900">
                {optimizations.filter(opt => opt.status === 'send-offers' || opt.status === 'waiting-for-client').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Umgesetzt</p>
              <p className="text-2xl font-bold text-gray-900">
                {optimizations.filter(opt => opt.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Einsparungen p.a.</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(getCompletedSavings())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optimizations List */}
      <div className="space-y-6">
        {/* Document Missing */}
        {groupedOptimizations['document-missing'].length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Dokument fehlend ({groupedOptimizations['document-missing'].length})
            </h3>
            <div className="space-y-4">
              {groupedOptimizations['document-missing'].map((optimization) => (
                <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between">
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
                      <p className="text-gray-600 mb-3">{optimization.description}</p>
                      
                      {optimization.currentProvider && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Aktueller Anbieter:</span> {optimization.currentProvider}
                          </p>
                         
                        </div>
                      )}

                     

                      {optimization.missingDocuments && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-red-700 mb-1">Fehlende Dokumente:</p>
                          <ul className="text-sm text-red-600 list-disc list-inside">
                            {optimization.missingDocuments.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Button
                        variant="primary"
                        onClick={() => handleDocumentUpload(optimization)}
                        icon={<Upload size={16} />}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Dokument hochladen
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Send Offers */}
        {groupedOptimizations['send-offers'].length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              Angebote schicken ({groupedOptimizations['send-offers'].length})
            </h3>
            <div className="space-y-4">
              {groupedOptimizations['send-offers'].map((optimization) => (
                <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between">
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
                      <p className="text-gray-600 mb-3">{optimization.description}</p>
                      
                      {optimization.currentProvider && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Aktueller Anbieter:</span> {optimization.currentProvider}
                          </p>
                          {optimization.recommendedProvider && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Empfohlener Anbieter:</span> {optimization.recommendedProvider}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}/Jahr</span>
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setOptimizations(prev => 
                            prev.map(opt => 
                              opt.id === optimization.id 
                                ? { ...opt, status: 'waiting-for-client' as const }
                                : opt
                            )
                          );
                          // Notify parent component about status change
                          if (onOptimizationStatusChange) {
                            onOptimizationStatusChange(optimization.id, 'waiting-for-client');
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Angebotszusammenfassung senden
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waiting for Client */}
        {groupedOptimizations['waiting-for-client'].length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              Warten auf Mandant ({groupedOptimizations['waiting-for-client'].length})
            </h3>
            <div className="space-y-4">
              {groupedOptimizations['waiting-for-client'].map((optimization) => (
                <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between">
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
                      <p className="text-gray-600 mb-3">{optimization.description}</p>
                      
                      {optimization.currentProvider && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Aktueller Anbieter:</span> {optimization.currentProvider}
                          </p>
                          {optimization.recommendedProvider && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Empfohlener Anbieter:</span> {optimization.recommendedProvider}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}/Jahr</span>
                        </span>
                      </div>
                    </div>
                    {/* No button shown when waiting for client response */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {groupedOptimizations['completed'].length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Abgeschlossen ({groupedOptimizations['completed'].length})
            </h3>
            <div className="space-y-4">
              {groupedOptimizations['completed'].map((optimization) => (
                <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm opacity-75">
                  <div className="flex items-start justify-between">
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
                      <p className="text-gray-600 mb-3">{optimization.description}</p>
                      
                      {optimization.currentProvider && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Implementiert:</span> {optimization.currentProvider}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          Erreichte Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}/Jahr</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {optimizations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Optimierungen gefunden</h3>
            <p className="text-gray-500">
              Führen Sie eine Analyse durch, um Optimierungsmöglichkeiten zu identifizieren.
            </p>
          </div>
        )}
      </div>

      {/* Document Upload Popup */}
      {showUploadPopup && selectedOptimization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" id="upload-popup-container">
          <div className="bg-white rounded-lg transition-all duration-300" id="upload-popup-content">
            <DocumentUploadPopup 
              onUploadComplete={handleUploadComplete}
              onClose={() => {
                setShowUploadPopup(false);
                setSelectedOptimization(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCalculatorTab;