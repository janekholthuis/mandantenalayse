import React from 'react';
import NewClientForm from '../components/client/NewClientForm';

const NewClientPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Neuen Mandanten anlegen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Erfassen Sie die grundlegenden Informationen des neuen Mandanten
        </p>
      </div>
      <NewClientForm />
    </div>
  );
};

export default NewClientPage;