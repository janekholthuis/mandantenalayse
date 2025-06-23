import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Upload, Edit, FileText, Users, Database } from 'lucide-react'
import Button from '../components/ui/Button'

const ClientAddPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link to="/clients" className="text-blue-600 hover:text-blue-500 flex items-center mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zu Mandanten
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Mandanten hinzufügen</h1>
        <p className="mt-1 text-gray-600 text-sm max-w-2xl">
          Der einfachste Weg: Laden Sie eine Datei mit allen Mandanten hoch. Alternativ können Sie Mandanten auch manuell einzeln eintragen.
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
        {/* Upload Option */}
        <Link to="/clients/upload" className="group">
          <div className="flex flex-col justify-between h-full bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-green-400 transition-all duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 group-hover:bg-green-200 mb-5">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Datei hochladen <span className="text-green-600">(empfohlen)</span></h3>
              <p className="text-gray-600 text-sm">
                Laden Sie eine CSV- oder Excel-Datei mit mehreren Mandanten hoch. Der einfachste und schnellste Weg.
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-500">
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
              className="mt-6 w-full bg-green-600 hover:bg-green-700"
              icon={<Upload size={16} />}
            >
              Upload starten
            </Button>
          </div>
        </Link>

        {/* Manual Entry Option */}
        <Link to="/clients/new" className="group">
          <div className="flex flex-col justify-between h-full bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 group-hover:bg-blue-200 mb-5">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manuell eintragen</h3>
              <p className="text-gray-600 text-sm">
                Fügen Sie einzelne Mandanten über ein Formular hinzu.
              </p>
              <div className="mt-4 text-sm text-gray-500 flex justify-center items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Einzelne Mandanten</span>
              </div>
            </div>
            <Button
              variant="primary"
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
              icon={<Edit size={16} />}
            >
              Formular öffnen
            </Button>
          </div>
        </Link>
      </div>

      {/* DATEV Hinweis */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start">
            <Database className="h-6 w-6 text-blue-600 mt-1 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900">Mandantenexport aus DATEV</h4>
              <p className="text-sm text-blue-700 mt-1">
                Exportieren Sie Ihre Mandantenliste ganz einfach aus DATEV Arbeitsplatz pro:
              </p>
              <ol className="list-decimal list-inside text-blue-700 text-sm mt-2 space-y-1">
                <li>Öffnen Sie den <strong>DATEV Arbeitsplatz pro</strong>.</li>
                <li>Gehen Sie zur <strong>Mandantenübersicht</strong>.</li>
                <li>Klicken Sie oben auf <strong>„Exportieren“ → „Excel-Datei“</strong>.</li>
                <li>Speichern Sie die Datei lokal auf Ihrem Rechner.</li>
                <li>Laden Sie die Datei anschließend hier in unsere Anwendung hoch.</li>
              </ol>
              <p className="mt-3 text-sm">
                📖 <a href="https://apps.datev.de/help-center/documents/1029145" target="_blank" rel="noopener noreferrer" className="underline text-blue-800 hover:text-blue-900 font-medium">Zur offiziellen DATEV-Anleitung</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientAddPage
