import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always on the left */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/clients" className="text-xl sm:text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors">
              Mandantenanalyse.com
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Abmelden
            </button>
          </div>

          {/* Mobile menu button - Only shown on mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Hauptmenü öffnen</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only shown when menu is open */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg sm:px-6 lg:px-8">
          <Link
            to="/clients"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={toggleMenu}
          >
            Mandanten
          </Link>
          <Link
            to="/clients/new"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={toggleMenu}
          >
            Mandanten hinzufügen
          </Link>
          <Link
            to="/settings"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={toggleMenu}
          >
            Einstellungen
          </Link>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;