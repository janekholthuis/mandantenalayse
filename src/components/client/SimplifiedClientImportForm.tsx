import React, { useState } from 'react';
import { X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { showSuccess, showError } from '../../lib/toast';
import SimpleUploadZone from './SimpleUploadZone';
import SimpleMappingZone from './SimpleMappingZone';
import SimpleImportZone from './SimpleImportZone';
import SimpleImportSuccess from './SimpleImportSuccess';

interface SimplifiedClientImportFormProps {
  onImportComplete: () => void;
  onClose: () => void;
}

interface ParsedClient {
  [key: string]: any;
}

type ImportStep = 'upload' | 'mapping' | 'import' | 'success';

const SimplifiedClientImportForm: React.FC<SimplifiedClientImportFormProps> = ({ 
  onImportComplete, 
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedClient[]>([]);
  const [mappedData, setMappedData] = useState<ParsedClient[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const parseFile = async (file: File): Promise<ParsedClient[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length < 2) {
            resolve([]);
            return;
          }
          
          const headers = jsonData[0];
          const parsedData: ParsedClient[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row: ParsedClient = {};
            
            headers.forEach((header: string, index: number) => {
              const value = jsonData[i][index];
              if (value !== undefined && value !== null && value !== '') {
                row[header] = value;
              }
            });
            
            // Only add rows that have some data
            if (Object.keys(row).length > 0) {
              parsedData.push(row);
            }
          }
          
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    
    try {
      const parsed = await parseFile(file);
      setParsedData(parsed);
      setCurrentStep('mapping');
      showSuccess(`📄 ${parsed.length} Datensätze erfolgreich gelesen`);
    } catch (error) {
      showError('❌ Fehler beim Verarbeiten der Datei');
      console.error('File parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingProceed = (mapped: ParsedClient[], mapping: Record<string, string>) => {
    setMappedData(mapped);
    setFieldMapping(mapping);
    setCurrentStep('import');
    showSuccess('✅ Feldzuordnung abgeschlossen');
  };

  const handleImportComplete = (count: number) => {
    setImportedCount(count);
    setCurrentStep('success');
  };

  const handleViewClients = () => {
    onImportComplete();
    onClose();
  };

  const handleStartAnalysis = () => {
    onImportComplete();
    onClose();
    // Navigate to first client for analysis
    window.location.href = '/clients';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <SimpleUploadZone
            onFileSelect={handleFileSelect}
            onBack={onClose}
            isProcessing={isProcessing}
          />
        );
      
      case 'mapping':
        return (
          <SimpleMappingZone
            data={parsedData}
            onBack={() => setCurrentStep('upload')}
            onProceed={handleMappingProceed}
          />
        );
      
      case 'import':
        return (
          <SimpleImportZone
            data={mappedData}
            onBack={() => setCurrentStep('mapping')}
            onComplete={handleImportComplete}
          />
        );
      
      case 'success':
        return (
          <SimpleImportSuccess
            importedCount={importedCount}
            onViewClients={handleViewClients}
            onStartAnalysis={handleStartAnalysis}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header - only show for non-success steps */}
        {currentStep !== 'success' && (
          <div className="bg-white rounded-t-xl border-b p-6">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="text-2xl font-semibold text-gray-900">
                  Mandanten hochladen
                </h5>
                <div className="flex items-center mt-3 space-x-2">
                  {['upload', 'mapping', 'import'].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : ['upload', 'mapping', 'import'].indexOf(currentStep) > index
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      {index < 2 && (
                        <div className={`w-12 h-1 mx-2 ${
                          ['upload', 'mapping', 'import'].indexOf(currentStep) > index
                            ? 'bg-green-600'
                            : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`overflow-y-auto ${currentStep !== 'success' ? 'max-h-[calc(95vh-140px)] bg-gray-50 p-6' : ''}`}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedClientImportForm;