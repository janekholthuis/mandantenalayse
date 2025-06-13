import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ClientImportForm from '../components/client/ClientImportForm';
import DatevInstructions from '../components/client/DatevInstructions';

const ClientUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [showImportForm, setShowImportForm] = useState(true);

  const handleImportComplete = () => {
    navigate('/clients');
  };

  const handleClose = () => {
    navigate('/clients/add');
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/clients/add" className="text-blue-600 hover:text-blue-500 flex items-center mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zur Auswahl
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Mandanten hochladen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Laden Sie eine CSV- oder Excel-Datei mit Mandantendaten hoch
        </p>
      </div>

      {/* DATEV Instructions */}
      <div className="mb-8">
        <DatevInstructions />
      </div>

      {showImportForm && (
        <ClientImportForm
          onImportComplete={handleImportComplete}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ClientUploadPage;