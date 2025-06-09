import React, { useState } from 'react';
import { Download, Eye, TrendingDown, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  category: string;
  description: string;
}

interface TransactionImportProps {
  onOptimizationFound: (transaction: Transaction) => void;
  autoImport?: boolean;
  filteredTransactions?: Transaction[];
  showFilters?: boolean;
}

const TransactionImport: React.FC<TransactionImportProps> = ({ 
  onOptimizationFound, 
  autoImport = false,
  filteredTransactions,
  showFilters = false
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const demoTransactions: Transaction[] = [
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
    { id: '11', date: '2025-05-05', amount: -67.80, recipient: 'Google Germany', category: 'Marketing', description: 'Google Ads' },
    { id: '12', date: '2025-05-04', amount: -156.90, recipient: 'Steuerberater Schmidt', category: 'Beratung', description: 'Steuerberatung Q2' },
    { id: '13', date: '2025-05-03', amount: -89.50, recipient: 'Lichtblick GmbH', category: 'Energie', description: 'Stromabschlag März' },
    { id: '14', date: '2025-05-02', amount: -234.20, recipient: 'Bürohaus Zentrum', category: 'Miete', description: 'Büromiete Mai' },
    { id: '15', date: '2025-05-01', amount: -78.40, recipient: 'Deutsche Post', category: 'Versand', description: 'Portokosten' },
    { id: '16', date: '2025-04-30', amount: -145.60, recipient: 'Reinigungsservice Plus', category: 'Service', description: 'Büroreinigung' },
    { id: '17', date: '2025-04-29', amount: -67.90, recipient: 'Café Central', category: 'Bewirtung', description: 'Geschäftsessen' },
    { id: '18', date: '2025-04-28', amount: -89.50, recipient: 'Lichtblick GmbH', category: 'Energie', description: 'Stromabschlag Februar' },
    { id: '19', date: '2025-04-27', amount: -123.80, recipient: 'IT-Service GmbH', category: 'IT-Service', description: 'Server Wartung' },
    { id: '20', date: '2025-04-26', amount: -56.70, recipient: 'Druckerei Modern', category: 'Marketing', description: 'Visitenkarten' },
    { id: '21', date: '2025-04-25', amount: -189.30, recipient: 'Rechtsanwalt Weber', category: 'Beratung', description: 'Rechtsberatung' },
    { id: '22', date: '2025-04-24', amount: -78.90, recipient: 'Shell Tankstelle', category: 'Transport', description: 'Kraftstoff' },
    { id: '23', date: '2025-04-23', amount: -234.50, recipient: 'Amazon Deutschland', category: 'Einkauf', description: 'IT-Equipment' },
    { id: '24', date: '2025-04-22', amount: -89.50, recipient: 'Lichtblick GmbH', category: 'Energie', description: 'Stromabschlag Januar' },
    { id: '25', date: '2025-04-21', amount: -145.20, recipient: 'Versicherung Direkt', category: 'Versicherung', description: 'Betriebshaftpflicht' },
    { id: '26', date: '2025-04-20', amount: -67.80, recipient: 'Telekom Deutschland', category: 'Kommunikation', description: 'Festnetz Business' },
    { id: '27', date: '2025-04-19', amount: -156.40, recipient: 'Buchhaltung Pro', category: 'Beratung', description: 'Buchhaltungsservice' },
    { id: '28', date: '2025-04-18', amount: -89.50, recipient: 'Lichtblick GmbH', category: 'Energie', description: 'Stromabschlag Dezember 2024' },
    { id: '29', date: '2025-04-17', amount: -123.60, recipient: 'Werbung & Design', category: 'Marketing', description: 'Website Design' },
    { id: '30', date: '2025-04-16', amount: -78.30, recipient: 'Büro Express', category: 'Bürobedarf', description: 'Büromaterial Nachbestellung' }
  ];

  const handleImport = async () => {
    setIsImporting(true);
    
    // Simulate import process
    for (let i = 0; i < demoTransactions.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setTransactions(prev => [...prev, demoTransactions[i]]);
      
      // Trigger optimization detection for Lichtblick transactions
      if (demoTransactions[i].recipient === 'Lichtblick GmbH' && i === 0) {
        setTimeout(() => {
          onOptimizationFound(demoTransactions[i]);
        }, 500);
      }
    }
    
    setIsImporting(false);
  };

  // Auto-import when autoImport prop is true
  React.useEffect(() => {
    if (autoImport && transactions.length === 0 && !isImporting) {
      handleImport();
    }
  }, [autoImport]);

  // Use filtered transactions if provided, otherwise use all transactions
  const displayTransactions = filteredTransactions || transactions;

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
      'Marketing': 'bg-pink-100 text-pink-800',
      'Beratung': 'bg-red-100 text-red-800',
      'Miete': 'bg-cyan-100 text-cyan-800',
      'Service': 'bg-teal-100 text-teal-800',
      'Bewirtung': 'bg-amber-100 text-amber-800',
      'IT-Service': 'bg-violet-100 text-violet-800',
      'Versand': 'bg-lime-100 text-lime-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Download className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Transaktionen</h3>
        </div>
        <Button
          variant="primary"
          onClick={handleImport}
          disabled={isImporting || transactions.length > 0 || autoImport}
          isLoading={isImporting}
        >
          {transactions.length > 0 
            ? 'Importiert' 
            : autoImport 
            ? 'Importiere automatisch...' 
            : '30 Transaktionen importieren'
          }
        </Button>
      </div>

      {transactions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Transaktionen ({displayTransactions.length}{filteredTransactions ? ` von ${transactions.length}` : ''})
            </h4>
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              {showFilters && filteredTransactions ? 'Gefiltert' : 'Letzte 30 Tage'}
            </div>
          </div>

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
                {displayTransactions.map((transaction) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end">
                        {transaction.amount < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        )}
                        <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {displayTransactions.length === 0 && transactions.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Keine Transaktionen gefunden</p>
                <p className="text-sm">Versuchen Sie andere Suchkriterien</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionImport;