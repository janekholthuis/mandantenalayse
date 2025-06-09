import React, { useState, useMemo } from 'react';
import { CheckCircle, Search, Filter, Calendar, ChevronDown, X } from 'lucide-react';
import BankConnection from './BankConnection';
import TransactionImport from './TransactionImport';
import ProviderComparison from './ProviderComparison';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  category: string;
  description: string;
}

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

interface CostOptimizationTabProps {
  connectedBank: string | null;
  transactionsImported: boolean;
  acceptedRecommendation: Provider | null;
  showProviderComparison: boolean;
  onBankConnection: (bank: string, from: string, to: string) => void;
  onOptimizationFound: (transaction: Transaction) => void;
  onRecommendationAccepted: (provider: Provider) => void;
  onEmailSent?: () => void;
}

const CostOptimizationTab: React.FC<CostOptimizationTabProps> = ({
  connectedBank,
  transactionsImported,
  acceptedRecommendation,
  showProviderComparison,
  onBankConnection,
  onOptimizationFound,
  onRecommendationAccepted,
  onEmailSent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock transactions for filtering demonstration
  const allTransactions: Transaction[] = [
    { id: '1', date: '2025-05-15', amount: -89.50, recipient: 'Lichtblick GmbH', category: 'Energie', description: 'Stromabschlag Mai' },
    { id: '2', date: '2025-05-14', amount: -45.20, recipient: 'Telekom Deutschland', category: 'Kommunikation', description: 'Internet & Telefon' },
    { id: '3', date: '2025-05-13', amount: -156.80, recipient: 'Allianz Versicherung', category: 'Versicherung', description: 'KFZ-Versicherung' },
    { id: '4', date: '2025-05-12', amount: -67.30, recipient: 'Stadtwerke München', category: 'Energie', description: 'Gas & Wasser' },
    { id: '5', date: '2025-05-11', amount: -234.50, recipient: 'Amazon Deutschland', category: 'Einkauf', description: 'Büroausstattung' },
    { id: '6', date: '2025-05-10', amount: -78.90, recipient: 'Shell Tankstelle', category: 'Transport', description: 'Kraftstoff' },
    { id: '7', date: '2025-05-09', amount: -125.00, recipient: 'Microsoft Deutschland', category: 'Software', description: 'Office 365 Business' },
    { id: '8', date: '2025-05-08', amount: -89.50, recipient: 'Lichtblick GmbH', category: 'Energie', description: 'Stromabschlag April' },
    { id: '9', date: '2025-05-07', amount: -45.60, recipient: 'Vodafone GmbH', category: 'Kommunikation', description: 'Mobilfunk Business' },
    { id: '10', date: '2025-05-06', amount: -198.70, recipient: 'Büro & Co', category: 'Bürobedarf', description: 'Büromaterial' },
  ];

  const categories = ['Alle', 'Energie', 'Kommunikation', 'Versicherung', 'Transport', 'Software', 'Einkauf', 'Bürobedarf'];

  // Filter transactions based on search and filter criteria
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      const matchesSearch = transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || selectedCategory === 'Alle' || transaction.category === selectedCategory;
      const matchesDateFrom = dateFrom === '' || transaction.date >= dateFrom;
      const matchesDateTo = dateTo === '' || transaction.date <= dateTo;
      
      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [searchTerm, selectedCategory, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || dateFrom || dateTo;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Energie': 'bg-yellow-100 text-yellow-800',
      'Kommunikation': 'bg-blue-100 text-blue-800',
      'Versicherung': 'bg-purple-100 text-purple-800',
      'Transport': 'bg-green-100 text-green-800',
      'Software': 'bg-indigo-100 text-indigo-800',
      'Einkauf': 'bg-orange-100 text-orange-800',
      'Bürobedarf': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      {connectedBank && transactionsImported && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Transaktionen durchsuchen</h4>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter {hasActiveFilters && <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Aktiv</span>}
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nach Empfänger oder Beschreibung suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category === 'Alle' ? '' : category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Von Datum
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Bis Datum
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {filteredTransactions.length} von {allTransactions.length} Transaktionen gefunden
                  </div>
                  <button
                    onClick={clearFilters}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Filter zurücksetzen
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bank Connection */}
      {!connectedBank && (
        <BankConnection onConnectionComplete={onBankConnection} />
      )}

      {/* Transaction Import */}
      {connectedBank && (
        <TransactionImport 
          onOptimizationFound={onOptimizationFound}
          autoImport={transactionsImported}
          filteredTransactions={hasActiveFilters ? filteredTransactions : undefined}
          showFilters={hasActiveFilters}
        />
      )}

      {/* Provider Comparison */}
      {showProviderComparison && (
        <ProviderComparison onRecommendationAccepted={onRecommendationAccepted} />
      )}

      {/* Success Summary */}
      {acceptedRecommendation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-800">
                Kostenoptimierung erfolgreich abgeschlossen
              </h3>
              <p className="text-green-700">
                Optimierungspotenzial identifiziert und Empfehlung übernommen
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Analysierte Transaktionen</h4>
              <p className="text-2xl font-bold text-blue-600">30</p>
              <p className="text-sm text-gray-600">Letzte 30 Tage</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Erkannte Optimierungen</h4>
              <p className="text-2xl font-bold text-yellow-600">1</p>
              <p className="text-sm text-gray-600">Stromanbieter</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Potenzielle Ersparnis</h4>
              <p className="text-2xl font-bold text-green-600">210 €</p>
              <p className="text-sm text-gray-600">Pro Jahr</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostOptimizationTab;