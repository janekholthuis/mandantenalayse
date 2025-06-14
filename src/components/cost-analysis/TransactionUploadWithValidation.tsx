import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertTriangle, Download, Info, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';

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
  const { user } = useAuth();
  const { id: mandantId } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showGdprError, setShowGdprError] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'validation'>('upload');

  const downloadTemplate = () => {
    const csvContent = 'Belegdatum,Konto,Gegenkonto,Betrag,Buchungstext,Belegnummer,Währung,Soll/Haben-Kennzeichen\n"2025-01-15","1200","4400","-89.50","Stromabschlag Januar","RE-2025-001","EUR","S"\n"2025-01-14","1200","4300","-45.20","Internet & Telefon","RE-2025-002","EUR","S"\n"2025-01-13","1200","6800","-156.80","KFZ-Versicherung","RE-2025-003","EUR","S"';
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
        if (lowerField.includes('datum') || lowerField.includes('date') || lowerField.includes('belegdatum')) {
          autoMapping['datum'] = field;
        } else if (lowerField.includes('betrag') || lowerField.includes('amount')) {
          autoMapping['betrag'] = field;
        } else if (lowerField.includes('text') || lowerField.includes('beschreibung')) {
          autoMapping['buchungstext'] = field;
        } else if (lowerField.includes('konto') && !lowerField.includes('gegen')) {
          autoMapping['konto'] = field;
        } else if (lowerField.includes('gegenkonto')) {
          autoMapping['gegenkonto'] = field;
        } else if (lowerField.includes('währung') || lowerField.includes('currency')) {
          autoMapping['waehrung'] = field;
        } else if (lowerField.includes('soll') || lowerField.includes('haben')) {
          autoMapping['soll_haben'] = field;
        } else if (lowerField.includes('beleg') || lowerField.includes('nummer')) {
          autoMapping['belegnummer'] = field;
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

  const handleUpload = async () => {
    if (!gdprConsent) {
      setShowGdprError(true);
      showError('Bitte bestätigen Sie die DSGVO-Einverständniserklärung');
      return;
    }

    if (!user || !mandantId) {
      showError('Benutzer oder Mandant nicht gefunden');
      return;
    }
    setShowGdprError(false);
    setIsProcessing(true);
    
    try {
      // Transform data for Supabase insertion
      const transactionsForDb = parsedData.map(row => ({
        datum: row[fieldMapping['datum']] || null,
        betrag: parseFloat(row[fieldMapping['betrag']]) || 0,
        buchungstext: row[fieldMapping['buchungstext']] || '',
        konto: row[fieldMapping['konto']] || null,
        gegenkonto: row[fieldMapping['gegenkonto']] || null,
        waehrung: row[fieldMapping['waehrung']] || 'EUR',
        soll_haben: row[fieldMapping['soll_haben']] || null,
        belegnummer: row[fieldMapping['belegnummer']] || null,
        mandant_id: mandantId,
        user_id: user.id
      }));

      // Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('transaktionen')
        .insert(transactionsForDb)
        .select();

      if (error) {
        throw error;
      }

      // Transform data for frontend display
      const transactions = (insertedData || []).map(row => ({
        id: row.id,
        date: row.datum || '',
        amount: row.betrag || 0,
        description: row.buchungstext || '',
        category: 'Unbekannt', // Will be categorized by AI
        accountNumber: row.konto || '',
        // Include all Supabase fields
        datum: row.datum,
        buchungstext: row.buchungstext,
        betrag: row.betrag,
        waehrung: row.waehrung,
        konto: row.konto,
        gegenkonto: row.gegenkonto,
        soll_haben: row.soll_haben,
        belegnummer: row.belegnummer,
        mandant_id: row.mandant_id,
        user_id: row.user_id,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));

      onUploadComplete(transactions);
      showSuccess(`${transactions.length} Transaktionen erfolgreich hochgeladen`);
    } catch (error) {
      showError('Fehler beim Speichern der Transaktionen: ' + (error as Error).message);
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h5 className="text-sm font-medium text-blue-900 mb-2">DATEV-Feldmapping</h5>
            <p className="text-sm text-blue-800">
              Die Felder werden automatisch den DATEV-Standardfeldern zugeordnet. Überprüfen Sie die Zuordnung und passen Sie sie bei Bedarf an.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'datum', label: 'Belegdatum', required: true, description: 'Alternativ: Buchungsdatum' },
              { key: 'betrag', label: 'Betrag', required: true, description: 'Netto/Brutto je nach Exportart' },
              { key: 'buchungstext', label: 'Buchungstext', required: true, description: 'Basis für KI-Vertragserkennung' },
              { key: 'konto', label: 'Konto', required: false, description: 'Für Kontenanalyse/Kategorisierung' },
              { key: 'gegenkonto', label: 'Gegenkonto', required: false, description: 'z.B. Bank, Debitor, Kreditor' },
              { key: 'waehrung', label: 'Währung', required: false, description: 'Default = EUR' },
              { key: 'soll_haben', label: 'Soll/Haben-Kennzeichen', required: false, description: '"S" oder "H"' },
              { key: 'belegnummer', label: 'Belegnummer', required: false, description: 'Für Matching mit Belegsystem' }
            ].map(field => (
              <div key={field.key} className="border border-gray-200 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                <select
                  value={fieldMapping[field.key] || ''}
                  onChange={(e) => setFieldMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
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
                    {['datum', 'betrag', 'buchungstext', 'konto', 'gegenkonto'].map(field => (
                      <th key={field} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {field === 'datum' ? 'Datum' : 
                         field === 'betrag' ? 'Betrag' :
                         field === 'buchungstext' ? 'Buchungstext' :
                         field === 'konto' ? 'Konto' :
                         field === 'gegenkonto' ? 'Gegenkonto' : field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.slice(0, 5).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {['datum', 'betrag', 'buchungstext', 'konto', 'gegenkonto'].map(field => (
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
            disabled={!fieldMapping['datum'] || !fieldMapping['betrag'] || !fieldMapping['buchungstext'] || isProcessing}
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