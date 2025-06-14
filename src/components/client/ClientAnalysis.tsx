import React, { useState } from 'react';
import { Wand2, FileText, X } from 'lucide-react';
import Button from '../ui/Button';
import { OptimizationItem } from '../../types';

interface UploadedFile {
  name: string;
  type: string;
  category: string;
  status: 'analyzing' | 'analyzed';
}

interface ClientAnalysisProps {
  client: any;
  onComplete: (optimizations: OptimizationItem[]) => void;
  onClose: () => void;
}

const ClientAnalysis: React.FC<ClientAnalysisProps> = ({ client, onComplete, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type.split('/')[1].toUpperCase(),
        category: '',
        status: 'analyzing'
      }));
      setUploadedFiles(newFiles);

      setTimeout(() => {
        setUploadedFiles(files => 
          files.map(file => ({
            ...file,
            category: 'Lohnabrechnung ✅',
            status: 'analyzed'
          }))
        );
      }, 2000);
    }
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic optimizations based on employee count
    const employeeCount = client.employeeCount || 0;
    const mockOptimizations: OptimizationItem[] = [
      {
        id: crypto.randomUUID(),
        title: 'Sachbezüge optimieren',
        description: 'Einführung von steuerfreien Sachbezügen bis 50€ pro Monat pro Mitarbeiter',
        potentialSavings: employeeCount * 600, // 600€ per employee per year
        status: 'potential',
        category: 'tax',
        requirements: [
          'Dokumentation der Sachbezüge',
          'Einhaltung der monatlichen Grenze von 50€',
          'Keine Bargeldauszahlung'
        ],
        employeeCount: Math.floor(employeeCount * 0.8),
        employeesAnalyzed: employeeCount,
        employeesBenefiting: Math.floor(employeeCount * 0.2),
        netBenefitEmployee: 600,
        employerCost: 720,
        mandant_id: client.id,
        user_id: ''
      },
      {
        id: crypto.randomUUID(),
        title: 'Betriebliche Altersvorsorge (bAV)',
        description: 'Einführung oder Optimierung der betrieblichen Altersvorsorge',
        potentialSavings: employeeCount * 800,
        status: 'potential',
        category: 'structure',
        requirements: [
          'Auswahl eines geeigneten bAV-Systems',
          'Dokumentation der Vereinbarungen',
          'Information der Mitarbeiter'
        ],
        employeeCount: Math.floor(employeeCount * 0.6),
        employeesAnalyzed: employeeCount,
        employeesBenefiting: 0,
        netBenefitEmployee: 800,
        employerCost: 960,
        mandant_id: client.id,
        user_id: ''
      }
    ];

    // Add more optimizations for larger companies
    if (employeeCount > 10) {
      mockOptimizations.push({
        id: crypto.randomUUID(),
        title: 'Jobticket',
        description: 'Steuerfreies oder pauschalbesteuertes Ticket für den ÖPNV',
        potentialSavings: employeeCount * 400,
        status: 'potential',
        category: 'cost',
        requirements: [
          'Vereinbarung mit ÖPNV-Anbieter',
          'Dokumentation der Nutzung',
          'Steuerliche Behandlung klären'
        ],
        employeeCount: Math.floor(employeeCount * 0.5),
        employeesAnalyzed: employeeCount,
        employeesBenefiting: 0,
        netBenefitEmployee: 400,
        employerCost: 480,
        mandant_id: client.id,
        user_id: ''
      });
    }

    onComplete(mockOptimizations);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        {!isAnalyzing ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dokumente für Analyse hochladen
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Laden Sie relevante Dokumente hoch, um eine detaillierte Steueranalyse durchzuführen.
            </p>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Dokumente auswählen
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Hochgeladene Dokumente</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="min-w-[140px]">
                          {file.status === 'analyzing' ? (
                            <div className="flex items-center">
                              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                              <span className="text-sm text-gray-600">Analysiere...</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-900">{file.category}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Abbrechen
              </Button>
              <Button
                variant="primary"
                onClick={handleAnalysis}
                disabled={uploadedFiles.length === 0}
              >
                Analyse starten
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Wand2 className="h-12 w-12 text-blue-600 animate-bounce" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analysiere Dokumente
            </h3>
            <p className="text-sm text-gray-500">
              Bitte warten Sie, während wir Ihre Dokumente analysieren...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAnalysis;