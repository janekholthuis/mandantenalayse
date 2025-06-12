import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/clients', label: 'Mandanten', icon: <Users size={20} /> },
    { path: '/clients/new', label: 'Mandanten hinzufügen', icon: <UserPlus size={20} /> },
    { path: '/settings', label: 'Einstellungen', icon: <Settings size={20} /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:block w-64 bg-gray-50 border-r border-gray-200">
      <div className="h-full flex flex-col">
        <nav className="flex-1 pt-5 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center w-full">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              MS
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Max Steuerberater</p>
              <p className="text-xs font-medium text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
