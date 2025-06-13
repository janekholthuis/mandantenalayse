import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
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
    const csvContent = 'Firmenname,PLZ,Stadt\n"Musterfirma GmbH",12345,"Berlin"\n"Beispiel AG",54321,"München"';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mandanten_vorlage.csv');
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
          if (header === 'PLZ' && values[index]) {
            const plz = parseInt(values[index]);
            if (!isNaN(plz)) {
              row[header] = plz;
            }
          } else {
            row[header] = values[index];
          }
        }
      });

      data.push(row);
    }

    return data;
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

      // Validate PLZ if provided
      if (row.PLZ && (row.PLZ < 10000 || row.PLZ > 99999)) {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        showError('Bitte wählen Sie eine CSV-Datei aus');
        return;
      }
      setFile(selectedFile);
      setParsedData([]);
      setValidationErrors([]);
      setShowPreview(false);
    }
  };

  const handlePreview = () => {
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsed = parseCSV(csvText);
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
        showError('Fehler beim Parsen der CSV-Datei');
        console.error('CSV parsing error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      showError('Fehler beim Lesen der Datei');
      setIsProcessing(false);
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = async () => {
    if (!user || parsedData.length === 0 || validationErrors.length > 0) return;

    setIsProcessing(true);
    
    try {
      const dataToInsert = parsedData.map(row => ({
        Firmenname: row.Firmenname,
        PLZ: row.PLZ || null,
        Stadt: row.Stadt || null,
        user_id: user.id
      }));

      const { data, error } = await supabase
        .from('Mandanten')
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
            <h2 className="text-xl font-semibold text-gray-900">Mandanten aus CSV importieren</h2>
            <p className="text-sm text-gray-600 mt-1">
              Laden Sie eine CSV-Datei mit Mandantendaten hoch
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
                <h3 className="text-sm font-medium text-blue-800">CSV-Vorlage herunterladen</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Laden Sie eine Beispiel-CSV-Datei herunter, um das richtige Format zu sehen
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={downloadTemplate}
                icon={<Download size={16} />}
                className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                Vorlage herunterladen
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CSV-Datei auswählen
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-gray-600">
                  Klicken Sie hier oder ziehen Sie eine CSV-Datei hierher
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById('csv-upload')?.click()}
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

          {/* CSV Format Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">CSV-Format</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Erforderliche Spalten:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>Firmenname</code> - Name des Unternehmens (erforderlich)</li>
                <li><code>PLZ</code> - Postleitzahl (optional, 5-stellig)</li>
                <li><code>Stadt</code> - Stadt (optional)</li>
              </ul>
              <p className="mt-2"><strong>Beispiel:</strong></p>
              <code className="block bg-white p-2 rounded border text-xs">
                Firmenname,PLZ,Stadt<br/>
                "Musterfirma GmbH",12345,"Berlin"<br/>
                "Beispiel AG",54321,"München"
              </code>
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