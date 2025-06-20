import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Gift, Users, Settings, Building2, MapPin, Phone } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Client } from '../types';
import { showSuccess, showError } from '../lib/toast';

const Tabs = \[
{ id: 'benefits', label: 'Benefits', icon: Gift },
{ id: 'mitarbeiter', label: 'Mitarbeiter', icon: Users },
{ id: 'einstellungen', label: 'Einstellungen', icon: Settings },
];

const ClientDetailPage: React.FC = () => {
const { id, '\*': activeTab = 'benefits' } = useParams();
const { user } = useAuth();
const navigate = useNavigate();
const location = useLocation();

const handleTabChange = (tab: string) => {
navigate(`/clients/${id}/${tab}`);
};

return ( <div> <div className="mb-4"> <Link to="/clients" className="text-blue-600 hover:text-blue-500 flex items-center"> <ArrowLeft size={16} className="mr-1" />
Zurück zu Mandanten </Link> </div>

```
  <PageHeader
    title="Mandantendetails"
    description={<span>Verwalte deine Mandantendaten effizient</span>}
  />

  {/* Tab Navigation */}
  <div className="bg-white rounded-lg shadow mb-8">
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-6">
        {Tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </div>
          </button>
        ))}
      </nav>
    </div>
  </div>

  <div className="mb-8">
    <p className="text-gray-600">Aktiver Tab: {activeTab}</p>
    {/* Hier sollte dein renderTabContent() Output eingebunden werden */}
  </div>
</div>
```

);
};

export default ClientDetailPage;
