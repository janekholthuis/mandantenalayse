import React, { useState, useMemo } from 'react';
import { Search, Filter, Upload, Calendar, ChevronDown, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import DocumentUploadPopup from '../components/cost-analysis/DocumentUploadPopup';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  category: string;
  description: string;
}

interface Optimization {
  id: string;
  title: string;
  description: string;
  status: 'document-missing' | 'send-offers' | 'waiting-for-client' | 'completed';
  potentialSavings: number;
  requirements: string[];
  missingDocuments?: string[];
}

const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'optimizations'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedOptimization, setSelectedOptimization] = useState<Optimization | null>(null);

  // Mock data
  const transactions: Transaction[] = [
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

  const optimizations: Optimization[] = [
    {
      id: 'stromvertrag',
      title: 'Stromvertrag optimieren',
      description: 'Wechsel zu günstigerem Stromanbieter mit besseren Konditionen',
      status: 'document-missing',
      potentialSavings: 210,
      requirements: ['Aktueller Stromvertrag', 'Jahresverbrauch'],
      missingDocuments: ['Stromvertrag', 'Letzte Stromrechnung']
    },
    {
      id: 'versicherung',
      title: 'Betriebshaftpflicht',
      description: 'Überprüfung der Betriebshaftpflichtversicherung auf Optimierungspotenzial',
      status: 'send-offers',
      potentialSavings: 150,
      requirements: ['Versicherungspolice', 'Risikoanalyse']
    },
    {
      id: 'sachbezug',
      title: 'Sachbezug',
      description: 'Steuerfreier oder pauschalversteuerter geldwerter Vorteil bis zu 50 € pro Monat',
      status: 'completed',
      potentialSavings: 600,
      requirements: ['Mitarbeiterverträge', 'Dokumentation']
    }
  ];

  const categories = ['Alle', 'Energie', 'Kommunikation', 'Versicherung', 'Transport', 'Software', 'Einkauf', 'Bürobedarf'];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || selectedCategory === 'Alle' || transaction.category === selectedCategory;
      const matchesDateFrom = dateFrom === '' || transaction.date >= dateFrom;
      const matchesDateTo = dateTo === '' || transaction.date <= dateTo;
      
      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [transactions, searchTerm, selectedCategory, dateFrom, dateTo]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'send-offers':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'waiting-for-client':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'document-missing':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'send-offers':
        return 'Angebote schicken';
      case 'waiting-for-client':
        return 'Warten auf Mandant';
      case 'document-missing':
        return 'Dokument fehlend';
      default:
        return 'Unbekannt';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'send-offers':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waiting-for-client':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'document-missing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDocumentUpload = (optimization: Optimization) => {
    setSelectedOptimization(optimization);
    setShowUploadPopup(true);
  };

  const handleUploadComplete = (filename: string, type: string) => {
    setShowUploadPopup(false);
    setSelectedOptimization(null);
    
    // Update the optimization status based on the action
    if (selectedOptimization) {
      // In a real app, you would update the state here or make an API call
      if (type === 'vertrag') {
        console.log('Updated optimization status to completed for:', selectedOptimization.id);
      } else {
        console.log('Updated optimization status to', type, 'for:', selectedOptimization.id);
      }
    }
  };

  const handleShowOffers = (optimizationId: string) => {
    // Update optimization status to send-offers when "Angebote anzeigen" is clicked
    // Here you would normally update the state or make an API call
    console.log('Updated optimization status to send-offers for:', optimizationId);
  };

  const groupedOptimizations = {
    'document-missing': optimizations.filter(opt => opt.status === 'document-missing'),
    'send-offers': optimizations.filter(opt => opt.status === 'send-offers'),
    'waiting-for-client': optimizations.filter(opt => opt.status === 'waiting-for-client'),
    'completed': optimizations.filter(opt => opt.status === 'completed')
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaktionen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verwalten Sie Transaktionen und Optimierungen
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Transaktionen
              </div>
            </button>
            <button
              onClick={() => setActiveTab('optimizations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'optimizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Optimierungen
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
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

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

                {/* Date Range */}
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Von"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bis"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <Button
                  variant="primary"
                  icon={<Upload size={16} />}
                  onClick={() => setShowUploadPopup(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Neue Transaktionen hochladen
                </Button>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empfänger
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beschreibung
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategorie
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Betrag
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString('de-DE')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.recipient}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                          {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Transaktionen gefunden</h3>
                  <p className="text-gray-500">
                    Passen Sie Ihre Suchkriterien an oder laden Sie neue Transaktionen hoch.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Optimizations Tab */}
          {activeTab === 'optimizations' && (
            <div className="space-y-6">
              {/* Document Missing */}
              {groupedOptimizations['document-missing'].length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Dokument fehlend ({groupedOptimizations['document-missing'].length})
                  </h3>
                  <div className="space-y-4">
                    {groupedOptimizations['document-missing'].map((optimization) => (
                      <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-medium text-gray-900 mr-3">
                                {optimization.title}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(optimization.status)}`}>
                                {getStatusIcon(optimization.status)}
                                <span className="ml-1">{getStatusText(optimization.status)}</span>
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{optimization.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">
                                Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
                              </div>
                            </div>
                            {optimization.missingDocuments && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-red-700 mb-1">Fehlende Dokumente:</p>
                                <ul className="text-sm text-red-600 list-disc list-inside">
                                  {optimization.missingDocuments.map((doc, index) => (
                                    <li key={index}>{doc}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <Button
                              variant="primary"
                              onClick={() => handleDocumentUpload(optimization)}
                              icon={<Upload size={16} />}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Dokument hochladen
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Offers */}
              {groupedOptimizations['send-offers'].length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    Angebote schicken ({groupedOptimizations['send-offers'].length})
                  </h3>
                  <div className="space-y-4">
                    {groupedOptimizations['send-offers'].map((optimization) => (
                      <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-medium text-gray-900 mr-3">
                                {optimization.title}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(optimization.status)}`}>
                                {getStatusIcon(optimization.status)}
                                <span className="ml-1">{getStatusText(optimization.status)}</span>
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{optimization.description}</p>
                            <div className="text-sm text-gray-500">
                              Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              variant="primary"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Angebotszusammenfassung senden
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Waiting for Client */}
              {groupedOptimizations['waiting-for-client'].length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    Warten auf Mandant ({groupedOptimizations['waiting-for-client'].length})
                  </h3>
                  <div className="space-y-4">
                    {groupedOptimizations['waiting-for-client'].map((optimization) => (
                      <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-medium text-gray-900 mr-3">
                                {optimization.title}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(optimization.status)}`}>
                                {getStatusIcon(optimization.status)}
                                <span className="ml-1">{getStatusText(optimization.status)}</span>
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{optimization.description}</p>
                            <div className="text-sm text-gray-500">
                              Potenzielle Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              variant="primary"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Optimierung anwenden
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed */}
              {groupedOptimizations['completed'].length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Abgeschlossen ({groupedOptimizations['completed'].length})
                  </h3>
                  <div className="space-y-4">
                    {groupedOptimizations['completed'].map((optimization) => (
                      <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm opacity-75">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-medium text-gray-900 mr-3">
                                {optimization.title}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(optimization.status)}`}>
                                {getStatusIcon(optimization.status)}
                                <span className="ml-1">{getStatusText(optimization.status)}</span>
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{optimization.description}</p>
                            <div className="text-sm text-gray-500">
                              Erreichte Einsparung: <span className="font-medium text-green-600">{formatCurrency(optimization.potentialSavings)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {optimizations.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Optimierungen gefunden</h3>
                  <p className="text-gray-500">
                    Führen Sie eine Analyse durch, um Optimierungsmöglichkeiten zu identifizieren.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Upload Popup */}
      {showUploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" id="upload-popup-container">
          <div className="bg-white rounded-lg transition-all duration-300" id="upload-popup-content">
            <DocumentUploadPopup 
              onUploadComplete={handleUploadComplete}
              onClose={() => {
                setShowUploadPopup(false);
                setSelectedOptimization(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;