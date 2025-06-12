import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;
    const company = form.get('company') as string;
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { name, company }, 
          emailRedirectTo: `${window.location.origin}/confirm-email` 
        }
      });
      
      if (error) {
        showError(error.message);
        return;
      }
      
      showSuccess('Bestätigungs-E-Mail gesendet! 📧');
      navigate(`/email-confirmation-sent?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
    } catch (err) {
      showError('Registrierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6 lg:p-8">
      <div className="self-center text-center mb-8">
        <Link to="/" className="text-3xl font-bold text-blue-700">
          Mandantenanalyse.com
        </Link>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Konto erstellen</h2>
        <p className="text-sm mt-2 text-gray-600">
          Schon registriert? <Link to="/login" className="text-blue-600 font-medium hover:text-blue-500">Anmelden</Link>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6 max-w-md w-full self-center">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              placeholder="Max Mustermann"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Unternehmen
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              id="company" 
              name="company" 
              type="text" 
              required 
              placeholder="Steuerberatung GmbH"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E‑Mail-Adresse
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email"
              required 
              placeholder="max@beispiel.de"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Passwort
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="new-password"
              required 
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              minLength={8}
            />
          </div>
        </div>
        
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700">
          Registrieren
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;