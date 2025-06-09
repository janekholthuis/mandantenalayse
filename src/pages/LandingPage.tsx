import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, TrendingUp, Users, AlertTriangle, CheckCircle, FileText, BarChart3, Play } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-700">Mandantenanalyse.com</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#problem" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Problem
              </a>
              <a href="#solution" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Lösung
              </a>
              <a href="#demo" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Demo
              </a>
              <a href="#waitlist" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Warteliste
              </a>
              <Link to="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Automatisierte Optimierung</span>
                  <span className="block text-blue-600">für Steuerkanzleien</span>
                </h1>
                <p className="mt-3 text-xl text-gray-600 sm:mt-5 sm:text-2xl sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
                  einfach, schnell, rechtssicher.
                </p>
                <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-lg text-gray-700 mb-4">
                    <strong>Mandanten fragen:</strong> „Was kann ich noch sparen?"
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    <strong>Unsere Antwort:</strong> Eine Software, die steuerliche Vorteile und Vertragskosten automatisiert analysiert – damit Kanzleien echte Mehrwerte liefern können.
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Jetzt auf die Warteliste für den Pilotzugang.
                  </div>
                </div>
                <div className="mt-8">
                  <a href="#waitlist">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-bold px-8 py-4 text-lg"
                    >
                      Jetzt auf die Warteliste
                    </Button>
                  </a>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-gray-600 text-sm">
                    Bereits registriert?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                      Hier anmelden
                    </Link>
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg"
            alt="Tax optimization dashboard"
          />
        </div>
      </div>

      {/* Problem Section */}
      <div id="problem" className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Warum Kanzleien uns brauchen:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Haftungsrisiko</h3>
              </div>
              <p className="text-gray-700">
                Wenn steuerliche Vorteile ungenutzt bleiben
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Keine Zeit</h3>
              </div>
              <p className="text-gray-700">
                Manuelle Analyse kostet Ressourcen
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Mandanten erwarten Optimierung</h3>
              </div>
              <p className="text-gray-700">
                Steuerberatung wird strategischer – Mandanten wollen konkrete Einsparungsvorschläge
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section 1 - Mitarbeiter-Benefits */}
      <div id="solution" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Lösung 1 – Mitarbeiter-Benefits
                </h2>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Automatische Prüfung und Darstellung der Nutzung steuerlicher Vorteile.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Analyse</h3>
                    <p className="text-gray-600">VL, Sachbezug, bAV, Firmenwagen, etc.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Status</h3>
                    <p className="text-gray-600">Genutzt / Ungenutzt / Unklar</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Empfehlungen</h3>
                    <p className="text-gray-600">Handlungsvorschläge für Berater</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Output</h3>
                    <p className="text-gray-600">Beratungsleitfaden & PDF-Export</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <FileText className="h-16 w-16 mx-auto" />
                </div>
                <p className="text-gray-600 italic">
                  [Screenshot Mitarbeiter Benefits wird hier eingefügt]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section 2 - Kostenoptimierung */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <BarChart3 className="h-16 w-16 mx-auto" />
                </div>
                <p className="text-gray-600 italic">
                  [Screenshot Kostenoptimierung wird hier eingefügt]
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 mt-10 lg:mt-0">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Lösung 2 – Kostenoptimierung
                </h2>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Transaktionsanalyse erkennt automatisch Sparpotenziale bei Verträgen.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">CSV oder API-Import</h3>
                    <p className="text-gray-600">von Banktransaktionen</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Klassifikation durch KI</h3>
                    <p className="text-gray-600">z. B. Strom, Internet, Versicherungen</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Hochladen aktueller Verträge</h3>
                    <p className="text-gray-600">Automatische Analyse und Vergleich</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Vergleichsangebote</h3>
                    <p className="text-gray-600">anzeigen + Empfehlung generieren</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo" className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            DEMO – Video
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            2 Minuten zeigen, wie Mandantenanalyse funktioniert.
          </p>
          
          <div className="bg-gray-900 rounded-lg p-16 text-center">
            <div className="text-white mb-4">
              <Play className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-300 italic">
              [Hier Video einbetten oder Button zu Video]
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="mt-6 bg-white text-blue-600 hover:bg-gray-100"
            >
              Demo Video ansehen
            </Button>
          </div>
        </div>
      </div>

      {/* CTA - Waitlist Signup */}
      <div id="waitlist" className="py-16 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              🚀 Jetzt Zugang zur Pilotphase sichern
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Kostenlos testen</h3>
                <p className="text-gray-600 text-sm">Vollzugang während der Pilotphase</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Feedback geben</h3>
                <p className="text-gray-600 text-sm">Direkte Kommunikation mit dem Entwicklerteam</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Frühzeitig mitgestalten</h3>
                <p className="text-gray-600 text-sm">Einfluss auf Produktentwicklung nehmen</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                📝 Jetzt auf die Warteliste
              </h3>
              
              {/* Fillout Form Embed */}
              <div 
                style={{width: '100%', height: '500px'}} 
                data-fillout-id="wqXUryyoLZus" 
                data-fillout-embed-type="standard" 
                data-fillout-inherit-parameters 
                data-fillout-dynamic-resize
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mandantenanalyse.com</h3>
              <p className="text-gray-400">
                Automatisierte Optimierung für Steuerkanzleien – einfach, schnell, rechtssicher.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Rechtliches</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/datenschutz" className="text-gray-400 hover:text-white transition-colors">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link to="/agb" className="text-gray-400 hover:text-white transition-colors">
                    AGB
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:info@mandantenanalyse.com" className="text-gray-400 hover:text-white transition-colors">
                    info@mandantenanalyse.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; 2025 Mandantenanalyse.com. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;