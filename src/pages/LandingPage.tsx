import React from 'react';

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-blue-50 py-20 text-center px-4">
        <p className="text-lg text-gray-500 mb-4">Mandantenanalyse.com</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Kosten und Steuern automatisiert optimieren
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-700">
          Hochautomatisierte Mandantenanalysen identifizieren ungenutzte Mitarbeiter-Benefits sowie betriebliche Einsparpotenziale – inklusive konkreter Handlungsempfehlungen. Kein Mehraufwand, mit reduziertem Haftungsrisiko – und mit spürbarem Mehrwert für Ihre Mandanten.
        </p>
        <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded overflow-hidden">
          <iframe
            src="https://www.loom.com/share/1eddc511125d4219bf6a58bab86b7e58?sid=1737cc25-20a5-4629-822c-fa78358c106f"
            frameBorder="0"
            allowFullScreen
            title="Demo-Video"
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'Bis zu 1.800 € Zeitersparnis',
              text: 'Durch KI-gestützte Analyse statt händischer Recherche von Mitarbeitervorteilen, Einsparpotenzialen und Förderungen.',
            },
            {
              title: 'Bis zu 10.000 € Steuervorteile',
              text: 'Durch systematische Auswertung und automatisierte Handlungsempfehlungen für den Mandanten.',
            },
            {
              title: 'Haftungsrisiko reduzieren',
              text: 'Systematische Erkennung potenzieller Versäumnisse bei Förderungen, Arbeitgeberleistungen etc.',
            },
            {
              title: 'Mandantenbindung stärken',
              text: 'Mandanten erkennen echten Mehrwert durch aktive Beratung – ganz ohne Mehraufwand.',
            },
          ].map((b, i) => (
            <div key={i} className="border p-6 rounded shadow-sm bg-gray-50">
              <h3 className="text-2xl font-semibold mb-2">{b.title}</h3>
              <p className="text-gray-600">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-12">So funktioniert's</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              title: '1. Mandant hochladen',
              text: 'Einfacher Excel-Upload der Mandantendaten (z.B. aus Agenda, DATEV etc.)',
            },
            {
              title: '2. Analyse starten',
              text: 'Automatische Erkennung von ungenutzten Steuervorteilen, Förderungen & Benefits.',
            },
            {
              title: '3. Optimieren & beraten',
              text: 'Direkte Umsetzung durch den Mandanten oder vorbereitete Beratungsimpulse vom Steuerberater.',
            },
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="bg-white py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">So sieht das aus</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <iframe
            src="https://www.loom.com/embed/98d38b05f8f94258a64f92b6d2d37990"
            frameBorder="0"
            allowFullScreen
            title="Feature Video"
            className="w-full md:w-1/2 aspect-video rounded"
          />
          <div className="grid grid-cols-1 gap-4">
            <img src="https://via.placeholder.com/400x250?text=Screenshot+1" alt="Screenshot 1" className="rounded shadow" />
            <img src="https://via.placeholder.com/400x250?text=Screenshot+2" alt="Screenshot 2" className="rounded shadow" />
            <img src="https://via.placeholder.com/400x250?text=Screenshot+3" alt="Screenshot 3" className="rounded shadow" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-100 py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Jetzt auf die Warteliste setzen</h2>
        <p className="mb-8 text-lg text-gray-700">Und als Erste:r von der automatisierten Mandantenanalyse profitieren.</p>
        <div className="max-w-2xl mx-auto">
          <iframe
            src="https://share-eu1.hsforms.com/1jAvZzVVjRZyy4PgOqIhUQge1e4j8"
            width="100%"
            height="600"
            frameBorder="0"
            title="Warteliste"
            className="rounded"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Mandantenanalyse.com – Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default LandingPage;
