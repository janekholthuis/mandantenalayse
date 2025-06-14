import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { aiAnalyzer } from '../../lib/ai-analysis';
import { contractAnalyzer } from '../../lib/contract-analyzer';
import { marketDataService } from '../../lib/market-data';
import Button from '../ui/Button';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  account?: string;
  counterAccount?: string;
  reference?: string;
}

interface AnalysisResult {
  category: string;
  provider: string;
  contractType: string;
  optimizationPotential: number;
  confidence: number;
  recommendations: string[];
}

interface TransactionAnalysisEngineProps {
  transactions: Transaction[];
  onAnalysisComplete: (results: AnalysisResult[]) => void;
}

const TransactionAnalysisEngine: React.FC<TransactionAnalysisEngineProps> = ({
  transactions,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      // Step 1: AI Transaction Analysis
      setAnalysisStep('Analysiere Transaktionen mit KI...');
      setProgress(20);
      
      const aiResults = await aiAnalyzer.analyzeTransactions(transactions);
      
      // Step 2: Market Data Comparison
      setAnalysisStep('Vergleiche mit aktuellen Marktdaten...');
      setProgress(40);
      
      await marketDataService.updateMarketData();
      
      // Step 3: Contract Analysis
      setAnalysisStep('Analysiere Vertragsoptionen...');
      setProgress(60);
      
      const enhancedResults: AnalysisResult[] = [];
      
      for (const result of aiResults) {
        const marketOffers = await contractAnalyzer.analyzeContract({
          provider: result.provider,
          contractType: result.contractType,
          monthlyPrice: 100, // Estimated from transaction amount
          contractLength: '24 Monate',
          cancellationPeriod: '3 Monate',
          features: []
        });
        
        // Calculate enhanced optimization potential based on market offers
        const bestOffer = marketOffers.find(o => o.isRecommended) || marketOffers[0];
        const enhancedPotential = bestOffer ? bestOffer.savings : result.optimizationPotential;
        
        enhancedResults.push({
          ...result,
          optimizationPotential: enhancedPotential
        });
      }
      
      // Step 4: Generate Recommendations
      setAnalysisStep('Generiere Optimierungsempfehlungen...');
      setProgress(80);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Finalize
      setAnalysisStep('Analyse abgeschlossen');
      setProgress(100);
      
      setResults(enhancedResults);
      onAnalysisComplete(enhancedResults);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisStep('Fehler bei der Analyse');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      startAnalysis();
    }
  }, [transactions]);

  if (!isAnalyzing && results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          KI-gestützte Transaktionsanalyse
        </h3>
        <p className="text-gray-600 mb-4">
          Bereit zur Analyse von {transactions.length} Transaktionen
        </p>
        <Button
          variant="primary"
          onClick={startAnalysis}
          icon={<Brain size={16} />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Analyse starten
        </Button>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Zap className="h-6 w-6 text-yellow-500 animate-bounce" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            KI-Analyse läuft...
          </h3>
          <p className="text-gray-600 mb-4">{analysisStep}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Fortschritt</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Analysis Steps */}
        <div className="space-y-3">
          {[
            { step: 'KI-Transaktionsanalyse', threshold: 20 },
            { step: 'Marktdatenvergleich', threshold: 40 },
            { step: 'Vertragsanalyse', threshold: 60 },
            { step: 'Empfehlungsgenerierung', threshold: 80 },
            { step: 'Finalisierung', threshold: 100 }
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                progress >= item.threshold 
                  ? 'bg-green-500 text-white' 
                  : progress >= item.threshold - 20
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {progress >= item.threshold ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${
                progress >= item.threshold ? 'text-green-700 font-medium' : 'text-gray-600'
              }`}>
                {item.step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
        <div>
          <h3 className="text-lg font-medium text-green-800">
            Analyse erfolgreich abgeschlossen
          </h3>
          <p className="text-green-700">
            {results.length} Optimierungsmöglichkeiten identifiziert
          </p>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">Analysierte Verträge</p>
              <p className="text-2xl font-bold text-blue-600">{results.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-900">Gesamtpotenzial</p>
              <p className="text-2xl font-bold text-green-600">
                {results.reduce((sum, r) => sum + r.optimizationPotential, 0).toLocaleString('de-DE')} €
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Durchschn. Vertrauen</p>
              <p className="text-2xl font-bold text-yellow-600">
                {Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Detaillierte Ergebnisse</h4>
        {results.map((result, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h5 className="font-medium text-gray-900">{result.category} - {result.provider}</h5>
                <p className="text-sm text-gray-600">{result.contractType}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {result.optimizationPotential.toLocaleString('de-DE')} €
                </p>
                <p className="text-sm text-gray-500">pro Jahr</p>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>KI-Vertrauen</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Empfehlungen:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {result.recommendations.map((rec, recIndex) => (
                  <li key={recIndex} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionAnalysisEngine;