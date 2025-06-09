import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Upload, FileText } from 'lucide-react';
import Button from '../ui/Button';
import DocumentUploadPopup from '../cost-analysis/DocumentUploadPopup';

interface Optimization {
  id: string;
  title: string;
  description: string;
  status: 'document-missing' | 'send-offers' | 'waiting-for-client' | 'completed';
  potentialSavings: number;
  requirements: string[];
  missingDocuments?: string[];
}

interface OptimizationsListProps {
  optimizations: Optimization[];
  onStatusChange: (id: string, newStatus: string) => void;
}

const OptimizationsList: React.FC<OptimizationsListProps> = ({ 
  optimizations, 
  onStatusChange 
}) => {
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedOptimization, setSelectedOptimization] = useState<Optimization | null>(null);

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

  const handleDocumentUpload = (optimization: Optimization) => {
    setSelectedOptimization(optimization);
    setShowUploadPopup(true);
  };

  const handleUploadComplete = (filename: string, type: string) => {
    setShowUploadPopup(false);
    setSelectedOptimization(null);
    
    // Update the optimization status based on the action
    if (selectedOptimization) {
      if (type === 'vertrag') {
        onStatusChange(selectedOptimization.id, 'completed');
      } else {
        onStatusChange(selectedOptimization.id, type);
      }
    }
  };

  const handleCompleteOptimization = (optimizationId: string) => {
    // Update optimization status to 'completed' when "Optimierung anwenden" is clicked
    onStatusChange(optimizationId, 'completed');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const groupedOptimizations = {
    'document-missing': optimizations.filter(opt => opt.status === 'document-missing'),
    'send-offers': optimizations.filter(opt => opt.status === 'send-offers'),
    'waiting-for-client': optimizations.filter(opt => opt.status === 'waiting-for-client'),
    'completed': optimizations.filter(opt => opt.status === 'completed')
  };

  return (
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
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
                      </div>
                    </div>
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
                    <div className="text-sm text-gray-500">
                      Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button
                      variant="primary"
                      onClick={() => onStatusChange(optimization.id, 'waiting-for-client')}
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
                    <div className="text-sm text-gray-500">
                      Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
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
                    <div className="text-sm text-gray-500">
                      Erreichte Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
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

export default OptimizationsList;