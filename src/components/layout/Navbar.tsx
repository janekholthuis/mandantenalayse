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
    <nav className="bg-white border-b border-graphit-200 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/clients" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-heading font-bold text-kanzlei-500">Mandantenanalyse.com</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="text-graphit-500 hover:text-kanzlei-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              Abmelden
            </button>
          </div>

          <div className="md:hidden -mr-2 flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-graphit-400 hover:text-graphit-500 hover:bg-graphit-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-kanzlei-500 transition-colors"
            >
              <span className="sr-only">Menü öffnen</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/clients"
              className="block px-3 py-2 rounded-xl text-base font-medium text-kanzlei-500 hover:bg-graphit-50 transition-colors"
              onClick={toggleMenu}
            >
              Mandanten
            </Link>
            <Link
              to="/clients/new"
              className="block px-3 py-2 rounded-xl text-base font-medium text-kanzlei-500 hover:bg-graphit-50 transition-colors"
              onClick={toggleMenu}
            >
              Mandanten hinzufügen
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 rounded-xl text-base font-medium text-kanzlei-500 hover:bg-graphit-50 transition-colors"
              onClick={toggleMenu}
            >
              Einstellungen
            </Link>
            <button
              onClick={handleLogout}
              className="block px-3 py-2 rounded-xl text-base font-medium text-kanzlei-500 hover:bg-graphit-50 transition-colors"
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