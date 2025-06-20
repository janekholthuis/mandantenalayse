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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
  {/* Upload Option */}
  <Link to="/clients/upload" className="group h-full">
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors mb-6">
          <Upload className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Datei hochladen <span className="text-green-600">(empfohlen)</span></h3>
        <p className="text-gray-600 mb-6">
          Laden Sie eine CSV- oder Excel-Datei mit mehreren Mandanten hoch. Der einfachste und schnellste Weg.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center">
            <Database className="h-4 w-4 mr-2" />
            <span>DATEV-Export unterstützt</span>
          </div>
          <div className="flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Mehrere Mandanten gleichzeitig</span>
          </div>
        </div>
      </div>
      <Button
        variant="primary"
        className="mt-6 w-full bg-green-600 hover:bg-green-700 group-hover:bg-green-700"
        icon={<Upload size={16} />}
      >
        Upload starten
      </Button>
    </div>
  </Link>

  {/* Manual Entry Option */}
  <Link to="/clients/new" className="group h-full">
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-6">
          <Edit className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Manuell eintragen</h3>
        <p className="text-gray-600 mb-6">
          Fügen Sie einzelne Mandanten über ein Formular hinzu.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Einzelne Mandanten</span>
          </div>
        </div>
      </div>
      <Button
        variant="primary"
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700"
        icon={<Edit size={16} />}
      >
        Formular öffnen
      </Button>
    </div>
  </Link>
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
