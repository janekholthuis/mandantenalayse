import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, Download, Info } from 'lucide-react';
import Button from '../ui/Button';
import { showError, showSuccess } from '../../lib/toast';

interface SimpleUploadZoneProps {
  onFileSelect: (file: File) => void;
  onBack: () => void;
  isProcessing: boolean;
}

const SimpleUploadZone: React.FC<SimpleUploadZoneProps> = ({ onFileSelect, onBack, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = ['.csv', '.xlsx', '.xls'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return 'Die Datei ist zu groß. Maximale Dateigröße: 10MB';
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return 'Ungültiges Dateiformat. Bitte laden Sie eine CSV- oder Excel-Datei hoch.';
    }

    return null;
  };

  const handleFileSelection = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      showError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    showSuccess('Datei erfolgreich ausgewählt');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleProceed = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadExampleFile = () => {
    window.open('https://eoxctywixmaelcnjuhmr.supabase.co/storage/v1/object/sign/landingpage/Beispiel%20Datei.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NTIwNTUwYS05OGE1LTQwYjItYTAwNS0wNTk0ZGIzNTY1MmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsYW5kaW5ncGFnZS9CZWlzcGllbCBEYXRlaS5jc3YiLCJpYXQiOjE3NTA2ODE0MDIsImV4cCI6ODgxNTA2ODE0MDJ9.__jpP5YAaXHrRN2TK4hHj8KpGdmSenUjArbE_K0fAtM', '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Schritt 1: Datei hochladen
        </h2>
        <p className="text-gray-600">
          Wählen Sie eine CSV- oder Excel-Datei mit Ihren Mandantendaten aus.
        </p>
      </div>

      {/* DATEV Help Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">💡 Hilfe zum DATEV-Export</h3>
              <p className="text-sm text-blue-700">Schritt-für-Schritt Anleitung für den Export aus DATEV</p>
            </div>
          </div>
          <a
            href="https://apps.datev.de/help-center/documents/1029145"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
          >
            Anleitung öffnen
          </a>
        </div>
      </div>

      {/* Example File Download */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Download className="h-5 w-5 text-gray-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Beispiel Datei</h3>
              <p className="text-sm text-gray-600">Laden Sie eine Beispieldatei herunter</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={downloadExampleFile}
            icon={<Download size={16} />}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Beispiel Datei
          </Button>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : selectedFile
            ? 'border-green-400 bg-green-50'
            : error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          id="file-upload"
        />

        {!selectedFile ? (
          <>
            <div className="mb-4">
              <Upload className={`h-12 w-12 mx-auto ${
                isDragOver ? 'text-blue-600' : error ? 'text-red-500' : 'text-gray-400'
              }`} />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${
              error ? 'text-red-700' : 'text-gray-900'
            }`}>
              {isDragOver ? 'Datei hier ablegen' : 'Datei hierher ziehen oder auswählen'}
            </h3>
            <p className={`text-sm mb-4 ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}>
              Unterstützte Formate: CSV, XLSX, XLS (max. 10MB)
            </p>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
            >
              Datei auswählen
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <FileText className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-green-800">{selectedFile.name}</div>
              <div className="text-sm text-green-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button
              onClick={removeFile}
              className="ml-4 text-gray-400 hover:text-gray-600"
              disabled={isProcessing}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm text-red-700 font-medium">❌ {error}</span>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
            <span className="text-sm text-blue-700 font-medium">Datei wird verarbeitet...</span>
          </div>
        </div>
      )}

      {/* Required Fields Info */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">📋 Erforderliche Spalten</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-yellow-800">
          <div>• <strong>Firmenname</strong> (erforderlich)</div>
          <div>• <strong>Anzahl Mitarbeiter</strong> (erforderlich)</div>
          <div>• <strong>Straße & Hausnummer</strong> (erforderlich)</div>
          <div>• <strong>PLZ</strong> (erforderlich)</div>
          <div>• <strong>Ort</strong> (erforderlich)</div>
          <div>• <strong>Unternehmensform</strong> (optional)</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={isProcessing}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          ← Zurück
        </Button>
        <Button
          variant="primary"
          onClick={handleProceed}
          disabled={!selectedFile || isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Weiter zur Zuordnung →
        </Button>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>🔐 Verschlüsselte Übertragung • DSGVO-konform</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleUploadZone;