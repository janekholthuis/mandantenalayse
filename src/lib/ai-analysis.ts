import { OpenAI } from 'openai';

// Note: In production, this should be handled via a secure backend API
// For demo purposes, we'll simulate AI analysis
interface TransactionAnalysis {
  category: string;
  provider: string;
  contractType: string;
  optimizationPotential: number;
  confidence: number;
  recommendations: string[];
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  account?: string;
  counterAccount?: string;
  reference?: string;
}

export class AITransactionAnalyzer {
  private static instance: AITransactionAnalyzer;
  
  private constructor() {}
  
  static getInstance(): AITransactionAnalyzer {
    if (!AITransactionAnalyzer.instance) {
      AITransactionAnalyzer.instance = new AITransactionAnalyzer();
    }
    return AITransactionAnalyzer.instance;
  }

  async analyzeTransactions(transactions: Transaction[]): Promise<TransactionAnalysis[]> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analyses: TransactionAnalysis[] = [];
    
    for (const transaction of transactions) {
      const analysis = this.analyzeTransaction(transaction);
      if (analysis) {
        analyses.push(analysis);
      }
    }
    
    return analyses;
  }

  private analyzeTransaction(transaction: Transaction): TransactionAnalysis | null {
    const description = transaction.description.toLowerCase();
    const amount = Math.abs(transaction.amount);
    
    // Energy providers
    if (this.isEnergyProvider(description)) {
      return {
        category: 'Energie',
        provider: this.extractProvider(description, 'energy'),
        contractType: 'Stromvertrag',
        optimizationPotential: this.calculateEnergyOptimization(amount),
        confidence: 0.9,
        recommendations: [
          'Wechsel zu günstigerem Ökostromanbieter',
          'Überprüfung der Vertragslaufzeit',
          'Analyse des Verbrauchsverhaltens'
        ]
      };
    }
    
    // Telecom providers
    if (this.isTelecomProvider(description)) {
      return {
        category: 'Kommunikation',
        provider: this.extractProvider(description, 'telecom'),
        contractType: 'Telekommunikation',
        optimizationPotential: this.calculateTelecomOptimization(amount),
        confidence: 0.85,
        recommendations: [
          'Bündel-Angebote für Internet + Telefon',
          'Überprüfung der Datenvolumen',
          'Vergleich mit Discount-Anbietern'
        ]
      };
    }
    
    // Insurance providers
    if (this.isInsuranceProvider(description)) {
      return {
        category: 'Versicherung',
        provider: this.extractProvider(description, 'insurance'),
        contractType: 'Versicherung',
        optimizationPotential: this.calculateInsuranceOptimization(amount),
        confidence: 0.8,
        recommendations: [
          'Vergleich der Deckungssummen',
          'Überprüfung der Selbstbeteiligung',
          'Bündelung mehrerer Versicherungen'
        ]
      };
    }
    
    // Software subscriptions
    if (this.isSoftwareProvider(description)) {
      return {
        category: 'Software',
        provider: this.extractProvider(description, 'software'),
        contractType: 'Software-Lizenz',
        optimizationPotential: this.calculateSoftwareOptimization(amount),
        confidence: 0.75,
        recommendations: [
          'Überprüfung der Nutzungsintensität',
          'Vergleich mit Alternativen',
          'Jährliche vs. monatliche Zahlung'
        ]
      };
    }
    
    return null;
  }

  private isEnergyProvider(description: string): boolean {
    const energyKeywords = [
      'strom', 'energie', 'stadtwerke', 'eon', 'rwe', 'vattenfall', 
      'lichtblick', 'naturstrom', 'gas', 'elektrizität'
    ];
    return energyKeywords.some(keyword => description.includes(keyword));
  }

  private isTelecomProvider(description: string): boolean {
    const telecomKeywords = [
      'telekom', 'vodafone', 'o2', 'telefonica', 'internet', 'telefon',
      'mobilfunk', 'dsl', 'glasfaser', 'handy', 'smartphone'
    ];
    return telecomKeywords.some(keyword => description.includes(keyword));
  }

  private isInsuranceProvider(description: string): boolean {
    const insuranceKeywords = [
      'versicherung', 'allianz', 'axa', 'generali', 'huk', 'ergo',
      'haftpflicht', 'kasko', 'rechtsschutz', 'berufsunfähigkeit'
    ];
    return insuranceKeywords.some(keyword => description.includes(keyword));
  }

  private isSoftwareProvider(description: string): boolean {
    const softwareKeywords = [
      'microsoft', 'adobe', 'google', 'amazon', 'software', 'lizenz',
      'office', 'cloud', 'saas', 'subscription', 'abo'
    ];
    return softwareKeywords.some(keyword => description.includes(keyword));
  }

  private extractProvider(description: string, category: string): string {
    const providers = {
      energy: ['E.ON', 'RWE', 'Vattenfall', 'Lichtblick', 'Naturstrom', 'Stadtwerke'],
      telecom: ['Telekom', 'Vodafone', 'O2', 'Telefónica'],
      insurance: ['Allianz', 'AXA', 'Generali', 'HUK-COBURG', 'ERGO'],
      software: ['Microsoft', 'Adobe', 'Google', 'Amazon']
    };
    
    const categoryProviders = providers[category as keyof typeof providers] || [];
    
    for (const provider of categoryProviders) {
      if (description.toLowerCase().includes(provider.toLowerCase())) {
        return provider;
      }
    }
    
    return 'Unbekannter Anbieter';
  }

  private calculateEnergyOptimization(amount: number): number {
    // Energy optimization typically saves 15-25%
    return Math.round(amount * 12 * 0.2); // 20% annual savings
  }

  private calculateTelecomOptimization(amount: number): number {
    // Telecom optimization typically saves 10-30%
    return Math.round(amount * 12 * 0.25); // 25% annual savings
  }

  private calculateInsuranceOptimization(amount: number): number {
    // Insurance optimization typically saves 10-20%
    return Math.round(amount * 12 * 0.15); // 15% annual savings
  }

  private calculateSoftwareOptimization(amount: number): number {
    // Software optimization typically saves 20-40%
    return Math.round(amount * 12 * 0.3); // 30% annual savings
  }

  async generateOptimizationReport(analyses: TransactionAnalysis[]): Promise<string> {
    const totalPotential = analyses.reduce((sum, analysis) => sum + analysis.optimizationPotential, 0);
    const categories = [...new Set(analyses.map(a => a.category))];
    
    return `
# Kostenoptimierungs-Analyse

## Zusammenfassung
- **Analysierte Verträge:** ${analyses.length}
- **Kategorien:** ${categories.join(', ')}
- **Gesamtes Einsparpotenzial:** ${totalPotential.toLocaleString('de-DE')} € pro Jahr

## Detailanalyse
${analyses.map(analysis => `
### ${analysis.category} - ${analysis.provider}
- **Optimierungspotenzial:** ${analysis.optimizationPotential.toLocaleString('de-DE')} € p.a.
- **Vertrauen:** ${Math.round(analysis.confidence * 100)}%
- **Empfehlungen:**
${analysis.recommendations.map(rec => `  - ${rec}`).join('\n')}
`).join('\n')}

## Nächste Schritte
1. Verträge der identifizierten Anbieter sammeln
2. Marktvergleich durchführen
3. Wechseloptionen prüfen
4. Kündigungsfristen beachten
    `;
  }
}

// Export singleton instance
export const aiAnalyzer = AITransactionAnalyzer.getInstance();