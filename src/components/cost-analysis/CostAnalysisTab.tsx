import React, { useState } from 'react';
import { BarChart3, CheckCircle, TrendingDown, Calculator, Building2, Upload, Brain } from 'lucide-react';
import TransactionUpload from './TransactionUpload';
import TransactionAnalysisEngine from './TransactionAnalysisEngine';
import OptimizationPopup from './OptimizationPopup';
import DocumentUploadPopup from './DocumentUploadPopup';
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
  const [transactionsUploaded, setTransactionsUploaded] = useState(false);
  const [uploadedTransactions, setUploadedTransactions] = useState<any[]>([]);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [optimizationTransaction, setOptimizationTransaction] = useState<Transaction | null>(null);
  const [showOptimizationPopup, setShowOptimizationPopup] = useState(false);
  const [showDocumentUploadPopup, setShowDocumentUploadPopup] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<{ filename: string; type: string } | null>(null);
  const [showProviderComparison, setShowProviderComparison] = useState(false);
  const [acceptedRecommendation, setAcceptedRecommendation] = useState<Provider | null>(null);

  const handleTransactionUpload = (transactions: any[]) => {
    setUploadedTransactions(transactions);
    setTransactionsUploaded(true);
    
    // Notify parent component about transaction upload
    if (onBankConnection) {
      onBankConnection();
    }
  };

  const handleAnalysisComplete = (results: any[]) => {
    setAnalysisResults(results);
    setAnalysisCompleted(true);
    
    // Update cost optimizations based on analysis results
    const newOptimizations = results.map(result => ({
      id: result.category.toLowerCase().replace(/\s+/g, '-'),
      title: `${result.category} optimieren`,
      description: `Optimierung für ${result.provider} - ${result.contractType}`,
      status: 'send-offers',
      potentialSavings: result.optimizationPotential,
      requirements: result.recommendations,
      currentProvider: result.provider
    }));
    
    // This would update the parent component's optimization list
    // For now, we'll just log the results
    console.log('Analysis results:', results);
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

  // If no transactions are uploaded, show only the upload component
  if (!transactionsUploaded) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Upload className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Kostenanalyse</h3>
          </div>
          <p className="text-gray-600">
            Laden Sie Ihre Buchungsdaten hoch, um automatisch Optimierungspotenziale in Ihren Ausgaben zu identifizieren.
          </p>
        </div>

        <TransactionUpload onUploadComplete={handleTransactionUpload} />
      </div>
    );
  }

  // After transaction upload, show the AI analysis engine
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Brain className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">KI-gestützte Kostenanalyse</h2>
        </div>
        <p className="text-gray-600">
          {analysisCompleted 
            ? `Analyse von ${uploadedTransactions.length} Buchungen abgeschlossen. ${analysisResults.length} Optimierungen gefunden.`
            : `Analysiere ${uploadedTransactions.length} hochgeladene Buchungen mit künstlicher Intelligenz.`
          }
        </p>
      </div>

      {/* AI Analysis Engine */}
      {!analysisCompleted && (
        <TransactionAnalysisEngine 
          transactions={uploadedTransactions}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {/* Results - Show Calculator Tab after analysis */}
      {analysisCompleted && (
        <CostCalculatorTab onOptimizationStatusChange={onOptimizationStatusChange} />
      )}

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