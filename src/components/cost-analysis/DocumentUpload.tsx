import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface DocumentUploadProps {
  onUploadComplete: (filename: string, type: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const filename = 'stromvertrag_2025.pdf';
      setUploadedFile(filename);
      setIsUploading(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (uploadedFile && documentType) {
      onUploadComplete(uploadedFile, documentType);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Upload className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Dokument hochladen</h3>
      </div>

      <div className="space-y-4">
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Laden Sie Ihren Stromvertrag für die Analyse hoch
            </p>
            <Button
              variant="primary"
              onClick={handleFileUpload}
              isLoading={isUploading}
            >
              Stromvertrag hochladen
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Datei hochgeladen</p>
                <p className="text-sm text-green-600">{uploadedFile}</p>
              </div>
            </div>
          </div>
        )}

        {uploadedFile && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dokumenttyp
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Bitte wählen</option>
              <option value="vertrag">Vertrag</option>
              <option value="rechnung">Rechnung</option>
              <option value="angebot">Angebot</option>
            </select>
          </div>
        )}

        {uploadedFile && documentType && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="w-full"
          >
            Analyse starten
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;