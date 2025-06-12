// src/components/auth/LoginForm.tsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes('email_not_confirmed')) {
          toast.error('Bitte bestätigen Sie Ihre E‑Mail-Adresse. Link erneut senden?')
        } else {
          toast.error(error.message)
        }
        return
      }
      toast.success('Willkommen zurück 👋')
      navigate('/clients')
    } catch (err) {
      toast.error('Login fehlgeschlagen')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6 lg:p-8">
      <div className="self-center text-center mb-8">
        <Link to="/" className="text-3xl font-bold text-blue-700">Mandantenanalyse.com</Link>
        <h2 className="mt-4 text-2xl font-semibold">Anmelden</h2>
        <p className="text-sm mt-2">
          Kein Konto? <Link to="/signup" className="text-blue-600 font-medium">Jetzt registrieren</Link>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow space-y-6 max-w-md w-full self-center">
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
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>Anmelden</Button>
        <div className="flex justify-between text-sm">
          <Link to="/reset-password" className="text-blue-600">Passwort vergessen?</Link>
          <Link to="/signup" className="text-blue-600">Jetzt registrieren</Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
