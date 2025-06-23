import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { showSuccess, showError } from '../../lib/toast'
import { Building2, Users, MapPin, Building } from 'lucide-react'
import Button from '../ui/Button'

interface LegalForm {
  id: number
  name: string
  category: string
}

const NewClientForm: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [legalForms, setLegalForms] = useState<LegalForm[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    employee_count: '',
    legal_form: '',
    plz: '',
    ort: '',
    land: 'Deutschland',
    strasse: ''
  })

  useEffect(() => {
    const fetchLegalForms = async () => {
      const { data, error } = await supabase
        .from('legal_forms')
        .select('*')
        .order('name')
      if (error) {
        console.error(error)
        showError('Rechtsformen konnten nicht geladen werden.')
      } else {
        setLegalForms(data ?? [])
      }
    }
    fetchLegalForms()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return showError('Sie müssen eingeloggt sein')
    if (!formData.name.trim()) return showError('Bitte geben Sie einen Firmennamen ein')

    setIsSubmitting(true)

    const insertData: any = {
      name: formData.name.trim(),
      user_id: user.id,
    }

    if (formData.employee_count) insertData.employee_count = parseInt(formData.employee_count)
    if (formData.legal_form) insertData.legal_form = parseInt(formData.legal_form)
    if (formData.plz) insertData.plz = formData.plz.trim()
    if (formData.ort) insertData.ort = formData.ort.trim()
    if (formData.land) insertData.land = formData.land.trim()
    if (formData.strasse) insertData.strasse = formData.strasse.trim()

    try {
      const { error } = await supabase.from('clients').insert([insertData])
      if (error) throw error
      showSuccess('Mandant erfolgreich angelegt')
      navigate('/clients')
    } catch (err: any) {
      console.error(err)
      showError(err?.message ?? 'Fehler beim Speichern')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl max-w-4xl p-8 space-y-10 mx-auto">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Grunddaten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firmenname */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Firmenname <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="z. B. Musterfirma GmbH"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mitarbeiterzahl */}
          <div>
            <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700">
              Anzahl Mitarbeiter
            </label>
            <div className="mt-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Users className="w-5 h-5" />
              </div>
              <input
                type="number"
                min="0"
                name="employee_count"
                id="employee_count"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="z. B. 25"
                value={formData.employee_count}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Rechtsform */}
          <div>
            <label htmlFor="legal_form" className="block text-sm font-medium text-gray-700">
              Rechtsform
            </label>
            <div className="mt-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building className="w-5 h-5" />
              </div>
              <select
                name="legal_form"
                id="legal_form"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.legal_form}
                onChange={handleChange}
              >
                <option value="">Bitte wählen</option>
                {legalForms.map(form => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Adresse */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Adresse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="strasse" className="block text-sm font-medium text-gray-700">
              Straße & Hausnummer
            </label>
            <input
              type="text"
              name="strasse"
              id="strasse"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Musterstraße 1"
              value={formData.strasse}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="plz" className="block text-sm font-medium text-gray-700">PLZ</label>
            <input
              type="text"
              name="plz"
              id="plz"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10115"
              value={formData.plz}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="ort" className="block text-sm font-medium text-gray-700">Stadt</label>
            <input
              type="text"
              name="ort"
              id="ort"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Berlin"
              value={formData.ort}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="land" className="block text-sm font-medium text-gray-700">Land</label>
            <input
              type="text"
              name="land"
              id="land"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Deutschland"
              value={formData.land}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-6 border-t border-gray-200 space-x-3">
        <Button variant="secondary" onClick={() => navigate('/clients')} disabled={isSubmitting}>
          Abbrechen
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting || !formData.name.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Speichere...' : 'Mandant anlegen'}
        </Button>
      </div>
    </form>
  )
}

export default NewClientForm
