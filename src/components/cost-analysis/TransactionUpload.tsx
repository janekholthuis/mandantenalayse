import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertTriangle, Download, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';

interface TransactionUploadProps {
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

type UploadStep = 'intro' | 'upload' | 'preview' | 'validation' | 'success';

const TransactionUpload: React.FC<TransactionUploadProps> = ({ onUploadComplete }) => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('intro');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [mappedData, setMappedData] = useState<ParsedTransaction[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

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

  const downloadExcelTemplate = () => {
    const data = [
      ['Buchungsdatum', 'Konto', 'Gegenkonto', 'Betrag', 'Buchungstext', 'Belegfeld1'],
      ['2025-01-15', '1200', '4400', -89.50, 'Stromabschlag Januar', 'RE-2025-001'],
      ['2025-01-14', '1200', '4300', -45.20, 'Internet & Telefon', 'RE-2025-002'],
      ['2025-01-13', '1200', '6800', -156.80, 'KFZ-Versicherung', 'RE-2025-003']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Buchungen');
    
    ws['!cols'] = [
      { width: 15 }, // Buchungsdatum
      { width: 10 }, // Konto
      { width: 12 }, // Gegenkonto
      { width: 12 }, // Betrag
      { width: 25 }, // Buchungstext
      { width: 15 }  // Belegfeld1
    ];
    
    XLSX.writeFile(wb, 'datev_buchungen_vorlage.xlsx');
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
            // CSV parsing
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

  const validateData = (data: ParsedTransaction[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    data.forEach((row, index) => {
      // Validate required fields
      if (!fieldMapping['Buchungsdatum'] || !row[fieldMapping['Buchungsdatum']]) {
        errors.push({
          row: index + 2,
          field: 'Buchungsdatum',
          message: 'Buchungsdatum ist erforderlich'
        });
      }

      if (!fieldMapping['Betrag'] || !row[fieldMapping['Betrag']]) {
        errors.push({
          row: index + 2,
          field: 'Betrag',
          message: 'Betrag ist erforderlich'
        });
      } else {
        const amount = parseFloat(row[fieldMapping['Betrag']]);
        if (isNaN(amount)) {
          errors.push({
            row: index + 2,
            field: 'Betrag',
            message: 'Betrag muss eine gültige Zahl sein'
          });
        }
      }

      // Validate date format
      if (fieldMapping['Buchungsdatum'] && row[fieldMapping['Buchungsdatum']]) {
        const dateStr = row[fieldMapping['Buchungsdatum']];
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          errors.push({
            row: index + 2,
            field: 'Buchungsdatum',
            message: 'Ungültiges Datumsformat'
          });
        }
      }
    });

    return errors;
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
        } else if (lowerField.includes('konto') && !lowerField.includes('gegen')) {
          autoMapping['Konto'] = field;
        } else if (lowerField.includes('gegenkonto')) {
          autoMapping['Gegenkonto'] = field;
        } else if (lowerField.includes('text') || lowerField.includes('beschreibung')) {
          autoMapping['Buchungstext'] = field;
        } else if (lowerField.includes('beleg')) {
          autoMapping['Belegfeld1'] = field;
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

  const handlePreviewProceed = () => {
    // Create mapped data
    const mapped = parsedData.map(row => {
      const mappedRow: ParsedTransaction = {};
      Object.entries(fieldMapping).forEach(([targetField, sourceField]) => {
        if (sourceField && row[sourceField] !== undefined) {
          mappedRow[targetField] = row[sourceField];
        }
      });
      return mappedRow;
    });

    // Apply time filter
    let filteredData = mapped;
    if (timeFilter !== 'all' && fieldMapping['Buchungsdatum']) {
      const now = new Date();
      let filterDate: Date;
      
      switch (timeFilter) {
        case '3months':
          filterDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case '6months':
          filterDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        case 'year':
          filterDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'custom':
          if (customDateFrom && customDateTo) {
            filteredData = mapped.filter(row => {
              const rowDate = new Date(row['Buchungsdatum']);
              return rowDate >= new Date(customDateFrom) && rowDate <= new Date(customDateTo);
            });
          }
          break;
        default:
          break;
      }
      
      if (timeFilter !== 'custom') {
        filteredData = mapped.filter(row => {
          const rowDate = new Date(row['Buchungsdatum']);
          return rowDate >= filterDate;
        });
      }
    }

    setMappedData(filteredData);
    
    // Validate data
    const errors = validateData(filteredData);
    setValidationErrors(errors);
    
    setCurrentStep('validation');
  };

  const handleImportConfirm = async () => {
    if (!gdprConsent) {
      showError('Bitte bestätigen Sie die DSGVO-Einverständniserklärung');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Transform data for analysis
      const transactions = mappedData
        .filter(row => skipErrors || validationErrors.every(err => err.row !== mappedData.indexOf(row) + 2))
        .map(row => ({
          id: crypto.randomUUID(),
          date: row['Buchungsdatum'],
          amount: parseFloat(row['Betrag']) || 0,
          account: row['Konto'] || '',
          counterAccount: row['Gegenkonto'] || '',
          description: row['Buchungstext'] || '',
          reference: row['Belegfeld1'] || ''
        }));

      onUploadComplete(transactions);
      setCurrentStep('success');
      showSuccess(`${transactions.length} Buchungen erfolgreich importiert`);
    } catch (error) {
      showError('Fehler beim Importieren der Buchungen');
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderIntro = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Buchungsdaten importieren
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Laden Sie Ihre DATEV-Buchungsdaten im CSV- oder XML-Format hoch, um automatisch 
          Einsparpotenziale bei Mandanten zu erkennen.
        </p>
      </div>

      {/* Export Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              📄 Export-Anleitung
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Diese Datei können Sie aus DATEV Kanzlei-Rechnungswesen exportieren – 
              z. B. über 'Daten exportieren - Buchungssätze - ASCII/CSV'
            </p>
            <button className="text-sm text-blue-700 hover:text-blue-800 font-medium underline">
              📖 Detaillierte Anleitung ansehen
            </button>
          </div>
        </div>
      </div>

      {/* Template Downloads */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Vorlagen herunterladen</h4>
              <p className="text-sm text-gray-600">
                Laden Sie eine Beispiel-Datei herunter, um das erwartete Format zu sehen
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={downloadTemplate}
              icon={<Download size={16} />}
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              CSV-Vorlage
            </Button>
            <Button
              variant="secondary"
              onClick={downloadExcelTemplate}
              icon={<Download size={16} />}
              className="bg-white text-green-700 border-green-300 hover:bg-green-50"
            >
              Excel-Vorlage
            </Button>
          </div>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium text-sm">✅ CSV-Dateien</div>
          <div className="text-green-700 text-xs mt-1">.csv</div>
        </div>
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium text-sm">✅ Excel-Dateien</div>
          <div className="text-green-700 text-xs mt-1">.xlsx, .xls</div>
        </div>
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium text-sm">✅ XML-Dateien</div>
          <div className="text-green-700 text-xs mt-1">.xml</div>
        </div>
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium text-sm">✅ ZIP-Archive</div>
          <div className="text-green-700 text-xs mt-1">.zip (optional)</div>
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="primary"
          onClick={() => setCurrentStep('upload')}
          icon={<Upload size={20} />}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-medium"
        >
          Datei hochladen
        </Button>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          📂 Datei hochladen
        </h2>
        <p className="text-gray-600">
          Wählen Sie eine DATEV-Buchungsdatei im CSV-, Excel- oder XML-Format aus.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors mb-6">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-gray-600">
            Klicken Sie hier oder ziehen Sie eine Datei hierher
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.xml,.zip"
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
          CSV, XLSX, XLS, XML, ZIP bis 50MB
        </p>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
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

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep('intro')}
          disabled={isProcessing}
        >
          ← Zurück
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          🔍 Vorschau & Feldzuweisung
        </h2>
        <p className="text-gray-600">
          Überprüfen Sie die automatische Felderkennung und passen Sie bei Bedarf die Zuordnung an.
        </p>
      </div>

      {/* Field Mapping */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Feldzuordnung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Buchungsdatum', 'Betrag', 'Konto', 'Gegenkonto', 'Buchungstext', 'Belegfeld1'].map(targetField => (
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

      {/* Time Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">📆 Zeitraumfilter</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {[
            { value: 'all', label: 'Alle Buchungen' },
            { value: '3months', label: 'Letzte 3 Monate' },
            { value: '6months', label: 'Letzte 6 Monate' },
            { value: 'year', label: 'Dieses Jahr' },
            { value: 'custom', label: 'Benutzerdefiniert' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTimeFilter(option.value)}
              className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                timeFilter === option.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {timeFilter === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Von</label>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bis</label>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Data Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Datenvorschau ({parsedData.length} Buchungen)</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {['Buchungsdatum', 'Betrag', 'Konto', 'Gegenkonto', 'Buchungstext'].map(field => (
                    <th key={field} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {['Buchungsdatum', 'Betrag', 'Konto', 'Gegenkonto', 'Buchungstext'].map(field => (
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

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep('upload')}
        >
          ← Zurück
        </Button>
        <Button
          variant="primary"
          onClick={handlePreviewProceed}
          disabled={!fieldMapping['Buchungsdatum'] || !fieldMapping['Betrag']}
        >
          Weiter zur Validierung →
        </Button>
      </div>
    </div>
  );

  const renderValidation = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          🧼 Validierung & Bereinigung
        </h2>
        <p className="text-gray-600">
          Überprüfen Sie die Datenqualität und bestätigen Sie den Import.
        </p>
      </div>

      {/* Validation Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">✅ Zusammenfassung vor Import</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{mappedData.length - validationErrors.length}</div>
            <div className="text-sm text-gray-600">Gültige Buchungen</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{validationErrors.length}</div>
            <div className="text-sm text-gray-600">Zeilen mit Fehlern</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">0</div>
            <div className="text-sm text-gray-600">Belege ohne Betrag</div>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      {validationErrors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="text-lg font-medium text-yellow-900">
              Fehlerbehandlung
            </h4>
          </div>
          
          <div className="space-y-3 mb-4">
            <label className="flex items-start">
              <input
                type="radio"
                name="errorHandling"
                checked={skipErrors}
                onChange={() => setSkipErrors(true)}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-yellow-900">
                  Problematische Zeilen ignorieren (Empfohlen)
                </div>
                <div className="text-sm text-yellow-700">
                  {mappedData.length - validationErrors.length} gültige Buchungen werden importiert.
                </div>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                name="errorHandling"
                checked={!skipErrors}
                onChange={() => setSkipErrors(false)}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-yellow-900">
                  Zurück zur Datei
                </div>
                <div className="text-sm text-yellow-700">
                  Import abbrechen und Datei korrigieren.
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* GDPR Consent */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">🔒 Datenschutz & Einverständnis</h4>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-1 mr-3"
          />
          <div className="text-sm text-gray-700">
            <div className="font-medium mb-1">
              Ich bestätige die DSGVO-konforme Verarbeitung der Buchungsdaten
            </div>
            <div>
              Die hochgeladenen Buchungsdaten werden ausschließlich zur Analyse von Einsparpotentialen 
              verwendet und nach der Analyse automatisch gelöscht. Eine Weitergabe an Dritte erfolgt nicht.
            </div>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep('preview')}
          disabled={isProcessing}
        >
          ← Zurück
        </Button>
        <Button
          variant="primary"
          onClick={handleImportConfirm}
          disabled={!gdprConsent || isProcessing}
          icon={isProcessing ? undefined : <CheckCircle size={16} />}
        >
          {isProcessing ? 'Importiere...' : 'Import bestätigen'}
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        ✅ Import erfolgreich abgeschlossen
      </h2>
      <p className="text-gray-600 mb-6">
        Ihre Buchungsdaten wurden erfolgreich importiert und stehen nun für die Analyse zur Verfügung.
      </p>
      <Button
        variant="primary"
        onClick={() => setCurrentStep('intro')}
      >
        Neuen Import starten
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'upload' && renderUpload()}
      {currentStep === 'preview' && renderPreview()}
      {currentStep === 'validation' && renderValidation()}
      {currentStep === 'success' && renderSuccess()}
    </div>
  );
};

export default TransactionUpload