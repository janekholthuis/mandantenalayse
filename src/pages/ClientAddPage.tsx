import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Edit, FileText, Users, Database } from 'lucide-react';
import Button from '../components/ui/Button';

const ClientAddPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <Link to="/clients" className="text-blue-600 hover:text-blue-500 flex items-center mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zu Mandanten
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Mandanten hinzufügen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Der einfachste Weg: Laden Sie eine Datei mit allen Mandanten hoch. Alternativ können Sie Mandanten auch manuell einzeln eintragen.
        </p>
      </div>

    

      {/* DATEV Hinweis */}
      <div className="mt-8 max-w-4xl">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h4 className="text-lg font-medium text-blue-900">Mandantenexport aus DATEV</h4>
              <p className="text-blue-700 text-sm mt-1">
                Exportieren Sie Ihre Mandantenliste ganz einfach aus DATEV Arbeitsplatz pro:
              </p>
              <ol className="list-decimal list-inside text-blue-700 text-sm mt-2 space-y-1">
                <li>Öffnen Sie den <strong>DATEV Arbeitsplatz pro</strong>.</li>
                <li>Gehen Sie zur <strong>Mandantenübersicht</strong>.</li>
                <li>Klicken Sie oben auf <strong>„Exportieren“ → „Excel-Datei“</strong>.</li>
                <li>Speichern Sie die Datei lokal auf Ihrem Rechner.</li>
                <li>Laden Sie die Datei anschließend hier in unsere Anwendung hoch.</li>
              </ol>
              <p className="text-blue-700 text-sm mt-2">
                📖 <a href="https://apps.datev.de/help-center/documents/1029145" target="_blank" rel="noopener noreferrer" className="underline font-medium text-blue-800 hover:text-blue-900">Zur offiziellen DATEV-Anleitung</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAddPage;
