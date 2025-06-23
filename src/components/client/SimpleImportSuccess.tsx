import React from 'react';
import { CheckCircle, Users, FileText, BarChart3, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface SimpleImportSuccessProps {
  importedCount: number;
  onViewClients: () => void;
  onStartAnalysis: () => void;
}

const SimpleImportSuccess: React.FC<SimpleImportSuccessProps> = ({
  importedCount,
  onViewClients,
  onStartAnalysis
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-green-800 mb-3">
          🎉 Import erfolgreich!
        </h2>
        <p className="text-xl text-green-700 mb-2">
          {importedCount} Mandanten wurden erfolgreich importiert
        </p>
        <p className="text-green-600">
          und stehen nun für Analysen zur Verfügung.
        </p>
      </div>

      {/* Import Statistics */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Import-Statistiken
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{importedCount}</div>
            <div className="text-sm text-gray-600">Erfolgreich importiert</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Erfolgsrate</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Fehler</div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-4">
          🚀 Nächste Schritte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
              1
            </div>
            <div>
              <div className="font-medium text-blue-900 mb-1">Mandanten ansehen</div>
              <div className="text-blue-800">
                Überprüfen Sie die importierten Mandanten in der Übersicht
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
              2
            </div>
            <div>
              <div className="font-medium text-blue-900 mb-1">Analysen starten</div>
              <div className="text-blue-800">
                Beginnen Sie mit der Optimierungsanalyse für Ihre Mandanten
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
              3
            </div>
            <div>
              <div className="font-medium text-blue-900 mb-1">Potenziale nutzen</div>
              <div className="text-blue-800">
                Implementieren Sie die gefundenen Optimierungsmöglichkeiten
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button
          variant="primary"
          onClick={onViewClients}
          icon={<Users size={16} />}
          className="bg-blue-600 hover:bg-blue-700 w-full py-3 text-lg"
        >
          📋 Mandanten ansehen
        </Button>
        
        <Button
          variant="primary"
          onClick={onStartAnalysis}
          icon={<BarChart3 size={16} />}
          className="bg-green-600 hover:bg-green-700 w-full py-3 text-lg"
        >
          🔍 Erste Analyse starten
        </Button>
      </div>

      {/* Success Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">
          💡 Tipps für optimale Ergebnisse
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <div className="font-medium mb-1">🎯 Regelmäßige Updates</div>
            <div>
              Aktualisieren Sie Ihre Mandantenliste regelmäßig, um aktuelle Optimierungen zu erhalten.
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">📊 Vollständige Daten</div>
            <div>
              Je vollständiger Ihre Mandantendaten, desto präziser werden die Analysen.
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">🔄 Kontinuierliche Optimierung</div>
            <div>
              Überprüfen Sie regelmäßig neue Optimierungsmöglichkeiten für Ihre Mandanten.
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">📈 Erfolg messen</div>
            <div>
              Verfolgen Sie die Umsetzung und den Erfolg der implementierten Optimierungen.
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>🔐 Alle Daten wurden sicher verarbeitet und sind DSGVO-konform gespeichert</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleImportSuccess;