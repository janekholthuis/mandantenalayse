import React, { useState } from 'react';
import { X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../lib/toast';
import UploadIntroCard from './UploadIntroCard';
import FileUploadZone from './FileUploadZone';
import DataPreviewMapping from './DataPreviewMapping';
import ValidationConfirmation from './ValidationConfirmation';
import ImportSuccess from './ImportSuccess';

interface EnhancedClientImportFormProps {
  onImportComplete: () => void;
  onClose: () => void;
}

interface ParsedClient {
  [key: string]: any;
}

type ImportStep = 'intro' | 'upload' | 'preview' | 'validation' | 'success';

const EnhancedClientImportForm: React.FC<EnhancedClientImportFormProps> = ({ 
  onImportComplete, 
  onClose 
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<ImportStep>('intro');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedClient[]>([]);
  const [mappedData, setMappedData] = useState<ParsedClient[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState({
    imported: 0,
    duplicates: 0,
    errors: 0
  });

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
      setCurrentStep('preview');
    } catch (error) {
      showError('Fehler beim Verarbeiten der Datei');
      console.error('File parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewProceed = (mapped: ParsedClient[], mapping: Record<string, string>) => {
    setMappedData(mapped);
    setFieldMapping(mapping);
    setCurrentStep('validation');
  };

  const handleImportConfirm = async (skipErrors: boolean, gdprConsent: boolean) => {
    if (!user || !gdprConsent) return;

    setIsProcessing(true);
    
    try {
      // Prepare data for insertion - simplified to match NewClientForm fields
      const dataToInsert = mappedData
        .filter(row => {
          // Basic validation - skip rows without required fields
          return row.Firmenname && row.Anzahl_Mitarbeiter && row.Strasse && row.PLZ && row.Ort;
        })
        .map(row => ({
          name: row.Firmenname,
          employee_count: parseInt(row.Anzahl_Mitarbeiter?.toString()) || 0,
          strasse: row.Strasse,
          plz: parseInt(row.PLZ?.toString()) || null,
          ort: row.Ort,
          land: row.Land || 'Deutschland',
          legal_form: row.Unternehmensform ? parseInt(row.Rechtsform.toString()) || null : null,
          user_id: user.id
        }));

      const { data, error } = await supabase
        .from('clients')
        .insert(dataToInsert)
        .select();

      if (error) {
        throw error;
      }

      // Calculate import statistics
      const imported = data?.length || 0;
      const duplicates = 0; // Could be calculated based on unique constraints
      const errors = mappedData.length - imported;

      setImportStats({
        imported,
        duplicates,
        errors
      });

      setCurrentStep('success');
      showSuccess(`${imported} Mandanten erfolgreich importiert`);
      
    } catch (error: any) {
      console.error('Import error:', error);
      showError('Fehler beim Importieren der Mandanten: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartAnalysis = () => {
    onImportComplete();
    onClose();
    // Navigate to first client for analysis
    window.location.href = '/clients';
  };

  const handleViewClients = () => {
    onImportComplete();
    onClose();
  };

  const handleUploadAnother = () => {
    // Reset state and go back to intro
    setCurrentStep('intro');
    setSelectedFile(null);
    setParsedData([]);
    setMappedData([]);
    setFieldMapping({});
    setImportStats({ imported: 0, duplicates: 0, errors: 0 });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <UploadIntroCard 
            onStartUpload={() => setCurrentStep('upload')}
          />
        );
      
      case 'upload':
        return (
          <FileUploadZone
            onFileSelect={handleFileSelect}
            onBack={() => setCurrentStep('intro')}
            isProcessing={isProcessing}
          />
        );
      
      case 'preview':
        return (
          <DataPreviewMapping
            data={parsedData}
            onBack={() => setCurrentStep('upload')}
            onProceed={handlePreviewProceed}
          />
        );
      
      case 'validation':
        return (
          <ValidationConfirmation
            data={mappedData}
            duplicates={0} // Could be calculated
            errors={0} // Could be calculated based on validation
            onBack={() => setCurrentStep('preview')}
            onConfirm={handleImportConfirm}
            isImporting={isProcessing}
          />
        );
      
      case 'success':
        return (
          <ImportSuccess
            importedCount={importStats.imported}
            duplicatesRemoved={importStats.duplicates}
            errorsSkipped={importStats.errors}
            onStartAnalysis={handleStartAnalysis}
            onDownloadReport={() => {}}
            onUploadAnother={handleUploadAnother}
            onViewClients={handleViewClients}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        {currentStep !== 'success' && (
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Mandanten hochladen
              </h2>
              <div className="flex items-center mt-2 space-x-2">
                {['intro', 'upload', 'preview', 'validation'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step
                        ? 'bg-blue-600 text-white'
                        : ['intro', 'upload', 'preview', 'validation'].indexOf(currentStep) > index
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className={`w-8 h-1 mx-2 ${
                        ['intro', 'upload', 'preview', 'validation'].indexOf(currentStep) > index
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
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedClientImportForm;