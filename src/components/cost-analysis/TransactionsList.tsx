import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingDown, TrendingUp, Calendar, Euro, Tag, ChevronDown, X } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  accountNumber: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); // 'income' | 'expense' | ''
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from transactions
  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map(t => t.category))];
    return cats.sort();
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
      const matchesType = !typeFilter || 
        (typeFilter === 'income' && transaction.amount > 0) ||
        (typeFilter === 'expense' && transaction.amount < 0);
      const matchesAmount = 
        (!amountFilter.min || Math.abs(transaction.amount) >= parseFloat(amountFilter.min)) &&
        (!amountFilter.max || Math.abs(transaction.amount) <= parseFloat(amountFilter.max));
      const matchesDate = 
        (!dateFilter.from || transaction.date >= dateFilter.from) &&
        (!dateFilter.to || transaction.date <= dateFilter.to);

      return matchesSearch && matchesCategory && matchesType && matchesAmount && matchesDate;
    });
  }, [transactions, searchTerm, categoryFilter, typeFilter, amountFilter, dateFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
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
      'Versand': 'bg-lime-100 text-lime-800',
      'Unbekannt': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setTypeFilter('');
    setAmountFilter({ min: '', max: '' });
    setDateFilter({ from: '', to: '' });
  };

  const hasActiveFilters = searchTerm || categoryFilter || typeFilter || amountFilter.min || amountFilter.max || dateFilter.from || dateFilter.to;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Transaktionen</h3>
          <p className="text-sm text-gray-500">
            {filteredTransactions.length} von {transactions.length} Transaktionen
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filter
          {hasActiveFilters && <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Aktiv</span>}
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
          placeholder="Nach Beschreibung suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Kategorie
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle Kategorien</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Art
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle</option>
                <option value="expense">Ausgaben</option>
                <option value="income">Einnahmen</option>
              </select>
            </div>

            {/* Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="inline h-4 w-4 mr-1" />
                Betrag (€)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={amountFilter.min}
                  onChange={(e) => setAmountFilter(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={amountFilter.max}
                  onChange={(e) => setAmountFilter(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Datum
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredTransactions.length} von {transactions.length} Transaktionen gefunden
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

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Betrag
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Art
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorie
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={transaction.description}>
                    {transaction.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    transaction.amount < 0 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {transaction.amount < 0 ? 'Ausgabe' : 'Einnahme'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Keine Transaktionen gefunden</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;