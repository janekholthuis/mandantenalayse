import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, FileText, CheckCircle, AlertCircle, Monitor, Database, Upload } from 'lucide-react';
import Button from '../ui/Button';

const DatevInstructions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadTemplate = () => {
    const csvContent = 'Mandantennummer,Mandantenname,Beraternummer,Branche,Ansprechpartner,Status\n"12345","Musterfirma GmbH","001","IT-Dienstleistungen","Max Mustermann","aktiv"\n"67890","Beispiel AG","001","Handel","Anna Schmidt","aktiv"';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'datev_mandanten_vorlage.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                📄 Mandantenliste aus DATEV exportieren
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Schritt-für-Schritt Anleitung für DATEV Arbeitsplatz pro
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-600 font-medium">
              {isExpanded ? 'Ausblenden' : 'Anleitung anzeigen'}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-6">
          {/* Ziel */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">✅ Ziel</h4>
            </div>
            <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
              Sie möchten die vollständige Liste Ihrer Mandanten (inkl. Mandantenname, Mandantennummer, Beraternummer etc.) 
              exportieren, um sie in Mandantenanalyse.com hochzuladen.
            </p>
          </div>

          {/* Voraussetzungen */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">🛠️ Voraussetzungen</h4>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <Monitor className="h-4 w-4 text-orange-600 mr-2" />
                  <span>Zugriff auf DATEV Arbeitsplatz pro</span>
                </li>
                <li className="flex items-center">
                  <Database className="h-4 w-4 text-orange-600 mr-2" />
                  <span>Berechtigung zur Anzeige aller Mandanten</span>
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 text-orange-600 mr-2" />
                  <span>Microsoft Excel (für Export/Weiterverarbeitung)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Schritt-für-Schritt Anleitung */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">🔄 Schritt-für-Schritt-Anleitung</h4>
            </div>

            <div className="space-y-6">
              {/* Schritt 1 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">1. Öffnen Sie DATEV Arbeitsplatz pro</h5>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Starten Sie DATEV Arbeitsplatz pro über Ihr Windows-System</li>
                  <li>• Loggen Sie sich mit Ihrem DATEV-Benutzer ein</li>
                </ul>
              </div>

              {/* Schritt 2 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">2. Mandantenübersicht öffnen</h5>
                <div className="text-blue-800 space-y-2 text-sm">
                  <p>Navigieren Sie in der Menüleiste zu:</p>
                  <div className="bg-blue-100 p-2 rounded font-mono text-xs">
                    Bearbeiten → Bestandsdienste → Mandanten → Mandantenübersicht
                  </div>
                  <p>Alternativ können Sie die Suche (🔍) oben rechts verwenden und nach „Mandantenübersicht" suchen.</p>
                </div>
              </div>

              {/* Schritt 3 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">3. Mandanten markieren</h5>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Sie sehen nun eine Liste aller in Ihrer Kanzlei angelegten Mandanten</li>
                  <li>• Drücken Sie <kbd className="bg-blue-200 px-1 rounded">Strg + A</kbd>, um alle Mandanten zu markieren</li>
                </ul>
              </div>

              {/* Schritt 4 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">4. Mandantenliste exportieren</h5>
                <div className="text-blue-800 space-y-2 text-sm">
                  <p>• Klicken Sie mit der rechten Maustaste auf eine der markierten Zeilen</p>
                  <p>• Wählen Sie:</p>
                  <div className="bg-blue-100 p-2 rounded font-mono text-xs">
                    Bearbeiten → Exportieren → Export nach Microsoft Excel
                  </div>
                  <p>• Speichern Sie die Datei lokal auf Ihrem Rechner (z. B. <code>mandantenliste_kanzlei.xlsx</code>)</p>
                </div>
              </div>

              {/* Schritt 5 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">5. Datei kontrollieren</h5>
                <div className="text-blue-800 space-y-2 text-sm">
                  <p>• Öffnen Sie die Excel-Datei</p>
                  <p>• Sie sollte folgende Spalten enthalten (je nach Konfiguration):</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Mandantennummer</li>
                    <li>Mandantenname</li>
                    <li>Beraternummer</li>
                    <li>Branche (optional)</li>
                    <li>Ansprechpartner (optional)</li>
                    <li>Status (aktiv/inaktiv)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Anleitung */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Upload className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">🔼 Mandantenliste in Mandantenanalyse.com hochladen</h4>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <ol className="text-green-800 space-y-2 text-sm list-decimal list-inside">
                <li>Öffnen Sie das Mandantenanalyse.com Dashboard</li>
                <li>Navigieren Sie zum Bereich „Mandanten hinzufügen"</li>
                <li>Wählen Sie „Datei hochladen"</li>
                <li>Klicken Sie auf „Datei auswählen" und wählen Sie Ihre Excel-Datei</li>
                <li>Die Plattform liest die Daten automatisch ein, prüft sie und zeigt eine Vorschau</li>
                <li>Bestätigen Sie den Import – fertig!</li>
              </ol>
            </div>
          </div>

          {/* Weitere Hilfe */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">📚 Weitere Hilfe & Detaillierte Erklärungen</h4>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-purple-900 mb-2">DATEV Help Center</h5>
                  <p className="text-purple-800 text-sm mb-3">
                    Für detaillierte Erklärungen und weitere Informationen zum Export von Mandantendaten 
                    aus DATEV Arbeitsplatz pro besuchen Sie das offizielle DATEV Help Center.
                  </p>
                  <a
                    href="https://apps.datev.de/help-center/documents/1029145"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    DATEV Help Center öffnen
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <p className="text-purple-700 text-xs mt-2">
                    ℹ️ Der Link öffnet sich in einem neuen Tab und führt zur offiziellen DATEV-Dokumentation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Datenschutz */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">🔐 Datenschutz & Sicherheit</h4>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Ihre Mandantendaten werden gemäß DSGVO verarbeitet</li>
                <li>• Der Upload erfolgt verschlüsselt</li>
                <li>• Ihre Daten werden nicht an Dritte weitergegeben</li>
              </ul>
            </div>
          </div>

          {/* Template Download */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">DATEV-kompatible Vorlage</h5>
                <p className="text-sm text-gray-600">
                  Laden Sie eine Beispieldatei mit den erwarteten DATEV-Spalten herunter
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={downloadTemplate}
                icon={<Download size={16} />}
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                DATEV-Vorlage herunterladen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatevInstructions;