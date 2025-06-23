import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';

interface ClientImportFormProps {
  onImportComplete: () => void;
  onClose: () => void;
}

interface ParsedClient {
  Firmenname: string;
  PLZ?: number;
  Stadt?: string;
  Mitarbeiter_Anzahl?: number;
  [key: string]: any;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const ClientImportForm: React.FC<ClientImportFormProps> = ({ onImportComplete, onClose }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedClient[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const downloadTemplate = () => {
    const csvContent = 'Firmenname,PLZ,Stadt,Mitarbeiter_Anzahl\n"Musterfirma GmbH",12345,"Berlin",25\n"Beispiel AG",54321,"München",50';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mandanten_standard_vorlage.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcelTemplate = () => {
    const data = [
      ['Firmenname', 'PLZ', 'Stadt', 'Mitarbeiter_Anzahl'],
      ['Musterfirma GmbH', 12345, 'Berlin', 25],
      ['Beispiel AG', 54321, 'München', 50]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mandanten');
    
    // Set column widths
    ws['!cols'] = [
      { width: 25 }, // Firmenname
      { width: 10 }, // PLZ
      { width: 20 }  // Stadt
    ];
    
    XLSX.writeFile(wb, 'mandanten_vorlage.xlsx');
  };

  const downloadDatevTemplate = () => {
    const csvContent = 'Mandantennummer,Mandantenname,Beraternummer,Branche,Ansprechpartner,Status,Mitarbeiter_Anzahl\n"12345","Musterfirma GmbH","001","IT-Dienstleistungen","Max Mustermann","aktiv",25\n"67890","Beispiel AG","001","Handel","Anna Schmidt","aktiv",50';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'datev_mandanten_vorlage.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (csvText: string): ParsedClient[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data: ParsedClient[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
      const row: ParsedClient = { Firmenname: '' };

      headers.forEach((header, index) => {
        if (values[index] !== undefined) {
          // Map DATEV fields to our schema
          let mappedHeader = header;
          if (header === 'Mandantenname') {
            mappedHeader = 'Firmenname';
          }
          
          if (mappedHeader === 'PLZ' && values[index]) {
            const plz = parseInt(values[index]);
            if (!isNaN(plz)) {
              row[mappedHeader] = plz;
            }
          } else if (mappedHeader === 'Mitarbeiter_Anzahl' && values[index]) {
            const mitarbeiterAnzahl = parseInt(values[index]);
            if (!isNaN(mitarbeiterAnzahl) && mitarbeiterAnzahl >= 0) {
              row[mappedHeader] = mitarbeiterAnzahl;
            }
          } else if (values[index]) {
            row[mappedHeader] = values[index];
          }
        }
      });

      // Only add rows that have at least a company name
      if (row.Firmenname && row.Firmenname.trim() !== '') {
        data.push(row);
      }
    }

    return data;
  };

  const parseExcel = (file: File): Promise<ParsedClient[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length < 2) {
            resolve([]);
            return;
          }
          
          const headers = jsonData[0];
          const parsedData: ParsedClient[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row: ParsedClient = { Firmenname: '' };
            
            headers.forEach((header: string, index: number) => {
              const value = jsonData[i][index];
              if (value !== undefined && value !== null && value !== '') {
                // Map DATEV fields to our schema
                let mappedHeader = header;
                if (header === 'Mandantenname') {
                  mappedHeader = 'Firmenname';
                }
                
                if (mappedHeader === 'PLZ' && typeof value === 'number') {
                  row[mappedHeader] = value;
                } else if (mappedHeader === 'PLZ' && typeof value === 'string') {
                  const plz = parseInt(value);
                  if (!isNaN(plz)) {
                    row[mappedHeader] = plz;
                  }
                } else if (mappedHeader === 'Mitarbeiter_Anzahl' && typeof value === 'number') {
                  if (value >= 0) {
                    row[mappedHeader] = value;
                  }
                } else if (mappedHeader === 'Mitarbeiter_Anzahl' && typeof value === 'string') {
                  const mitarbeiterAnzahl = parseInt(value);
                  if (!isNaN(mitarbeiterAnzahl) && mitarbeiterAnzahl >= 0) {
                    row[mappedHeader] = mitarbeiterAnzahl;
                  }
                } else {
                  row[mappedHeader] = String(value);
                }
              }
            });
            
            // Only add rows that have at least a company name
            if (row.Firmenname && row.Firmenname.trim() !== '') {
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

  const validateData = (data: ParsedClient[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    data.forEach((row, index) => {
      // Validate required fields
      if (!row.Firmenname || row.Firmenname.trim() === '') {
        errors.push({
          row: index + 2, // +2 because index starts at 0 and we skip header
          field: 'Firmenname',
          message: 'Firmenname ist erforderlich'
        });
      }

      if (row.Mitarbeiter_Anzahl !== undefined && (row.Mitarbeiter_Anzahl < 0 || !Number.isInteger(row.Mitarbeiter_Anzahl))) {
        errors.push({
          row: index + 2,
          field: 'Mitarbeiter_Anzahl',
          message: 'Mitarbeiteranzahl muss eine positive ganze Zahl sein'
        });
      }

      // Validate PLZ if provided
      if (row.PLZ && (row.PLZ < 1000 || row.PLZ > 99999)) {
        errors.push({
          row: index + 2,
          field: 'PLZ',
          message: 'PLZ muss eine 5-stellige Zahl sein'
        });
      }

      // Validate Firmenname length
      if (row.Firmenname && row.Firmenname.length > 255) {
        errors.push({
          row: index + 2,
          field: 'Firmenname',
          message: 'Firmenname darf maximal 255 Zeichen lang sein'
        });
      }

      // Validate Stadt length
      if (row.Stadt && row.Stadt.length > 255) {
        errors.push({
          row: index + 2,
          field: 'Stadt',
          message: 'Stadt darf maximal 255 Zeichen lang sein'
        });
      }
    });

    return errors;
  };

  const isExcelFile = (file: File): boolean => {
    return file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || 
           file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           file.type === 'application/vnd.ms-excel';
  };

  const isCsvFile = (file: File): boolean => {
    return file.name.endsWith('.csv') || file.type === 'text/csv';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!isCsvFile(selectedFile) && !isExcelFile(selectedFile)) {
        showError('Bitte wählen Sie eine CSV- oder Excel-Datei aus');
        return;
      }
      setFile(selectedFile);
      setParsedData([]);
      setValidationErrors([]);
      setShowPreview(false);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      let parsed: ParsedClient[] = [];
      
      if (isExcelFile(file)) {
        parsed = await parseExcel(file);
      } else if (isCsvFile(file)) {
        const reader = new FileReader();
        parsed = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            try {
              const csvText = e.target?.result as string;
              resolve(parseCSV(csvText));
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
          reader.readAsText(file, 'UTF-8');
        });
      }
      
      const errors = validateData(parsed);
      
      setParsedData(parsed);
      setValidationErrors(errors);
      setShowPreview(true);
      
      if (errors.length > 0) {
        showError(`${errors.length} Validierungsfehler gefunden. Bitte korrigieren Sie diese vor dem Import.`);
      } else {
        showSuccess(`${parsed.length} Datensätze erfolgreich validiert`);
      }
    } catch (error) {
      showError('Fehler beim Parsen der Datei');
      console.error('File parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!user || parsedData.length === 0 || validationErrors.length > 0) return;

    setIsProcessing(true);
    
    try {
      const dataToInsert = parsedData.map(row => ({
        name: row.Firmenname,
        plz: row.PLZ ? row.PLZ.toString() : null,
        ort: row.Stadt || null,
        Mitarbeiter_Anzahl: row.Mitarbeiter_Anzahl || 0,
        user_id: user.id
      }));

      const { data, error } = await supabase
        .from('clients')
        .insert(dataToInsert)
        .select();

      if (error) {
        throw error;
      }

      showSuccess(`${data.length} Mandanten erfolgreich importiert`);
      onImportComplete();
      onClose();
    } catch (error: any) {
      console.error('Import error:', error);
      if (error.message.includes('duplicate key')) {
        showError('Einige Mandanten existieren bereits. Bitte überprüfen Sie Ihre Daten.');
      } else {
        showError('Fehler beim Importieren der Mandanten: ' + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mandanten hochladen</h2>
            <p className="text-sm text-gray-600 mt-1">
              Laden Sie eine CSV- oder Excel-Datei mit Mandantendaten hoch
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Template Download */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-800">Vorlagen herunterladen</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Laden Sie eine Beispieldatei herunter oder nutzen Sie die DATEV-kompatible Vorlage
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={downloadDatevTemplate}
                  icon={<Download size={16} />}
                  className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  DATEV-Vorlage
                </Button>
                <Button
                  variant="secondary"
                  onClick={downloadTemplate}
                  icon={<Download size={16} />}
                  className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  Standard CSV
                </Button>
                <Button
                  variant="secondary"
                  onClick={downloadExcelTemplate}
                  icon={<Download size={16} />}
                  className="bg-white text-green-700 border-green-300 hover:bg-green-50"
                >
                  Standard Excel
                </Button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datei auswählen (CSV oder Excel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-gray-600">
                  Klicken Sie hier oder ziehen Sie eine CSV- oder Excel-Datei hierher
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  icon={<Upload size={16} />}
                >
                  Datei auswählen
                </Button>
              </div>
            </div>
            
            {file && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                      {isExcelFile(file) ? 'Excel' : 'CSV'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setParsedData([]);
                      setValidationErrors([]);
                      setShowPreview(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* File Format Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Dateiformat</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Standard-Format:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                    <li><code>Firmenname</code> - Name des Unternehmens (erforderlich)</li>
                    <li><code>PLZ</code> - Postleitzahl (optional, 5-stellig)</li>
                    <li><code>Stadt</code> - Stadt (optional)</li>
                    <li><code>Mitarbeiter_Anzahl</code> - Anzahl der Mitarbeiter (optional, positive Zahl)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>DATEV-Format (unterstützt):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                    <li><code>Mandantenname</code> wird zu <code>Firmenname</code> gemappt</li>
                    <li><code>Mandantennummer</code> (wird ignoriert)</li>
                    <li><code>Beraternummer</code> (wird ignoriert)</li>
                    <li><code>Branche</code> (wird ignoriert)</li>
                    <li><code>Status</code> (wird ignoriert)</li>
                    <li><code>Mitarbeiter_Anzahl</code> - Anzahl der Mitarbeiter (optional)</li>
                  </ul>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                <strong>Unterstützte Formate:</strong> CSV (.csv), Excel (.xlsx, .xls) | 
                <strong> DATEV-Export:</strong> Direkt aus DATEV Arbeitsplatz pro exportierte Dateien werden automatisch erkannt
              </p>
            </div>
          </div>

          {/* Preview Button */}
          {file && !showPreview && (
            <div className="mb-6">
              <Button
                variant="primary"
                onClick={handlePreview}
                isLoading={isProcessing}
                className="w-full"
              >
                Datei validieren und Vorschau anzeigen
              </Button>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-800">
                  Validierungsfehler ({validationErrors.length})
                </h3>
              </div>
              <div className="max-h-32 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    Zeile {error.row}, {error.field}: {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Preview */}
          {showPreview && parsedData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Datenvorschau ({parsedData.length} Datensätze)
                </h3>
                {validationErrors.length === 0 && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Alle Daten gültig</span>
                  </div>
                )}
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Firmenname
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          PLZ
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Stadt
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Mitarbeiter
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {row.Firmenname || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {row.PLZ || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {row.Stadt || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {row.Mitarbeiter_Anzahl || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 10 && (
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center">
                    ... und {parsedData.length - 10} weitere Datensätze
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Abbrechen
          </Button>
          {showPreview && (
            <Button
              variant="primary"
              onClick={handleImport}
              isLoading={isProcessing}
              disabled={validationErrors.length > 0 || parsedData.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {parsedData.length} Mandanten importieren
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientImportForm;