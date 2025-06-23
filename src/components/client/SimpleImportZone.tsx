import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Users, FileText, Shield, Loader } from 'lucide-react';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { showError, showSuccess } from '../../lib/toast';

interface ParsedData {
  [key: string]: any;
}

interface SimpleImportZoneProps {
  data: ParsedData[];
  onBack: () => void;
  onComplete: (importedCount: number) => void;
}

const SimpleImportZone: React.FC<SimpleImportZoneProps> = ({ data, onBack, onComplete }) => {
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const validRecords = data.filter(row => 
    row.Firmenname && row.Anzahl_Mitarbeiter && row.Strasse && row.PLZ && row.Ort
  );

  const handleImport = async () => {
    if (!user || !gdprConsent) {
      showError('DSGVO-Einverständnis ist erforderlich');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      // Prepare data for insertion
      const dataToInsert = validRecords.map(row => ({
        name: row.Firmenname,
        employee_count: parseInt(row.Anzahl_Mitarbeiter?.toString()) || 0,
        strasse: row.Strasse,
        plz: parseInt(row.PLZ?.toString()) || null,
        ort: row.Ort,
        land: row.Land || 'Deutschland',
        legal_form: row.Unternehmensform ? parseInt(row.Unternehmensform.toString()) || null : null,
        user_id: user.id
      }));

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data: insertedData, error } = await supabase
        .from('clients')
        .insert(dataToInsert)
        .select();

      clearInterval(progressInterval);
      setImportProgress(100);

      if (error) {
        throw error;
      }

      const importedCount = insertedData?.length || 0;
      showSuccess(`🎉 ${importedCount} Mandanten erfolgreich importiert!`);
      
      // Small delay to show 100% progress
      setTimeout(() => {
        onComplete(importedCount);
      }, 500);

    } catch (error: any) {
      console.error('Import error:', error);
      setImportProgress(0);
      
      if (error.message.includes('duplicate key')) {
        showError('⚠️ Einige Mandanten existieren bereits. Bitte überprüfen Sie Ihre Daten.');
      } else {
        showError(`❌ Fehler beim Importieren: ${error.message}`);
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Schritt 3: Import bestätigen
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-gray-600">Datensätze erkannt</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{validRecords.length}</div>
            <div className="text-sm text-gray-600">Werden importiert</div>
          </div>
          
          {data.length !== validRecords.length && (
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{data.length - validRecords.length}</div>
              <div className="text-sm text-gray-600">Fehlerhafte übersprungen</div>
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
              {validRecords.slice(0, 3).map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-900">{row.Firmenname || '-'}</td>
                  <td className="py-2 px-3 text-gray-900">{row.Anzahl_Mitarbeiter || '-'}</td>
                  <td className="py-2 px-3 text-gray-900">{row.PLZ || '-'}</td>
                  <td className="py-2 px-3 text-gray-900">{row.Ort || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {validRecords.length > 3 && (
            <div className="text-center py-2 text-gray-500 text-xs">
              ... und {validRecords.length - 3} weitere Datensätze
            </div>
          )}
        </div>
      </div>

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

      {/* Import Progress */}
      {isImporting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-3">
            <Loader className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
            <h4 className="text-lg font-medium text-blue-900">
              Import läuft... ({importProgress}%)
            </h4>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Mandanten werden in die Datenbank importiert...
          </p>
        </div>
      )}

      {/* Success Preview */}
      {validRecords.length > 0 && !isImporting && (
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
                {validRecords.length} neue Mandanten in der Übersicht
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
          onClick={handleImport}
          disabled={!gdprConsent || isImporting || validRecords.length === 0}
          isLoading={isImporting}
          className="bg-green-600 hover:bg-green-700 px-8"
        >
          {isImporting ? 'Importiere...' : `✅ ${validRecords.length} Mandanten importieren`}
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

export default SimpleImportZone;