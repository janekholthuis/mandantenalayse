import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertTriangle, Download, Info, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';

interface TransactionUploadWithValidationProps {
  onUploadComplete: (transactions: any[]) => void;
}

interface ParsedTransaction {
  [key: string]: any;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const TransactionUploadWithValidation: React.FC<TransactionUploadWithValidationProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showGdprError, setShowGdprError] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'validation'>('upload');

  const downloadTemplate = () => {
    const csvContent = 'Buchungsdatum,Konto,Gegenkonto,Betrag,Buchungstext,Belegfeld1\n"2025-01-15","1200","4400","-89.50","Stromabschlag Januar","RE-2025-001"\n"2025-01-14","1200","4300","-45.20","Internet & Telefon","RE-2025-002"\n"2025-01-13","1200","6800","-156.80","KFZ-Versicherung","RE-2025-003"';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'datev_buchungen_vorlage.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseFile = async (file: File): Promise<ParsedTransaction[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          let data: any[][];
          
          if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const workbook = XLSX.read(e.target?.result, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          } else {
            const csvText = e.target?.result as string;
            data = csvText.trim().split('\n').map(line => 
              line.split(',').map(cell => cell.trim().replace(/"/g, ''))
            );
          }
          
          if (data.length < 2) {
            resolve([]);
            return;
          }
          
          const headers = data[0];
          const parsedData: ParsedTransaction[] = [];
          
          for (let i = 1; i < data.length; i++) {
            const row: ParsedTransaction = {};
            headers.forEach((header: string, index: number) => {
              const value = data[i][index];
              if (value !== undefined && value !== null && value !== '') {
                row[header] = value;
              }
            });
            
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
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file, 'UTF-8');
      }
    });
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    
    try {
      const parsed = await parseFile(file);
      setParsedData(parsed);
      
      // Auto-detect field mapping
      const sourceFields = parsed.length > 0 ? Object.keys(parsed[0]) : [];
      const autoMapping: Record<string, string> = {};
      
      sourceFields.forEach(field => {
        const lowerField = field.toLowerCase();
        if (lowerField.includes('datum') || lowerField.includes('date')) {
          autoMapping['Buchungsdatum'] = field;
        } else if (lowerField.includes('betrag') || lowerField.includes('amount')) {
          autoMapping['Betrag'] = field;
        } else if (lowerField.includes('text') || lowerField.includes('beschreibung')) {
          autoMapping['Buchungstext'] = field;
        } else if (lowerField.includes('konto') && !lowerField.includes('gegen')) {
          autoMapping['Konto'] = field;
        } else if (lowerField.includes('gegenkonto')) {
          autoMapping['Gegenkonto'] = field;
        }
      });
      
      setFieldMapping(autoMapping);
      setCurrentStep('preview');
    } catch (error) {
      showError('Fehler beim Verarbeiten der Datei');
      console.error('File parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = () => {
    if (!gdprConsent) {
      setShowGdprError(true);
      showError('Bitte bestätigen Sie die DSGVO-Einverständniserklärung');
      return;
    }

    setShowGdprError(false);
    setIsProcessing(true);
    
    try {
      // Transform data for analysis
      const transactions = parsedData.map(row => ({
        id: crypto.randomUUID(),
        date: row[fieldMapping['Buchungsdatum']] || '',
        amount: parseFloat(row[fieldMapping['Betrag']]) || 0,
        description: row[fieldMapping['Buchungstext']] || '',
        category: 'Unbekannt',
        accountNumber: row[fieldMapping['Konto']] || ''
      }));

      onUploadComplete(transactions);
      showSuccess(`${transactions.length} Transaktionen erfolgreich hochgeladen`);
    } catch (error) {
      showError('Fehler beim Verarbeiten der Transaktionen');
      console.error('Upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (currentStep === 'upload') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Transaktionen hochladen</h3>
          <p className="text-gray-600">
            Laden Sie Ihre DATEV-Buchungsdaten im CSV- oder Excel-Format hoch.
          </p>
        </div>

        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900">Vorlage herunterladen</h4>
              <p className="text-sm text-blue-700">
                Laden Sie eine Beispiel-Datei herunter, um das erwartete Format zu sehen
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={downloadTemplate}
              icon={<Download size={16} />}
              className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
            >
              CSV-Vorlage
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors mb-6">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-gray-600">
              Klicken Sie hier oder ziehen Sie eine CSV- oder Excel-Datei hierher
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="secondary"
              onClick={() => document.getElementById('file-upload')?.click()}
              icon={<Upload size={16} />}
              disabled={isProcessing}
            >
              Datei auswählen
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            CSV, XLSX, XLS bis 50MB
          </p>
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {isProcessing && (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  <span className="text-sm text-blue-600">Verarbeite...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 'preview') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Datenvorschau</h3>
          <p className="text-gray-600">
            Überprüfen Sie die Feldzuordnung und bestätigen Sie den Upload.
          </p>
        </div>

        {/* Field Mapping */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Feldzuordnung</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Buchungsdatum', 'Betrag', 'Buchungstext', 'Konto'].map(targetField => (
              <div key={targetField} className="border border-gray-200 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  {targetField}
                  {['Buchungsdatum', 'Betrag'].includes(targetField) && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  value={fieldMapping[targetField] || ''}
                  onChange={(e) => setFieldMapping(prev => ({ ...prev, [targetField]: e.target.value }))}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Spalte wählen --</option>
                  {parsedData.length > 0 && Object.keys(parsedData[0]).map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Data Preview */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Datenvorschau ({parsedData.length} Transaktionen)</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {['Buchungsdatum', 'Betrag', 'Buchungstext', 'Konto'].map(field => (
                      <th key={field} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.slice(0, 5).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {['Buchungsdatum', 'Betrag', 'Buchungstext', 'Konto'].map(field => (
                        <td key={field} className="px-4 py-2 text-sm text-gray-900">
                          {fieldMapping[field] ? row[fieldMapping[field]] || '-' : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* GDPR Consent */}
        <div className={`bg-gray-50 border rounded-lg p-4 mb-6 ${showGdprError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
          <div className="flex items-center mb-3">
            {showGdprError && <AlertCircle className="h-5 w-5 text-red-600 mr-2" />}
            <h4 className={`text-md font-medium ${showGdprError ? 'text-red-900' : 'text-gray-900'}`}>
              DSGVO-Einverständnis
            </h4>
          </div>
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={gdprConsent}
              onChange={(e) => {
                setGdprConsent(e.target.checked);
                if (e.target.checked) setShowGdprError(false);
              }}
              className="mt-1 mr-3"
            />
            <div className={`text-sm ${showGdprError ? 'text-red-700' : 'text-gray-700'}`}>
              <div className="font-medium mb-1">
                Ich bestätige die DSGVO-konforme Verarbeitung der Buchungsdaten
              </div>
              <div>
                Die hochgeladenen Buchungsdaten werden ausschließlich zur Analyse von Einsparpotentialen 
                verwendet und nach der Analyse automatisch gelöscht.
              </div>
            </div>
          </label>
          {showGdprError && (
            <div className="mt-2 text-sm text-red-600 font-medium">
              ⚠️ Bitte bestätigen Sie die DSGVO-Einverständniserklärung, um fortzufahren.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setCurrentStep('upload')}
            disabled={isProcessing}
          >
            ← Zurück
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!fieldMapping['Buchungsdatum'] || !fieldMapping['Betrag'] || isProcessing}
            isLoading={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Lade hoch...' : 'Transaktionen hochladen'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default TransactionUploadWithValidation;