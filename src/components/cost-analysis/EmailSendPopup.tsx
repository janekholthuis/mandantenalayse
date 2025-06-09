import React, { useState } from 'react';
import { Mail, X, Send, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface EmailSendPopupProps {
  onClose: () => void;
  onEmailSent: () => void;
  optimizationType: string;
  savings: number;
}

const EmailSendPopup: React.FC<EmailSendPopupProps> = ({ 
  onClose, 
  onEmailSent,
  optimizationType,
  savings
}) => {
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailData, setEmailData] = useState({
    to: 'thomas@williwillsparen.de',
    subject: 'Neue Optimierung gefunden',
    message: `Sehr geehrter Herr Müller,

nach Analyse Ihrer Kostenstruktur habe ich folgende Optimierungsmöglichkeit gefunden:

Beim ${optimizationType} lassen sich verschiedene Anbieter vergleichen mit Einsparungen bis zu ${savings}€ p.a.

Hier finden sie eine Übersicht der besten Angebote: Mandantenanalyse.com/williwillsparen/strom

MfG,
Kanzlei Max Mustermann`
  });

  const handleSendEmail = async () => {
    setIsSending(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setEmailSent(true);
    
    // Wait a moment to show success, then trigger callback
    setTimeout(() => {
      onEmailSent();
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (emailSent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">
              E-Mail erfolgreich versendet
            </h3>
            <p className="text-green-700 mb-4">
              Die Optimierungsempfehlung wurde an {emailData.to} gesendet.
            </p>
            <Button
              variant="primary"
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700"
            >
              Schließen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Optimierung an Mandant senden
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* To Field */}
          <div>
            <label htmlFor="email-to" className="block text-sm font-medium text-gray-700 mb-1">
              An
            </label>
            <input
              type="email"
              id="email-to"
              value={emailData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="mandant@beispiel.de"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-1">
              Betreff
            </label>
            <input
              type="text"
              id="email-subject"
              value={emailData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="email-message" className="block text-sm font-medium text-gray-700 mb-1">
              Nachricht
            </label>
            <textarea
              id="email-message"
              rows={12}
              value={emailData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={handleSendEmail}
            isLoading={isSending}
            icon={<Send size={16} />}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? 'Sende...' : 'E-Mail senden'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailSendPopup;