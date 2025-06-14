import React from 'react';
import { Upload, FileText, Info, Download } from 'lucide-react';
import Button from '../ui/Button';

interface UploadIntroCardProps {
  onStartUpload: () => void;
}

const UploadIntroCard: React.FC<UploadIntroCardProps> = ({ onStartUpload }) => {
  const downloadExampleFile = () => {
    const data = [
      ['Mandantennummer', 'Mandantenname', 'Beraternummer', 'Status', 'Ort', 'PLZ', 'Mitarbeiter_Anzahl'],
      ['12345', 'Musterfirma GmbH', '001', 'aktiv', 'Berlin', '10115', '25'],
      ['67890', 'Beispiel AG', '001', 'aktiv', 'München', '80331', '50'],
      ['11111', 'Demo KG', '002', 'inaktiv', 'Hamburg', '20095', '15']
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
              Schritt-für-Schritt-Anleitung finden Sie in unserem Hilfebereich.
            </p>
            <button className="text-sm text-blue-700 hover:text-blue-800 font-medium underline">
              📖 Anleitung ansehen
            </button>
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
                Laden Sie eine Beispiel-Excel-Datei herunter, um das erwartete Format zu sehen
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
          <div className="text-green-600 font-medium text-sm">✅ CSV-Dateien</div>
          <div className="text-green-700 text-xs mt-1">.csv</div>
        </div>
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium text-sm">✅ Excel-Dateien</div>
          <div className="text-green-700 text-xs mt-1">.xlsx, .xls</div>
        </div>
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium text-sm">✅ DATEV-Export</div>
          <div className="text-green-700 text-xs mt-1">Automatisch erkannt</div>
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
            <button className="ml-2 text-blue-600 hover:text-blue-700 underline">
              Mehr erfahren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadIntroCard;