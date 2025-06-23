import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Users, FileText, Shield } from 'lucide-react';
import Button from '../ui/Button';

interface ParsedData {
  [key: string]: any;
}

interface ValidationConfirmationProps {
  data: ParsedData[];
  duplicates: number;
  errors: number;
  onBack: () => void;
  onConfirm: (skipErrors: boolean, gdprConsent: boolean) => void;
  isImporting: boolean;
}

const ValidationConfirmation: React.FC<ValidationConfirmationProps> = ({
  data,
  duplicates,
  errors,
  onBack,
  onConfirm,
  isImporting
}) => {
  const [skipErrors, setSkipErrors] = useState(true);
  const [gdprConsent, setGdprConsent] = useState(false);

  const validRecords = data.length - duplicates - (skipErrors ? errors : 0);

  const handleConfirm = () => {
    onConfirm(skipErrors, gdprConsent);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ✅ Bestätigung & Import
        </h2>
        <p className="text-gray-600">
          Überprüfen Sie die Importzusammenfassung und bestätigen Sie den Datenimport.
        </p>
      </div>

      {/* Import Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Importzusammenfassung
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-gray-600">Mandanten erkannt</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{validRecords}</div>
            <div className="text-sm text-gray-600">Werden importiert</div>
          </div>
          
          {duplicates > 0 && (
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{duplicates}</div>
              <div className="text-sm text-gray-600">Duplikate entfernt</div>
            </div>
          )}
          
          {errors > 0 && (
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{errors}</div>
              <div className="text-sm text-gray-600">
                {skipErrors ? 'Fehler übersprungen' : 'Fehler gefunden'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Beispiel der zu importierenden Daten:</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Firmenname</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Mitarbeiter</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">PLZ</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Ort</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 3).map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-900">{row.Firmenname || '-'}</td>
                  <td className="py-2 px-3 text-gray-900">{row.Anzahl_Mitarbeiter || '-'}</td>
                  <td className="py-2 px-3 text-gray-900">{row.PLZ || '-'}</td>
                  <td className="py-2 px-3 text-gray-900">{row.Ort || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 3 && (
            <div className="text-center py-2 text-gray-500 text-xs">
              ... und {data.length - 3} weitere Datensätze
            </div>
          )}
        </div>
      </div>

      {/* Error Handling Options */}
      {errors > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="text-lg font-medium text-yellow-900">
              🧼 Fehlerbehandlung
            </h4>
          </div>
          
          <div className="space-y-3">
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
                  Problematische Zeilen überspringen (Empfohlen)
                </div>
                <div className="text-sm text-yellow-700">
                  {validRecords} gültige Mandanten werden importiert, {errors} fehlerhafte Zeilen werden ignoriert.
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
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-gray-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">
            🔐 Datenschutz-Bestätigung
          </h4>
        </div>
        
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-1 mr-3"
            required
          />
          <div className="text-sm text-gray-700">
            <div className="font-medium mb-1">DSGVO-Einverständnis erforderlich</div>
            <div>
              Ich bestätige, dass ich zur Verarbeitung dieser Mandantendaten im Rahmen der 
              Mandantenoptimierung berechtigt bin und alle datenschutzrechtlichen Bestimmungen 
              einhalte. Die Daten werden gemäß unserer{' '}
              <button className="text-blue-600 hover:text-blue-700 underline">
                Datenschutzerklärung
              </button>{' '}
              verarbeitet.
            </div>
          </div>
        </label>
      </div>

      {/* Success Preview */}
      {validRecords > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="text-lg font-medium text-green-900">
              Nach dem Import verfügbar
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800">
                {validRecords} neue Mandanten in der Übersicht
              </span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800">
                Sofort bereit für Analysen
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800">
                Automatische Optimierungsprüfung
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={isImporting}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          ← Zurück
        </Button>
        
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!gdprConsent || isImporting || (!skipErrors && errors > 0)}
          isLoading={isImporting}
          className="bg-green-600 hover:bg-green-700 px-8"
        >
          {isImporting ? 'Importiere...' : `✅ ${validRecords} Mandanten importieren`}
        </Button>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>🔐 Verschlüsselte Verarbeitung • DSGVO-konform • Keine Weitergabe an Dritte</span>
        </div>
      </div>
    </div>
  );
};

export default ValidationConfirmation;