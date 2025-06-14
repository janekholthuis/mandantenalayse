interface MarketRate {
  category: string;
  provider: string;
  product: string;
  price: number;
  features: string[];
  rating: number;
  lastUpdated: string;
}

interface PriceAlert {
  id: string;
  category: string;
  currentPrice: number;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
}

export class MarketDataService {
  private static instance: MarketDataService;
  private marketRates: MarketRate[] = [];
  private priceAlerts: PriceAlert[] = [];
  
  private constructor() {
    this.initializeMarketData();
  }
  
  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private initializeMarketData() {
    // Initialize with current market data
    this.marketRates = [
      // Energy providers
      {
        category: 'Energie',
        provider: 'E.ON',
        product: 'ÖkoStrom Plus',
        price: 82.50,
        features: ['100% Ökostrom', 'Preisgarantie 24 Monate'],
        rating: 4.7,
        lastUpdated: new Date().toISOString()
      },
      {
        category: 'Energie',
        provider: 'Vattenfall',
        product: 'Natur Strom 25',
        price: 87.50,
        features: ['100% Ökostrom', 'TÜV-zertifiziert'],
        rating: 4.2,
        lastUpdated: new Date().toISOString()
      },
      // Telecom providers
      {
        category: 'Telekommunikation',
        provider: 'Vodafone',
        product: 'Red Internet & Phone 100',
        price: 39.99,
        features: ['100 Mbit/s', 'Telefon-Flat'],
        rating: 4.1,
        lastUpdated: new Date().toISOString()
      },
      {
        category: 'Telekommunikation',
        provider: 'Telekom',
        product: 'MagentaZuhause M',
        price: 44.95,
        features: ['50 Mbit/s', 'MagentaTV'],
        rating: 4.3,
        lastUpdated: new Date().toISOString()
      },
      // Insurance providers
      {
        category: 'Versicherung',
        provider: 'HUK-COBURG',
        product: 'Betriebshaftpflicht',
        price: 125.00,
        features: ['10 Mio. € Deckung', 'Rechtsschutz'],
        rating: 4.4,
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  async getCurrentMarketRates(category?: string): Promise<MarketRate[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (category) {
      return this.marketRates.filter(rate => rate.category === category);
    }
    
    return this.marketRates;
  }

  async getBestOffers(category: string, currentPrice: number): Promise<MarketRate[]> {
    const categoryRates = await this.getCurrentMarketRates(category);
    
    // Return offers that are cheaper than current price
    return categoryRates
      .filter(rate => rate.price < currentPrice)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3); // Top 3 offers
  }

  async createPriceAlert(category: string, currentPrice: number, targetPrice: number): Promise<PriceAlert> {
    const alert: PriceAlert = {
      id: crypto.randomUUID(),
      category,
      currentPrice,
      targetPrice,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    this.priceAlerts.push(alert);
    return alert;
  }

  async checkPriceAlerts(): Promise<PriceAlert[]> {
    const triggeredAlerts: PriceAlert[] = [];
    
    for (const alert of this.priceAlerts.filter(a => a.isActive)) {
      const currentRates = await this.getCurrentMarketRates(alert.category);
      const lowestPrice = Math.min(...currentRates.map(r => r.price));
      
      if (lowestPrice <= alert.targetPrice) {
        triggeredAlerts.push(alert);
        alert.isActive = false; // Deactivate triggered alert
      }
    }
    
    return triggeredAlerts;
  }

  async getMarketTrends(category: string, days: number = 30): Promise<{date: string, avgPrice: number}[]> {
    // Simulate historical data
    const trends = [];
    const basePrice = this.marketRates
      .filter(r => r.category === category)
      .reduce((sum, r) => sum + r.price, 0) / this.marketRates.filter(r => r.category === category).length;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate price fluctuation
      const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation
      const price = basePrice * (1 + fluctuation);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        avgPrice: Math.round(price * 100) / 100
      });
    }
    
    return trends;
  }

  async getCompetitiveAnalysis(category: string): Promise<{
    marketLeader: MarketRate;
    bestValue: MarketRate;
    avgPrice: number;
    priceRange: { min: number; max: number };
  }> {
    const categoryRates = await this.getCurrentMarketRates(category);
    
    if (categoryRates.length === 0) {
      throw new Error(`No market data available for category: ${category}`);
    }
    
    const marketLeader = categoryRates.reduce((prev, current) => 
      current.rating > prev.rating ? current : prev
    );
    
    const bestValue = categoryRates.reduce((prev, current) => 
      current.price < prev.price ? current : prev
    );
    
    const prices = categoryRates.map(r => r.price);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    return {
      marketLeader,
      bestValue,
      avgPrice: Math.round(avgPrice * 100) / 100,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    };
  }

  async updateMarketData(): Promise<void> {
    // Simulate fetching fresh market data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update timestamps
    this.marketRates.forEach(rate => {
      rate.lastUpdated = new Date().toISOString();
      // Simulate small price changes
      const change = (Math.random() - 0.5) * 0.05; // ±2.5% change
      rate.price = Math.round(rate.price * (1 + change) * 100) / 100;
    });
  }

  getLastUpdateTime(): string {
    if (this.marketRates.length === 0) return 'Nie';
    
    const lastUpdate = Math.max(...this.marketRates.map(r => new Date(r.lastUpdated).getTime()));
    return new Date(lastUpdate).toLocaleString('de-DE');
  }
}

export const marketDataService = MarketDataService.getInstance();