import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface DocumentUploadPopupProps {
  onUploadComplete: (filename: string, type: string) => void;
  onClose: () => void;
}

const DocumentUploadPopup: React.FC<DocumentUploadPopupProps> = ({ onUploadComplete, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const uploadTypes = [
    { value: 'send-offers', label: 'Angebote senden', description: 'Angebote an Mandant weiterleiten' },
    { value: 'waiting-for-client', label: 'Warten auf Mandant', description: 'Auf Rückmeldung des Mandanten warten' },
    { value: 'vertrag', label: 'Neuer Vertrag', description: 'Optimierung wurde umgesetzt' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUploadComplete(selectedFile.name, uploadType);
    setIsUploading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Dokument hochladen</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aktion auswählen
          </label>
          <div className="space-y-2">
            {uploadTypes.map((type) => (
              <label key={type.value} className="flex items-start">
                <input
                  type="radio"
                  name="uploadType"
                  value={type.value}
                  checked={uploadType === type.value}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datei auswählen
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {selectedFile ? (
                <div className="flex items-center justify-center">
                  <FileText className="h-8 w-8 text-green-600 mr-2" />
                  <span className="text-sm text-gray-900">{selectedFile.name}</span>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Klicken Sie hier, um eine Datei auszuwählen</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isUploading}
        >
          Abbrechen
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={!selectedFile || !uploadType || isUploading}
          isLoading={isUploading}
        >
          {isUploading ? 'Lade hoch...' : 'Hochladen'}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadPopup;