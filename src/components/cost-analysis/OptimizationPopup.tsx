import React from 'react';
import { Search, X, Zap, TrendingDown, Upload } from 'lucide-react';
import Button from '../ui/Button';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  category: string;
  description: string;
}

interface OptimizationPopupProps {
  transaction: Transaction;
  onClose: () => void;
  onUploadDocument: () => void;
}

const OptimizationPopup: React.FC<OptimizationPopupProps> = ({ 
  transaction, 
  onClose, 
  onUploadDocument 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-pulse-once">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Search className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🔍 Optimierungspotenzial erkannt
          </h3>
          <p className="text-gray-600">
            Stromanbieter-Optimierung möglich
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Erkannte Transaktion:</span>
            <span className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString('de-DE')}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{transaction.recipient}</span>
            <span className="text-red-600 font-medium">
              {Math.abs(transaction.amount).toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })}
            </span>
          </div>
          <p className="text-sm text-gray-600">{transaction.description}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <Zap className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">Potenzielle Einsparung</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Durch Anbieterwechsel:</span>
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="font-bold text-green-600">bis zu 210 €/Jahr</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={onUploadDocument}
            icon={<Upload size={16} />}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Stromvertrag hochladen
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full"
          >
            Später analysieren
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationPopup;