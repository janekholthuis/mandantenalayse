import React, { useState } from 'react';
import { Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Button from '../ui/Button';

interface ParsedData {
  [key: string]: any;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface DataPreviewMappingProps {
  data: ParsedData[];
  onBack: () => void;
  onProceed: (mappedData: ParsedData[], mapping: Record<string, string>) => void;
}

const DataPreviewMapping: React.FC<DataPreviewMappingProps> = ({ data, onBack, onProceed }) => {
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Available target fields - simplified to match NewClientForm
  const targetFields = {
    'Firmenname': { required: true, description: 'Name oder Firmenname' },
    'Anzahl_Mitarbeiter': { required: true, description: 'Anzahl der Mitarbeiter' },
    'Unternehmensform': { required: false, description: 'Rechtsform des Unternehmens' },
    'Strasse': { required: true, description: 'Straße und Hausnummer' },
    'PLZ': { required: true, description: 'Postleitzahl' },
    'Ort': { required: true, description: 'Stadt/Ort' },
    'Land': { required: false, description: 'Land (Standard: Deutschland)' }
  };

  // Get source fields from data
  const sourceFields = data.length > 0 ? Object.keys(data[0]) : [];

  // Auto-detect field mapping
  React.useEffect(() => {
    const autoMapping: Record<string, string> = {};
    
    sourceFields.forEach(sourceField => {
      const lowerSource = sourceField.toLowerCase();
      
      // Smart mapping based on field names
      if (lowerSource.includes('firmenname') || lowerSource.includes('mandantenname') || lowerSource.includes('name') || lowerSource.includes('firma')) {
        autoMapping['Firmenname'] = sourceField;
      } else if (lowerSource.includes('mitarbeiter') || lowerSource.includes('employee') || lowerSource.includes('anzahl')) {
        autoMapping['Anzahl_Mitarbeiter'] = sourceField;
      } else if (lowerSource.includes('rechtsform') || lowerSource.includes('legal') || lowerSource.includes('form')) {
        autoMapping['Unternehmensform'] = sourceField;
      } else if (lowerSource.includes('strasse') || lowerSource.includes('street') || lowerSource.includes('adresse')) {
        autoMapping['Strasse'] = sourceField;
      } else if (lowerSource.includes('plz') || lowerSource.includes('postleitzahl') || lowerSource.includes('postal')) {
        autoMapping['PLZ'] = sourceField;
      } else if (lowerSource.includes('ort') || lowerSource.includes('stadt') || lowerSource.includes('city')) {
        autoMapping['Ort'] = sourceField;
      } else if (lowerSource.includes('land') || lowerSource.includes('country')) {
        autoMapping['Land'] = sourceField;
      }
    });

    setFieldMapping(autoMapping);
  }, [sourceFields]);

  // Validate data
  React.useEffect(() => {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      // Check required fields
      Object.entries(targetFields).forEach(([targetField, config]) => {
        if (config.required && fieldMapping[targetField]) {
          const sourceField = fieldMapping[targetField];
          const value = row[sourceField];
          
          if (!value || value.toString().trim() === '') {
            errors.push({
              row: index + 2, // +2 because index starts at 0 and we skip header
              field: targetField,
              message: `${targetField} ist erforderlich`
            });
          }
        }
      });

      // Validate PLZ format
      if (fieldMapping['PLZ']) {
        const plz = row[fieldMapping['PLZ']];
        if (plz && !/^\d{4,5}$/.test(plz.toString())) {
          errors.push({
            row: index + 2,
            field: 'PLZ',
            message: 'PLZ muss 4-5 stellig sein'
          });
        }
      }

      // Validate Anzahl_Mitarbeiter
      if (fieldMapping['Anzahl_Mitarbeiter']) {
        const count = row[fieldMapping['Anzahl_Mitarbeiter']];
        if (count && (isNaN(count) || parseInt(count) < 0)) {
          errors.push({
            row: index + 2,
            field: 'Anzahl_Mitarbeiter',
            message: 'Mitarbeiteranzahl muss eine positive Zahl sein'
          });
        }
      }
    });

    setValidationErrors(errors);
  }, [data, fieldMapping]);

  const handleMappingChange = (targetField: string, sourceField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [targetField]: sourceField === '' ? undefined : sourceField
    }));
  };

  const handleProceed = () => {
    // Create mapped data
    const mappedData = data.map(row => {
      const mapped: ParsedData = {};
      Object.entries(fieldMapping).forEach(([targetField, sourceField]) => {
        if (sourceField) {
          mapped[targetField] = row[sourceField];
        }
      });
      return mapped;
    });

    onProceed(mappedData, fieldMapping);
  };

  const requiredFieldsMapped = Object.entries(targetFields)
    .filter(([_, config]) => config.required)
    .every(([field, _]) => fieldMapping[field]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          👁️ Vorschau & Feldzuordnung
        </h2>
        <p className="text-gray-600">
          Überprüfen Sie die automatische Felderkennung und passen Sie bei Bedarf die Zuordnung an.
        </p>
      </div>

      {/* Smart Mapping Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              🤖 Automatische Felderkennung
            </h4>
            <p className="text-sm text-blue-800">
              Wir haben {Object.keys(fieldMapping).length} Felder automatisch erkannt. 
              Falls eine Zuordnung nicht korrekt ist, können Sie sie unten anpassen.
            </p>
          </div>
        </div>
      </div>

      {/* Field Mapping */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Feldzuordnung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(targetFields).map(([targetField, config]) => (
            <div key={targetField} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-900">
                  {targetField.replace('_', ' ')}
                  {config.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {fieldMapping[targetField] && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">{config.description}</p>
              <select
                value={fieldMapping[targetField] || ''}
                onChange={(e) => handleMappingChange(targetField, e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Spalte wählen --</option>
                {sourceFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="text-sm font-medium text-red-800">
              ⚠️ Validierungsfehler ({validationErrors.length})
            </h4>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {validationErrors.slice(0, 10).map((error, index) => (
              <div key={index} className="text-sm text-red-700 mb-1">
                Zeile {error.row}: {error.message}
              </div>
            ))}
            {validationErrors.length > 10 && (
              <div className="text-sm text-red-600 font-medium">
                ... und {validationErrors.length - 10} weitere Fehler
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          Datenvorschau ({data.length} Datensätze)
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {Object.keys(targetFields).map(field => (
                    <th key={field} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {field.replace('_', ' ')}
                      {targetFields[field].required && <span className="text-red-500 ml-1">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.keys(targetFields).map(field => (
                      <td key={field} className="px-4 py-2 text-sm text-gray-900">
                        {fieldMapping[field] ? row[fieldMapping[field]] || '-' : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length > 5 && (
            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center">
              ... und {data.length - 5} weitere Datensätze
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={onBack}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          ← Zurück
        </Button>
        <Button
          variant="primary"
          onClick={handleProceed}
          disabled={!requiredFieldsMapped || validationErrors.length > 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Weiter zur Validierung →
        </Button>
      </div>
    </div>
  );
};

export default DataPreviewMapping;