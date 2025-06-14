interface ContractData {
  provider: string;
  contractType: string;
  monthlyPrice: number;
  contractLength: string;
  cancellationPeriod: string;
  features: string[];
  startDate?: string;
  endDate?: string;
}

interface MarketOffer {
  id: string;
  provider: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  savings: number;
  features: string[];
  rating: number;
  isRecommended?: boolean;
  contractLength: string;
  cancellationPeriod: string;
  bonus?: number;
  specialFeatures?: string[];
}

export class ContractAnalyzer {
  private static instance: ContractAnalyzer;
  
  private constructor() {}
  
  static getInstance(): ContractAnalyzer {
    if (!ContractAnalyzer.instance) {
      ContractAnalyzer.instance = new ContractAnalyzer();
    }
    return ContractAnalyzer.instance;
  }

  async analyzeContract(contractData: ContractData): Promise<MarketOffer[]> {
    // Simulate API call to market data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (contractData.contractType.toLowerCase()) {
      case 'stromvertrag':
      case 'energie':
        return this.getEnergyOffers(contractData);
      case 'telekommunikation':
      case 'internet':
        return this.getTelecomOffers(contractData);
      case 'versicherung':
        return this.getInsuranceOffers(contractData);
      case 'software':
        return this.getSoftwareOffers(contractData);
      default:
        return [];
    }
  }

  private getEnergyOffers(currentContract: ContractData): MarketOffer[] {
    const currentYearlyPrice = currentContract.monthlyPrice * 12;
    
    return [
      {
        id: 'vattenfall-natur',
        provider: 'Vattenfall',
        name: 'Natur Strom 25',
        monthlyPrice: currentContract.monthlyPrice * 0.85,
        yearlyPrice: currentYearlyPrice * 0.85,
        savings: currentYearlyPrice * 0.15,
        features: ['100% Ökostrom', 'Preisgarantie 24 Monate', 'Online-Kundenservice'],
        rating: 4.2,
        contractLength: '24 Monate',
        cancellationPeriod: '4 Wochen',
        bonus: 75,
        specialFeatures: ['TÜV-zertifiziert', 'Klimaneutral']
      },
      {
        id: 'eon-oeko',
        provider: 'E.ON',
        name: 'ÖkoStrom Plus',
        monthlyPrice: currentContract.monthlyPrice * 0.78,
        yearlyPrice: currentYearlyPrice * 0.78,
        savings: currentYearlyPrice * 0.22,
        features: ['100% Ökostrom aus Wasserkraft', 'Preisgarantie 24 Monate', 'App-Steuerung'],
        rating: 4.7,
        isRecommended: true,
        contractLength: '24 Monate',
        cancellationPeriod: '6 Wochen',
        bonus: 100,
        specialFeatures: ['Testsieger 2025', 'CO₂-neutral']
      },
      {
        id: 'naturstrom',
        provider: 'Naturstrom AG',
        name: 'naturstrom',
        monthlyPrice: currentContract.monthlyPrice * 0.95,
        yearlyPrice: currentYearlyPrice * 0.95,
        savings: currentYearlyPrice * 0.05,
        features: ['100% echter Ökostrom', 'Förderung neuer Anlagen', 'Transparente Herkunft'],
        rating: 4.8,
        contractLength: 'Unbegrenzt',
        cancellationPeriod: '4 Wochen',
        bonus: 25,
        specialFeatures: ['Pionier seit 1998', 'Höchste Öko-Standards']
      }
    ];
  }

  private getTelecomOffers(currentContract: ContractData): MarketOffer[] {
    const currentYearlyPrice = currentContract.monthlyPrice * 12;
    
    return [
      {
        id: 'telekom-magenta',
        provider: 'Telekom',
        name: 'MagentaZuhause M',
        monthlyPrice: currentContract.monthlyPrice * 0.9,
        yearlyPrice: currentYearlyPrice * 0.9,
        savings: currentYearlyPrice * 0.1,
        features: ['50 Mbit/s', 'Telefon-Flat', 'MagentaTV', '24/7 Service'],
        rating: 4.3,
        contractLength: '24 Monate',
        cancellationPeriod: '3 Monate',
        bonus: 50
      },
      {
        id: 'vodafone-cable',
        provider: 'Vodafone',
        name: 'Red Internet & Phone 100 Cable',
        monthlyPrice: currentContract.monthlyPrice * 0.75,
        yearlyPrice: currentYearlyPrice * 0.75,
        savings: currentYearlyPrice * 0.25,
        features: ['100 Mbit/s', 'Telefon-Flat', 'GigaTV', 'WLAN-Router'],
        rating: 4.1,
        isRecommended: true,
        contractLength: '24 Monate',
        cancellationPeriod: '3 Monate',
        bonus: 100
      }
    ];
  }

  private getInsuranceOffers(currentContract: ContractData): MarketOffer[] {
    const currentYearlyPrice = currentContract.monthlyPrice * 12;
    
    return [
      {
        id: 'huk-betrieb',
        provider: 'HUK-COBURG',
        name: 'Betriebshaftpflicht Komfort',
        monthlyPrice: currentContract.monthlyPrice * 0.85,
        yearlyPrice: currentYearlyPrice * 0.85,
        savings: currentYearlyPrice * 0.15,
        features: ['10 Mio. € Deckung', 'Rechtsschutz inklusive', 'Online-Verwaltung'],
        rating: 4.4,
        isRecommended: true,
        contractLength: '12 Monate',
        cancellationPeriod: '3 Monate'
      },
      {
        id: 'allianz-business',
        provider: 'Allianz',
        name: 'Business Protect',
        monthlyPrice: currentContract.monthlyPrice * 0.92,
        yearlyPrice: currentYearlyPrice * 0.92,
        savings: currentYearlyPrice * 0.08,
        features: ['15 Mio. € Deckung', 'Cyber-Schutz', 'Persönlicher Berater'],
        rating: 4.6,
        contractLength: '12 Monate',
        cancellationPeriod: '3 Monate'
      }
    ];
  }

  private getSoftwareOffers(currentContract: ContractData): MarketOffer[] {
    const currentYearlyPrice = currentContract.monthlyPrice * 12;
    
    return [
      {
        id: 'google-workspace',
        provider: 'Google',
        name: 'Google Workspace Business',
        monthlyPrice: currentContract.monthlyPrice * 0.7,
        yearlyPrice: currentYearlyPrice * 0.7,
        savings: currentYearlyPrice * 0.3,
        features: ['Gmail Business', 'Drive 2TB', 'Meet Premium', '24/7 Support'],
        rating: 4.5,
        isRecommended: true,
        contractLength: 'Monatlich kündbar',
        cancellationPeriod: '30 Tage'
      },
      {
        id: 'microsoft-365',
        provider: 'Microsoft',
        name: 'Microsoft 365 Business Premium',
        monthlyPrice: currentContract.monthlyPrice * 0.85,
        yearlyPrice: currentYearlyPrice * 0.85,
        savings: currentYearlyPrice * 0.15,
        features: ['Office Apps', 'Teams Premium', 'OneDrive 1TB', 'Security Features'],
        rating: 4.3,
        contractLength: 'Jährlich',
        cancellationPeriod: '30 Tage'
      }
    ];
  }

  async generateComparisonReport(currentContract: ContractData, offers: MarketOffer[]): Promise<string> {
    const bestOffer = offers.find(o => o.isRecommended) || offers[0];
    
    return `
# Vertragsvergleich: ${currentContract.contractType}

## Aktueller Vertrag
- **Anbieter:** ${currentContract.provider}
- **Monatliche Kosten:** ${currentContract.monthlyPrice.toLocaleString('de-DE')} €
- **Jährliche Kosten:** ${(currentContract.monthlyPrice * 12).toLocaleString('de-DE')} €

## Beste Alternative
- **Anbieter:** ${bestOffer.provider}
- **Tarif:** ${bestOffer.name}
- **Monatliche Kosten:** ${bestOffer.monthlyPrice.toLocaleString('de-DE')} €
- **Jährliche Kosten:** ${bestOffer.yearlyPrice.toLocaleString('de-DE')} €
- **Ersparnis:** ${bestOffer.savings.toLocaleString('de-DE')} € pro Jahr

## Empfehlung
${bestOffer.isRecommended ? 'Wechsel empfohlen' : 'Prüfung empfohlen'}

## Nächste Schritte
1. Kündigungsfrist prüfen: ${currentContract.cancellationPeriod}
2. Wechseltermin planen
3. Neuen Vertrag abschließen
4. Kündigung einreichen
    `;
  }
}

export const contractAnalyzer = ContractAnalyzer.getInstance();