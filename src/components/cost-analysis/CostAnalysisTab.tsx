import React, { useState } from 'react';
import { BarChart3, CheckCircle, TrendingDown, Calculator, Building2 } from 'lucide-react';
import BankConnection from './BankConnection';
import TransactionImport from './TransactionImport';
import OptimizationPopup from './OptimizationPopup';
import DocumentUploadPopup from './DocumentUploadPopup';
import DocumentUpload from './DocumentUpload';
import ProviderComparison from './ProviderComparison';
import CostOptimizationTab from './CostOptimizationTab';
import CostCalculatorTab from './CostCalculatorTab';

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

interface CostAnalysisTabProps {
  onBankConnection?: () => void;
  onDocumentUploaded?: () => void;
  onEmailSent?: () => void;
  onOptimizationStatusChange?: (optimizationId: string, newStatus: string) => void;
}

const CostAnalysisTab: React.FC<CostAnalysisTabProps> = ({ 
  onBankConnection, 
  onDocumentUploaded, 
  onEmailSent,
  onOptimizationStatusChange 
}) => {
  const [activeTab, setActiveTab] = useState<'optimization' | 'calculator'>('optimization');
  const [connectedBank, setConnectedBank] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [transactionsImported, setTransactionsImported] = useState(false);
  const [optimizationTransaction, setOptimizationTransaction] = useState<Transaction | null>(null);
  const [showOptimizationPopup, setShowOptimizationPopup] = useState(false);
  const [showDocumentUploadPopup, setShowDocumentUploadPopup] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<{ filename: string; type: string } | null>(null);
  const [showProviderComparison, setShowProviderComparison] = useState(false);
  const [acceptedRecommendation, setAcceptedRecommendation] = useState<Provider | null>(null);

  const handleBankConnection = (bank: string, from: string, to: string) => {
    setConnectedBank(bank);
    setFromDate(from);
    setToDate(to);
   // Notify parent component about bank connection
   if (onBankConnection) {
     onBankConnection();
   }
    // Automatically start transaction import after bank connection
    setTimeout(() => {
      setTransactionsImported(true);
    }, 500);
  };

  const handleOptimizationFound = (transaction: Transaction) => {
    setOptimizationTransaction(transaction);
    setShowOptimizationPopup(true);
  };

  const handleUploadDocument = () => {
    setShowOptimizationPopup(false);
    setShowDocumentUploadPopup(true);
  };

  const handleDocumentUploadComplete = (filename: string, type: string) => {
    setUploadedDocument({ filename, type });
    setShowDocumentUploadPopup(false);
    
    // Notify parent component when document is uploaded
    if (onDocumentUploaded) {
      onDocumentUploaded();
    }
    
    // Update optimization status when document is uploaded
    if (onOptimizationStatusChange) {
      onOptimizationStatusChange('stromvertrag', 'send-offers');
    }
    
    // Trigger status change to 'review-offers' immediately after document upload
    // This simulates the optimization status being updated
    
    setTimeout(() => {
      setShowProviderComparison(true);
    }, 1000);
  };

  const handleEmailSent = () => {
    // Notify parent component when email is sent
    if (onEmailSent) {
      onEmailSent();
    }
    
    // Update optimization status when email is sent
    if (onOptimizationStatusChange) {
      onOptimizationStatusChange('stromvertrag', 'waiting-for-client');
    }
  };

  const handleRecommendationAccepted = (provider: Provider) => {
    setAcceptedRecommendation(provider);
    setShowProviderComparison(false);
    
    // This would trigger the status change to 'implemented' in a real application
    // The parent component should handle this status update
  };

  // If no bank is connected, show only the bank connection component
  if (!connectedBank) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Kostenanalyse</h3>
          </div>
          <p className="text-gray-600">
            Verbinden Sie Ihr Bankkonto, um automatisch Optimierungspotenziale in Ihren Ausgaben zu identifizieren.
          </p>
        </div>

        <BankConnection onConnectionComplete={handleBankConnection} />
      </div>
    );
  }

  // After bank connection, show the tabs
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kostenoptimierung</h2>
        <p className="text-gray-600">
          Analysieren Sie Ihre Ausgaben und identifizieren Sie Einsparpotenziale.
        </p>
      </div>

      {/* Main Content - Show Calculator Tab by default */}
      <CostCalculatorTab onOptimizationStatusChange={onOptimizationStatusChange} />

      {/* Optimization Popup */}
      {showOptimizationPopup && optimizationTransaction && (
        <OptimizationPopup
          transaction={optimizationTransaction}
          onClose={() => setShowOptimizationPopup(false)}
          onUploadDocument={handleUploadDocument}
        />
      )}

      {/* Document Upload Popup */}
      {showDocumentUploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
            <DocumentUploadPopup 
              onUploadComplete={handleDocumentUploadComplete}
              onClose={() => setShowDocumentUploadPopup(false)}
              onEmailSent={handleEmailSent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CostAnalysisTab;