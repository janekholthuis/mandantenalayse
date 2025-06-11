import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Rechtliches
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/datenschutz" className="text-base text-gray-500 hover:text-gray-900">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="/agb" className="text-base text-gray-500 hover:text-gray-900">
                  AGB
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Kontakt
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="mailto:info@taxoptim.de" className="text-base text-gray-500 hover:text-gray-900">
                  info@mandantenanalyse.com
                </a>
              </li>
              <li>
                <span className="text-base text-gray-500">
                  +49 (0) 123 456789
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2025 Mandantenanalyse.com. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;