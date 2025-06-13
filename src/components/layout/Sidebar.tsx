import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Users, UserPlus, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.user_metadata?.name ?? 'Unbekannt'
  const company = user?.user_metadata?.company ?? 'Organisation'

  const navItems = [
    { path: '/clients', label: 'Mandanten', icon: <Users size={20} /> },
    { path: '/clients/new', label: 'Mandanten hinzufügen', icon: <UserPlus size={20} /> },
    { path: '/settings', label: 'Einstellungen', icon: <Settings size={20} /> },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="hidden md:flex md:flex-col w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="flex flex-col justify-between h-full">
        <nav className="pt-5 px-2 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } group flex items-center px-3 py-2 rounded-md text-sm font-medium`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{company}</p>
            </div>
          </div>
          <button onClick={handleLogout} title="Abmelden" className="text-gray-400 hover:text-red-600">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
