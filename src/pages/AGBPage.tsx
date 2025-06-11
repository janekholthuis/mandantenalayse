import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AGBPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Allgemeine Geschäftsbedingungen</h1>

          <div className="prose prose-blue max-w-none">
            <h2>1. Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Mandantenanalyse.com-Plattform,
              die von der Mandantenanalyse.com GmbH betrieben wird. Mit der Registrierung oder Nutzung unserer
              Dienste stimmen Sie diesen AGB zu.
            </p>

            <h2>2. Leistungsbeschreibung</h2>
            <p>
              Mandantenanalyse.com bietet eine cloudbasierte Plattform zur Mandantenanalyse und -verwaltung.
              Die Plattform unterstützt Berater bei der Analyse und Optimierung der steuerlichen
              Situation ihrer Mandanten.
            </p>

            <h2>3. Nutzungsrechte</h2>
            <p>
              Mit Abschluss des Nutzungsvertrags erhält der Kunde ein nicht ausschließliches,
              nicht übertragbares Recht zur Nutzung der Plattform im vereinbarten Umfang.
            </p>

            <h2>4. Pflichten des Nutzers</h2>
            <p>
              Der Nutzer verpflichtet sich:
            </p>
            <ul>
              <li>Zur wahrheitsgemäßen Angabe seiner Daten bei der Registrierung</li>
              <li>Zur sicheren Verwahrung seiner Zugangsdaten</li>
              <li>Zur Einhaltung aller relevanten gesetzlichen Bestimmungen</li>
              <li>Zur Beachtung der Datenschutzbestimmungen</li>
            </ul>

            <h2>5. Vergütung</h2>
            <p>
              Die Nutzung der Plattform ist kostenpflichtig. Die Preise richten sich nach der
              aktuellen Preisliste. Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.
            </p>

            <h2>6. Haftung</h2>
            <p>
              Mandantenanalyse.com haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem
              Verhalten beruhen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.
            </p>

            <h2>7. Datenschutz</h2>
            <p>
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung
              und unter Beachtung der geltenden datenschutzrechtlichen Bestimmungen.
            </p>

            <h2>8. Vertragslaufzeit und Kündigung</h2>
            <p>
              Der Vertrag wird auf unbestimmte Zeit geschlossen und kann von beiden Seiten mit
              einer Frist von 30 Tagen zum Monatsende gekündigt werden.
            </p>

            <h2>9. Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich
              zulässig, der Sitz der Mandantenanalyse.com GmbH.
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

export default AGBPage;