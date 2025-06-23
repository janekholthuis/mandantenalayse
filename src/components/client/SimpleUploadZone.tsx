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

  // JSX bleibt gleich (kannst du aus deiner Datei übernehmen) …

  return (
    // 🔄 deine bestehende JSX-UI Struktur
    // mit den Buttons, Drop-Zone, etc.
    // bleibt unverändert
  );
};

export default SimpleUploadZone;