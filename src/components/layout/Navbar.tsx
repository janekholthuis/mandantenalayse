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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always on the left */}
          <div className="flex-shrink-0">
            <Link to="/clients" className="flex items-center">
              <span className="text-2xl font-bold text-blue-700">Mandantenanalyse.com</span>
            </Link>
          </div>

          {/* Desktop Navigation - Always on the right */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Abmelden
            </button>
          </div>

          {/* Mobile menu button - Always on the right */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            >
              <span className="sr-only">Menü öffnen</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            <Link
              to="/clients"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={toggleMenu}
            >
              Mandanten
            </Link>
            <Link
              to="/clients/new"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={toggleMenu}
            >
              Mandanten hinzufügen
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={toggleMenu}
            >
              Einstellungen
            </Link>
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;