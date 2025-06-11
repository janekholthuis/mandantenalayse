import React, { useState } from 'react';
import { Mail, Edit, Save, X, Eye, Send } from 'lucide-react';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import { EmailService } from '../services/emailService';
import Button from '../components/ui/Button';

const EmailTemplatesPage: React.FC = () => {
  const { templates, loading, error, updateTemplate } = useEmailTemplates();
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [editForm, setEditForm] = useState({
    subject: '',
    html_content: ''
  });

  const handleEdit = (template: any) => {
    setEditingTemplate(template.id);
    setEditForm({
      subject: template.subject,
      html_content: template.html_content
    });
  };

  const handleSave = async (templateId: string) => {
    const success = await updateTemplate(templateId, editForm);
    if (success) {
      setEditingTemplate(null);
      setEditForm({ subject: '', html_content: '' });
    }
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setEditForm({ subject: '', html_content: '' });
  };

  const handlePreview = (template: any) => {
    setPreviewTemplate(template.id);
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) return;
    
    setSendingTest(true);
    try {
      const success = await EmailService.sendTestEmail(testEmail);
      if (success) {
        alert('Test-E-Mail erfolgreich gesendet!');
      } else {
        alert('Fehler beim Senden der Test-E-Mail. Bitte überprüfen Sie die Konsole für Details.');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Fehler beim Senden der Test-E-Mail.');
    } finally {
      setSendingTest(false);
      setShowTestEmailModal(false);
      setTestEmail('');
    }
  };

  const getTemplateDisplayName = (type: string) => {
    const names: Record<string, string> = {
      'welcome': 'Willkommens-E-Mail',
      'password_reset': 'Passwort zurücksetzen',
      'email_confirmation': 'E-Mail-Bestätigung'
    };
    return names[type] || type;
  };

  const getTemplateDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'welcome': 'Wird an neue Benutzer nach der Registrierung gesendet',
      'password_reset': 'Wird gesendet, wenn ein Benutzer sein Passwort zurücksetzen möchte',
      'email_confirmation': 'Wird zur Bestätigung der E-Mail-Adresse gesendet'
    };
    return descriptions[type] || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Fehler beim Laden der E-Mail-Vorlagen</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">E-Mail-Vorlagen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verwalten Sie die E-Mail-Vorlagen für Authentifizierungs-Workflows
          </p>
        </div>
        <div className="flex items-center">
          <Mail className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-sm text-gray-600">{templates.length} Vorlagen</span>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowTestEmailModal(true)}
          icon={<Send size={16} />}
        >
          Test-E-Mail senden
        </Button>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {getTemplateDisplayName(template.type)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getTemplateDescription(template.type)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Typ: <code className="bg-gray-100 px-2 py-1 rounded">{template.type}</code>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePreview(template)}
                    icon={<Eye size={16} />}
                  >
                    Vorschau
                  </Button>
                  {editingTemplate === template.id ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSave(template.id)}
                        icon={<Save size={16} />}
                      >
                        Speichern
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCancel}
                        icon={<X size={16} />}
                      >
                        Abbrechen
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(template)}
                      icon={<Edit size={16} />}
                    >
                      Bearbeiten
                    </Button>
                  )}
                </div>
              </div>

              {editingTemplate === template.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Betreff
                    </label>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML-Inhalt
                    </label>
                    <textarea
                      value={editForm.html_content}
                      onChange={(e) => setEditForm({ ...editForm, html_content: e.target.value })}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Verfügbare Platzhalter:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><code>{'{{user_name}}'}</code> - Name des Benutzers</div>
                      <div><code>{'{{user_email}}'}</code> - E-Mail-Adresse des Benutzers</div>
                      <div><code>{'{{company_name}}'}</code> - Firmenname</div>
                      <div><code>{'{{login_url}}'}</code> - Link zur Anmeldung</div>
                      <div><code>{'{{reset_url}}'}</code> - Link zum Passwort zurücksetzen</div>
                      <div><code>{'{{confirmation_url}}'}</code> - Link zur E-Mail-Bestätigung</div>
                      <div><code>{'{{support_email}}'}</code> - Support E-Mail-Adresse</div>
                      <div><code>{'{{current_year}}'}</code> - Aktuelles Jahr</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Betreff: </span>
                    <span className="text-sm text-gray-900">{template.subject}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Letzte Änderung: </span>
                    <span className="text-sm text-gray-900">
                      {new Date(template.updated_at).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">E-Mail-Vorschau</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={templates.find(t => t.id === previewTemplate)?.html_content
                    .replace(/{{user_name}}/g, 'Max Mustermann')
                    .replace(/{{company_name}}/g, 'Beispiel Steuerberatung GmbH')
                    .replace(/{{user_email}}/g, 'max@beispiel.de')
                    .replace(/{{login_url}}/g, `${window.location.origin}/login`)
                    .replace(/{{reset_url}}/g, `${window.location.origin}/update-password?token=example`)
                    .replace(/{{confirmation_url}}/g, `${window.location.origin}/confirm-email?token=example`)
                    .replace(/{{support_email}}/g, 'support@mandantenanalyse.com')
                    .replace(/{{current_year}}/g, new Date().getFullYear().toString())
                  }
                  className="w-full h-96 border-0"
                  title="E-Mail-Vorschau"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Email Modal */}
      {showTestEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Test-E-Mail senden</h3>
              <button
                onClick={() => setShowTestEmailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="test@beispiel.de"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowTestEmailModal(false)}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendTestEmail}
                  isLoading={sendingTest}
                  disabled={!testEmail || sendingTest}
                  className="flex-1"
                >
                  Test senden
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplatesPage;