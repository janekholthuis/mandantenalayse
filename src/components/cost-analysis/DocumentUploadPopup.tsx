import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X, Star, Zap, Shield, Award, TrendingDown, Info } from 'lucide-react';
import Button from '../ui/Button';
import EmailSendPopup from './EmailSendPopup';

interface UploadedFile {
  name: string;
  type: string;
  status: 'uploading' | 'analyzing' | 'completed';
}

interface DocumentUploadPopupProps {
  onUploadComplete: (filename: string, type: string) => void;
  onClose: () => void;
  onEmailSent?: () => void;
}

interface Offer {
  id: string;
  provider: string;
  name: string;
  yearlyPrice: number;
  monthlyPrice: number;
  savings: number;
  rating: number;
  features: string[];
  highlights: string[];
  contractLength: string;
  priceGuarantee: string;
  bonus: number;
  isRecommended?: boolean;
  isEco?: boolean;
  customerService: string;
  cancellationPeriod: string;
}

const DocumentUploadPopup: React.FC<DocumentUploadPopupProps> = ({ 
  onUploadComplete, 
  onClose,
  onEmailSent
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showOffersButton, setShowOffersButton] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [emailOptimization, setEmailOptimization] = useState<{ type: string; savings: number } | null>(null);

  const offers: Offer[] = [
    {
      id: 'vattenfall',
      provider: 'Vattenfall',
      name: 'Natur Strom 25',
      yearlyPrice: 1050,
      monthlyPrice: 87.50,
      savings: 150,
      rating: 4.2,
      features: ['100% Ökostrom', 'Preisgarantie 24 Monate', 'Online-Kundenservice', 'Monatliche Abrechnung'],
      highlights: ['TÜV-zertifiziert', 'Klimaneutral', 'Deutscher Anbieter'],
      contractLength: '24 Monate',
      priceGuarantee: '24 Monate Preisgarantie',
      bonus: 75,
      isEco: true,
      customerService: '24/7 Online-Chat',
      cancellationPeriod: '4 Wochen zum Vertragsende'
    },
    {
      id: 'eon',
      provider: 'E.ON',
      name: 'ÖkoStrom Plus',
      yearlyPrice: 990,
      monthlyPrice: 82.50,
      savings: 210,
      rating: 4.7,
      features: ['100% Ökostrom aus Wasserkraft', 'Preisgarantie 24 Monate', 'Kostenloser Wechselservice', 'App-Steuerung'],
      highlights: ['Testsieger 2025', 'CO₂-neutral', 'Regionale Erzeugung'],
      contractLength: '24 Monate',
      priceGuarantee: '24 Monate volle Preisgarantie',
      bonus: 100,
      isRecommended: true,
      isEco: true,
      customerService: 'Persönlicher Ansprechpartner',
      cancellationPeriod: '6 Wochen zum Vertragsende'
    },
    {
      id: 'stadtwerke',
      provider: 'Stadtwerke München',
      name: 'M-Ökostrom Regional',
      yearlyPrice: 1120,
      monthlyPrice: 93.33,
      savings: 80,
      rating: 4.1,
      features: ['Regionaler Ökostrom', 'Flexible Laufzeit', 'Vor-Ort Service', 'Transparente Preise'],
      highlights: ['Lokaler Anbieter', 'Kurze Wege', 'Persönlicher Service'],
      contractLength: '12 Monate',
      priceGuarantee: '12 Monate Preisgarantie',
      bonus: 50,
      isEco: true,
      customerService: 'Lokale Geschäftsstelle',
      cancellationPeriod: '4 Wochen zum Vertragsende'
    },
    {
      id: 'naturstrom',
      provider: 'Naturstrom AG',
      name: 'naturstrom',
      yearlyPrice: 1180,
      monthlyPrice: 98.33,
      savings: 20,
      rating: 4.8,
      features: ['100% echter Ökostrom', 'Förderung neuer Anlagen', 'Transparente Herkunft', 'Nachhaltigkeitsbonus'],
      highlights: ['Pionier seit 1998', 'Höchste Öko-Standards', 'Investition in Energiewende'],
      contractLength: 'Unbegrenzt',
      priceGuarantee: '12 Monate Preisgarantie',
      bonus: 25,
      isEco: true,
      customerService: 'Fachberatung per Telefon',
      cancellationPeriod: '4 Wochen'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type.split('/')[1].toUpperCase(),
        status: 'uploading'
      }));
      
      setUploadedFiles(newFiles);

      // Simulate upload process
      newFiles.forEach((file, index) => {
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => f.name === file.name ? { ...f, status: 'analyzing' } : f)
          );
          
          // After 2 seconds, mark as completed with contract type
          setTimeout(() => {
            setUploadedFiles(prev => 
              prev.map(f => f.name === file.name ? { ...f, status: 'completed' } : f)
            );
            
            // Show offers button after all files are processed
            if (index === newFiles.length - 1) {
              setTimeout(() => {
                setShowOffersButton(true);
              }, 500);
            }
          }, 2000);
        }, index * 100);
      });
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(files => files.filter(f => f.name !== fileName));
  };

  const handleContinueToOffers = () => {
    setShowOffers(true);
  };

  const handleSelectOffer = (offer: Offer) => {
    setSelectedOfferId(offer.id);
  };

  const handleShowDetails = (offer: Offer, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOffer(offer);
    setShowOfferDetails(true);
  };

  const handleAcceptOffer = (offer: Offer) => {
    // Open email popup with summary instead of specific offer
    setEmailOptimization({
      type: 'Stromvertrag',
      savings: 210 // Use general savings amount for summary
    });
    setShowEmailPopup(true);
  };

  const handleEmailSent = () => {
    setShowEmailPopup(false);
    setEmailOptimization(null);
    
    // Notify parent component when email is sent
    if (onEmailSent) {
      onEmailSent();
    }
    
    // Update status to "waiting-for-client" when email is sent
    if (uploadedFiles.length > 0) {
      onUploadComplete(uploadedFiles[0].name, 'waiting-for-client');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getFileStatus = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Lade hoch...</span>
          </div>
        );
      case 'analyzing':
        return (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Analysiere...</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-green-600">✅ Vertrag</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (showOfferDetails && selectedOffer) {
    return (
      <div className="p-8 relative max-h-[95vh] overflow-y-auto max-w-6xl w-full">
        <button
          onClick={() => setShowOfferDetails(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedOffer.name}</h3>
              <p className="text-lg text-gray-600">{selectedOffer.provider}</p>
            </div>
            {selectedOffer.isRecommended && (
              <div className="bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-full flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Empfohlen
              </div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              {renderStars(selectedOffer.rating)}
              <span className="ml-2 text-sm text-gray-600">({selectedOffer.rating})</span>
            </div>
            {selectedOffer.isEco && (
              <div className="flex items-center text-green-600">
                <Shield className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">100% Ökostrom</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Preise</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Monatlich:</span>
                <span className="font-bold text-blue-900">{formatCurrency(selectedOffer.monthlyPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Jährlich:</span>
                <span className="font-bold text-blue-900">{formatCurrency(selectedOffer.yearlyPrice)}</span>
              </div>
              {selectedOffer.bonus > 0 && (
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-blue-700">Neukundenbonus:</span>
                  <span className="font-bold text-green-600">{formatCurrency(selectedOffer.bonus)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Ihre Ersparnis</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Pro Jahr:</span>
                <span className="font-bold text-green-900">{formatCurrency(selectedOffer.savings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Pro Monat:</span>
                <span className="font-bold text-green-900">{formatCurrency(selectedOffer.savings / 12)}</span>
              </div>
              <div className="flex items-center text-green-600 text-sm">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>Gegenüber aktuellem Anbieter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Leistungen</h4>
            <ul className="space-y-2">
              {selectedOffer.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Besonderheiten</h4>
            <ul className="space-y-2">
              {selectedOffer.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Vertragsbedingungen</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Vertragslaufzeit:</span>
              <span className="ml-2 text-gray-600">{selectedOffer.contractLength}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Preisgarantie:</span>
              <span className="ml-2 text-gray-600">{selectedOffer.priceGuarantee}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Kundenservice:</span>
              <span className="ml-2 text-gray-600">{selectedOffer.customerService}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Kündigung:</span>
              <span className="ml-2 text-gray-600">{selectedOffer.cancellationPeriod}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowOfferDetails(false)}
            className="flex-1"
          >
            Zurück zur Übersicht
          </Button>
          <Button
            variant="primary"
            onClick={() => handleAcceptOffer(selectedOffer)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Dieses Angebot wählen
          </Button>
        </div>
      </div>
    );
  }

  if (showOffers) {
    return (
      <div className="p-8 relative max-h-[95vh] overflow-y-auto max-w-6xl w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Dokument erfolgreich analysiert
          </h3>
          <p className="text-gray-600">
            Wir haben {offers.length} passende Stromanbieter für Sie gefunden
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`relative border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg min-h-[400px] ${
                selectedOfferId === offer.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : offer.isRecommended
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
              onClick={() => handleSelectOffer(offer)}
            >
              {offer.isRecommended && (
                <div className="absolute -top-2 left-4 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Empfohlen
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{offer.name}</h4>
                <p className="text-base text-gray-600 font-medium">{offer.provider}</p>
                <div className="flex items-center mt-2">
                  {renderStars(offer.rating)}
                  <span className="ml-2 text-sm text-gray-600 font-medium">({offer.rating})</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(offer.yearlyPrice)}
                  <span className="text-base font-normal text-gray-600">/Jahr</span>
                </div>
                <div className="text-base text-gray-600 font-medium">
                  {formatCurrency(offer.monthlyPrice)}/Monat
                </div>
              </div>

              {offer.savings > 0 && (
                <div className="mb-4 p-3 bg-green-100 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <TrendingDown className="h-5 w-5 mr-2" />
                    <span className="text-base font-bold">
                      {formatCurrency(offer.savings)}/Jahr
                    </span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    Ersparnis gegenüber aktuellem Anbieter
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {offer.isEco && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Shield className="h-4 w-4 mr-1" />
                      Ökostrom
                    </span>
                  )}
                  {offer.bonus > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Zap className="h-4 w-4 mr-1" />
                      {formatCurrency(offer.bonus)} Bonus
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Highlights:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {offer.highlights.slice(0, 2).map((highlight, index) => (
                    <li key={index} className="flex items-center">
                      <Zap className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={(e) => handleShowDetails(offer, e)}
                  className="flex items-center justify-center text-blue-600 text-base font-bold hover:text-blue-800 transition-colors"
                >
                  <Info className="h-5 w-5 mr-2" />
                  Details anzeigen
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4 mt-8">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 py-3 text-base"
          >
            Speichern
          </Button>
          <Button
            variant="primary"
            onClick={() => handleAcceptOffer(offers[0])} // Send summary regardless of selection
            className="flex-1 bg-green-600 hover:bg-green-700 py-3 text-base font-bold"
          >
            Angebotszusammenfassung senden
          </Button>
        </div>

        {/* Email Popup */}
        {showEmailPopup && emailOptimization && (
          <EmailSendPopup
            onClose={() => {
              setShowEmailPopup(false);
              setEmailOptimization(null);
            }}
            onEmailSent={handleEmailSent}
            optimizationType={emailOptimization.type}
            savings={emailOptimization.savings}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 relative max-w-md w-full">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
      >
        <X size={20} />
      </button>

      <div className="flex items-center mb-6">
        <Upload className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">
          Dokumente hochladen
        </h3>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Klicken Sie hier oder ziehen Sie Dateien hierher
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button
            variant="primary"
            onClick={() => document.getElementById('file-upload')?.click()}
            icon={<Upload size={16} />}
            disabled={uploadedFiles.length > 0 && uploadedFiles.some(f => f.status !== 'completed')}
          >
            Dateien auswählen
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOC, DOCX, JPG, PNG bis 10MB
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Hochgeladene Dateien</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="min-w-[120px]">
                      {getFileStatus(file)}
                    </div>
                    {file.status === 'completed' && (
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Speichern
          </Button>
          {showOffersButton && !showOffers && (
            <Button
              variant="primary"
              onClick={handleContinueToOffers}
              className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold"
            >
              Angebote anzeigen
            </Button>
          )}
        </div>
      </div>

      {/* Email Popup */}
      {showEmailPopup && emailOptimization && (
        <EmailSendPopup
          onClose={() => {
            setShowEmailPopup(false);
            setEmailOptimization(null);
          }}
          onEmailSent={handleEmailSent}
          optimizationType={emailOptimization.type}
          savings={emailOptimization.savings}
        />
      )}
    </div>
  );
};

export default DocumentUploadPopup;