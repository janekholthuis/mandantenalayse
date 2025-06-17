import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Mandantenanalyse automatisieren</h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-xl mb-6">
          Die erste Plattform zur KI-gestützten Mandantenanalyse – entwickelt speziell für Steuerberater.
        </p>
        <Link
          to="/signup"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded hover:bg-blue-700 transition"
        >
          Jetzt starten
        </Link>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">So hilft dir Mandantenanalyse.com</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">🔍 Mandanten identifizieren</h3>
              <p className="text-gray-600">Erkenne sofort, bei welchen Mandanten Handlungsbedarf besteht.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">⚡️ Automatische Analyse</h3>
              <p className="text-gray-600">Nutze moderne Datenanalyse, um Potenziale schnell zu erfassen.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">📈 Strategische Empfehlungen</h3>
              <p className="text-gray-600">Erhalte direkt umsetzbare Vorschläge zur Optimierung deiner Mandantenstruktur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für eine moderne Kanzlei?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Teste Mandantenanalyse.com jetzt kostenlos – ohne Verpflichtungen.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded hover:bg-blue-700 transition"
          >
            Kostenlos starten
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-100 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mandantenanalyse.com – Alle Rechte vorbehalten
      </footer>
    </div>
  );
};

export default LandingPage;
