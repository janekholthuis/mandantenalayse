import React from 'react';
import { Upload, FileText, Info, Download } from 'lucide-react';
import Button from '../ui/Button';

interface UploadIntroCardProps {
  onStartUpload: () => void;
}

const UploadIntroCard: React.FC<UploadIntroCardProps> = ({ onStartUpload }) => {
  const downloadExampleFile = () => {
    const data = [
      ['Firmenname', 'Anzahl_Mitarbeiter', 'Unternehmensform', 'Strasse', 'PLZ', 'Ort', 'Land'],
      ['Musterfirma GmbH', '25', 'GmbH', 'Musterstraße 1', '10115', 'Berlin', 'Deutschland'],
      ['Beispiel AG', '50', 'AG', 'Beispielweg 2', '80331', 'München', 'Deutschland'],
      ['Demo KG', '15', 'KG', 'Demostraße 3', '20095', 'Hamburg', 'Deutschland']
    ];
    
    const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mandantenliste_beispiel.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Mandanten importieren
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Laden Sie Ihre Mandantenliste aus DATEV hoch, um individuelle Analysen durchzuführen. 
          Der Import unterstützt CSV- und Excel-Dateien mit automatischer Felderkennung.
        </p>
      </div>

      {/* Required Fields Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-900 mb-2">
              📋 Erforderliche Felder
            </h3>
            <p className="text-sm text-green-800 mb-3">
              Ihre Datei sollte mindestens diese Spalten enthalten:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
              <div>• <strong>Firmenname</strong> (erforderlich)</div>
              <div>• <strong>Anzahl Mitarbeiter</strong> (erforderlich)</div>
              <div>• <strong>Straße & Hausnummer</strong> (erforderlich)</div>
              <div>• <strong>PLZ</strong> (erforderlich)</div>
              <div>• <strong>Ort</strong> (erforderlich)</div>
              <div>• <strong>Unternehmensform</strong> (optional)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Elements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              💡 Hilfe zum DATEV-Export
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Die Datei exportieren Sie über DATEV Arbeitsplatz pro. Eine detaillierte 
              Schritt-für-Schritt-Anleitung von DATEV finden Sie unter diesem Link:
            </p>
            <a
              href="https://apps.datev.de/help-center/documents/1029145"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-700 hover:text-blue-800 font-medium underline"
            >
              📖 Anleitung ansehen
            </a>
          </div>
        </div>
      </div>

      {/* Example File Download */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Beispiel-Datei</h4>
              <p className="text-sm text-gray-600">
                Laden Sie eine Beispiel-CSV-Datei herunter, um das erwartete Format zu sehen
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={downloadExampleFile}
            icon={<Download size={16} />}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Beispiel herunterladen
          </Button>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium text-sm">Erlaubte Dateiformate:</div>
          <div className="text-green-700 text-xs mt-1">✅ CSV (.csv), Excel (.xlsx, .xls)</div>
        </div>
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-blue-600 font-medium text-sm">Automatische Erkennung:</div>
          <div className="text-blue-700 text-xs mt-1">🤖 Spalten werden automatisch zugeordnet</div>
        </div>
        <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-purple-600 font-medium text-sm">DATEV-kompatibel:</div>
          <div className="text-purple-700 text-xs mt-1">📊 Direkte DATEV-Exporte unterstützt</div>
        </div>
      </div>

      {/* Start Upload Button */}
      <div className="text-center">
        <Button
          variant="primary"
          onClick={onStartUpload}
          icon={<Upload size={20} />}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-medium"
        >
          Datei-Upload starten
        </Button>
      </div>

      {/* Privacy Notice */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>🔐 Ihre Daten werden verschlüsselt übertragen und gemäß DSGVO verarbeitet.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadIntroCard;