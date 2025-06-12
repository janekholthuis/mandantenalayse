// src/components/auth/SignupForm.tsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Building2, Mail, Lock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

const SignupForm: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const company = form.get('company') as string
    const email = form.get('email') as string
    const password = form.get('password') as string

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, company }, emailRedirectTo: `${window.location.origin}/confirm-email` }
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast('📧 Bestätigungs-E-Mail gesendet')
      navigate(`/email-confirmation-sent?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`)
    } catch {
      toast.error('Registrierung fehlgeschlagen')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6 lg:p-8">
      <div className="self-center text-center mb-8">
        <Link to="/" className="text-3xl font-bold text-blue-700">Mandantenanalyse.com</Link>
        <h2 className="mt-4 text-2xl font-semibold">Konto erstellen</h2>
        <p className="text-sm mt-2">
          Schon registriert? <Link to="/login" className="text-blue-600 font-medium">Anmelden</Link>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow space-y-6 max-w-md w-full self-center">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <div className="mt-1 relative">
            <User className="absolute top-2 left-2 text-gray-400" />
            <input id="name" name="name" type="text" required placeholder="Max Mustermann"
              className="pl-10 w-full border rounded p-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium">Unternehmen</label>
          <div className="mt-1 relative">
            <Building2 className="absolute top-2 left-2 text-gray-400" />
            <input id="company" name="company" type="text" required placeholder="Steuerberatung GmbH"
              className="pl-10 w-full border rounded p-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">E‑Mail-Adresse</label>
          <div className="mt-1 relative">
            <Mail className="absolute top-2 left-2 text-gray-400" />
            <input id="email" name="email" type="email" required placeholder="max@beispiel.de"
              className="pl-10 w-full border rounded p-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Passwort</label>
          <div className="mt-1 relative">
            <Lock className="absolute top-2 left-2 text-gray-400" />
            <input id="password" name="password" type="password" required placeholder="••••••••"
              className="pl-10 w-full border rounded p-2 focus:ring-blue-500" minLength={8} />
          </div>
        </div>
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>Registrieren</Button>
      </form>
    </div>
  )
}

export default SignupForm
