import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NewClientForm from '../components/client/NewClientForm';

const NewClientPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <Link to="/clients/add" className="text-blue-600 hover:text-blue-500 flex items-center mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zur Auswahl
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mandanten manuell anlegen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Erfassen Sie die grundlegenden Informationen des neuen Mandanten
        </p>
      </div>
      <NewClientForm />
    </div>
  );
};

export default NewClientPage;