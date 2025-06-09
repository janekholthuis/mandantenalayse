import React, { useState } from 'react';
import { Zap, TrendingDown, CheckCircle, Star } from 'lucide-react';
import Button from '../ui/Button';

interface Provider {
  id: string;
  name: string;
  yearlyPrice: number;
  monthlyPrice: number;
  savings: number;
  features: string[];
  rating: number;
  isRecommended?: boolean;
}

interface ProviderComparisonProps {
  onRecommendationAccepted: (provider: Provider) => void;
}

const ProviderComparison: React.FC<ProviderComparisonProps> = ({ onRecommendationAccepted }) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const providers: Provider[] = [
    {
      id: 'current',
      name: 'Lichtblick GmbH (Aktuell)',
      yearlyPrice: 1200,
      monthlyPrice: 100,
      savings: 0,
      features: ['Ökostrom', 'Grundversorgung', '24 Monate Laufzeit'],
      rating: 3.5
    },
    {
      id: 'provider-a',
      name: 'Anbieter A',
      yearlyPrice: 1050,
      monthlyPrice: 87.50,
      savings: 150,
      features: ['Ökostrom', 'Preisgarantie 12 Monate', 'Online-Service'],
      rating: 4.2
    },
    {
      id: 'provider-b',
      name: 'Anbieter B',
      yearlyPrice: 990,
      monthlyPrice: 82.50,
      savings: 210,
      features: ['100% Ökostrom', 'Preisgarantie 24 Monate', 'Bonus für Neukunden'],
      rating: 4.7,
      isRecommended: true
    }
  ];

  const handleAcceptRecommendation = () => {
    const recommendedProvider = providers.find(p => p.isRecommended);
    if (recommendedProvider) {
      setSelectedProvider(recommendedProvider.id);
      setIsAccepted(true);
      setTimeout(() => {
        onRecommendationAccepted(recommendedProvider);
      }, 1000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
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

  if (isAccepted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Empfehlung übernommen
        </h3>
        <p className="text-green-700">
          Wechsel zu {providers.find(p => p.isRecommended)?.name} wird vorbereitet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Zap className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Anbietervergleich</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`relative border rounded-lg p-4 transition-all ${
              provider.isRecommended
                ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                : provider.id === 'current'
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {provider.isRecommended && (
              <div className="absolute -top-2 left-4 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
                Empfohlen
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{provider.name}</h4>
              <div className="flex items-center mb-2">
                {renderStars(provider.rating)}
                <span className="ml-2 text-sm text-gray-600">({provider.rating})</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(provider.yearlyPrice)}
                <span className="text-sm font-normal text-gray-600">/Jahr</span>
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(provider.monthlyPrice)}/Monat
              </div>
            </div>

            {provider.savings > 0 && (
              <div className="mb-4 p-2 bg-green-100 rounded-lg">
                <div className="flex items-center text-green-700">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    Ersparnis: {formatCurrency(provider.savings)}/Jahr
                  </span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Leistungen:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {provider.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {provider.id === 'current' && (
              <div className="text-center">
                <span className="text-sm text-gray-500 font-medium">Aktueller Anbieter</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="primary"
          onClick={handleAcceptRecommendation}
          className="bg-green-600 hover:bg-green-700"
        >
          Empfehlung übernehmen
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          Potenzielle Jahresersparnis: <span className="font-medium text-green-600">210 €</span>
        </p>
      </div>
    </div>
  );
};

export default ProviderComparison;