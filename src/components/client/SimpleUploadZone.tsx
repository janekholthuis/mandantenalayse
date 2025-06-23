import React, { useState, useRef, useEffect } from 'react';
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
    if (selectedFile && selectedFile.name === file.name && selectedFile.size === file.size) {
      return; // keine Änderung
    }

    const validationError = validateFile(file);
    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
    } else {
      setError(null);
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      showSuccess('✅ Datei erfolgreich ausgewählt');
    }
  }, [selectedFile]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

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
    window.open('https://drive.google.com/uc?export=download&id=1VEU796USG9vQ9fJJ7fQZXB_p6Q7XX3Yq', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Datei hochladen</h2>
          <p className="text-gray-600 mt-1">Laden Sie Ihre DATEV-Datei hoch, um mit der Analyse zu beginnen</p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          Zurück
        </Button>
      </div>

      {/* Example File Download */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-1">Beispieldatei herunterladen</h3>
            <p className="text-blue-700 text-sm mb-3">
              Laden Sie unsere Beispieldatei herunter, um das richtige Format zu sehen.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadExampleFile}
              className="flex items-center gap-2 text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <Download className="w-4 h-4" />
              Beispieldatei herunterladen
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="space-y-4">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : selectedFile 
                ? 'border-green-400 bg-green-50' 
                : error 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
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
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-green-900 mb-1">Datei ausgewählt</h3>
                <p className="text-green-700 font-medium">{selectedFile.name}</p>
                <p className="text-green-600 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeFile}
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
                Datei entfernen
              </Button>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-red-900 mb-1">Fehler beim Hochladen</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <p className="text-gray-600 text-sm">
                Klicken Sie hier oder ziehen Sie eine neue Datei hierher
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Upload className={`w-8 h-8 transition-colors ${
                    isDragOver ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {isDragOver ? 'Datei hier ablegen' : 'Datei hochladen'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Klicken Sie hier oder ziehen Sie eine Datei hierher
                </p>
              </div>
            </div>
          )}
        </div>

        {/* File Format Info */}
        <div className="text-center text-sm text-gray-500">
          Unterstützte Formate: {acceptedFormats.join(', ')} • Maximale Dateigröße: 10MB
        </div>
      </div>

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={removeFile}
            disabled={isProcessing}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleProceed}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verarbeitung...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Datei verarbeiten
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleUploadZone;