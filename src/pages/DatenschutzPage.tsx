import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DatenschutzPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/login" className="text-blue-600 hover:text-blue-500 flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Zurück zur Anmeldung
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

          <div className="prose prose-blue max-w-none">
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist die Mandantenanalyse.com GmbH.
              Kontaktdaten des Datenschutzbeauftragten: datenschutz@mandantenanalyse.com
            </p>

            <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
            <p>
              Wir erheben und verarbeiten folgende personenbezogene Daten:
            </p>
            <ul>
              <li>Name und Kontaktdaten</li>
              <li>Firmendaten</li>
              <li>Mandantendaten</li>
              <li>Nutzungsdaten der Plattform</li>
              <li>Kommunikationsdaten</li>
            </ul>

            <h2>3. Zweck der Datenverarbeitung</h2>
            <p>
              Die Verarbeitung erfolgt zu folgenden Zwecken:
            </p>
            <ul>
              <li>Bereitstellung der Mandantenanalyse.com-Plattform</li>
              <li>Durchführung von Mandantenanalysen</li>
              <li>Kommunikation mit Nutzern</li>
              <li>Verbesserung unserer Dienste</li>
              <li>Erfüllung gesetzlicher Pflichten</li>
            </ul>

            <h2>4. Rechtsgrundlagen</h2>
            <p>
              Die Verarbeitung Ihrer Daten erfolgt auf Grundlage folgender Rechtsgrundlagen:
            </p>
            <ul>
              <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
              <li>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</li>
            </ul>

            <h2>5. Datensicherheit</h2>
            <p>
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten
              gegen Manipulation, Verlust und unberechtigten Zugriff zu schützen.
            </p>

            <h2>6. Speicherdauer</h2>
            <p>
              Wir speichern Ihre Daten nur solange, wie es für die genannten Zwecke erforderlich
              ist oder gesetzliche Aufbewahrungspflichten bestehen.
            </p>

            <h2>7. Ihre Rechte</h2>
            <p>
              Sie haben folgende Rechte:
            </p>
            <ul>
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
            </ul>

            <h2>8. Cookies und Analyse-Tools</h2>
            <p>
              Wir verwenden Cookies und Analyse-Tools, um unsere Dienste zu verbessern und die
              Nutzung der Plattform zu analysieren.
            </p>

            <h2>9. Änderungen</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf unter Beachtung der
              geltenden Datenschutzvorschriften anzupassen.
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Stand: Mai 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatenschutzPage;