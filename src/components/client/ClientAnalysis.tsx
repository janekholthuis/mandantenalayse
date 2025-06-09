import React, { useState } from 'react';
import { Wand2, FileText, X } from 'lucide-react';
import Button from '../ui/Button';

interface UploadedFile {
  name: string;
  type: string;
  category: string;
  status: 'analyzing' | 'analyzed';
}

interface ClientAnalysisProps {
  client: any;
  onComplete: (optimizations: any[]) => void;
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
    
    if (client.id === '6') {
      const mockOptimizations = [
        {
          id: 'sachbezug',
          title: 'Sachbezug',
          description: 'Steuerfreier oder pauschalversteuerter geldwerter Vorteil bis zu 50 € pro Monat, z. B. als Gutschein.',
          potentialSavings: 1800,
          status: 'implemented' as const,
          category: 'structure' as const,
          details: 'Durch die Implementierung von Sachbezügen wie Gutscheinen oder Prepaidkarten können Sie Ihren Mitarbeitern steuerfreie Zusatzleistungen gewähren.',
          requirements: ['Dokumentation der Sachbezüge', 'Einhaltung der monatlichen Grenze von 50€', 'Keine Bargeldauszahlung'],
          employeeCount: 12,
          employeesAnalyzed: 12,
          employeesBenefiting: 3,
          netBenefitEmployee: 600,
          employerCost: 720
        },
        {
          id: 'fahrtkostenzuschuss',
          title: 'Fahrtkostenzuschuss',
          description: 'Zuschuss für Fahrten zwischen Wohnung und Arbeitsstätte',
          potentialSavings: 4440,
          status: 'potential' as const,
          category: 'cost' as const,
          details: 'Zuschuss für Fahrten zwischen Wohnung und Arbeitsstätte.',
          requirements: ['Nachweis der Fahrtkosten', 'Einhaltung der Höchstgrenzen', 'Dokumentation der Entfernung'],
          employeeCount: 12,
          employeesAnalyzed: 12,
          employeesBenefiting: 0,
          netBenefitEmployee: 900,
          employerCost: 1080
        },
        {
          id: 'internetpauschale',
          title: 'Internetpauschale',
          description: 'Steuerfreier Zuschuss bis 50 € monatlich für private Internetnutzung',
          potentialSavings: 4440,
          status: 'potential' as const,
          category: 'tax' as const,
          details: 'Steuerfreier Zuschuss bis 50 € monatlich für private Internetnutzung.',
          requirements: ['Nachweis der Internetkosten', 'Einhaltung der Höchstgrenzen', 'Dokumentation der beruflichen Nutzung'],
          employeeCount: 12,
          employeesAnalyzed: 12,
          employeesBenefiting: 0,
          netBenefitEmployee: 450,
          employerCost: 600
        }
      ];
      onComplete(mockOptimizations);
    } else {
      const mockOptimizations = [
        {
          id: crypto.randomUUID(),
          title: 'Sachbezüge optimieren',
          description: 'Einführung von steuerfreien Sachbezügen bis 50€ pro Monat pro Mitarbeiter',
          potentialSavings: 25200,
          status: 'unused' as const,
          category: 'structure' as const,
          details: 'Durch die Implementierung von Sachbezügen wie Gutscheinen oder Prepaidkarten können Sie Ihren Mitarbeitern steuerfreie Zusatzleistungen gewähren.',
          requirements: ['Dokumentation der Sachbezüge', 'Einhaltung der monatlichen Grenze von 50€', 'Keine Bargeldauszahlung'],
          employeeCount: Math.floor(client.employeeCount * 0.8),
          employeesAnalyzed: client.employeeCount,
          employeesBenefiting: Math.floor(client.employeeCount * 0.3),
          netBenefitEmployee: 600,
          employerCost: 720
        },
        {
          id: crypto.randomUUID(),
          title: 'Betriebliche Altersvorsorge (bAV)',
          description: 'Einführung oder Optimierung der betrieblichen Altersvorsorge',
          potentialSavings: 42800,
          status: 'potential' as const,
          category: 'tax' as const,
          details: 'Die bAV bietet sowohl für Arbeitgeber als auch Arbeitnehmer steuerliche Vorteile und kann zur Mitarbeiterbindung beitragen.',
          requirements: ['Auswahl eines geeigneten bAV-Systems', 'Dokumentation der Vereinbarungen', 'Information der Mitarbeiter'],
          employeeCount: Math.floor(client.employeeCount * 0.6),
          employeesAnalyzed: client.employeeCount,
          employeesBenefiting: 0,
          netBenefitEmployee: 900,
          employerCost: 1080
        }
      ];
      onComplete(mockOptimizations);
    }
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