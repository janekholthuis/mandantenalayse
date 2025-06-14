import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Bell, BarChart3, AlertCircle } from 'lucide-react';
import { marketDataService } from '../../lib/market-data';
import Button from '../ui/Button';

interface MarketDataDashboardProps {
  category?: string;
}

const MarketDataDashboard: React.FC<MarketDataDashboardProps> = ({ category = 'Energie' }) => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadMarketData();
  }, [category]);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      const [rates, trendData, analysis] = await Promise.all([
        marketDataService.getCurrentMarketRates(category),
        marketDataService.getMarketTrends(category, 30),
        marketDataService.getCompetitiveAnalysis(category)
      ]);
      
      setMarketData(rates);
      setTrends(trendData);
      setCompetitiveAnalysis(analysis);
      setLastUpdate(marketDataService.getLastUpdateTime());
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await marketDataService.updateMarketData();
    await loadMarketData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Marktdaten - {category}</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Letzte Aktualisierung: {lastUpdate}
            </span>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              icon={<RefreshCw size={16} />}
              className="bg-white border-gray-300"
            >
              Aktualisieren
            </Button>
          </div>
        </div>

        {/* Market Overview */}
        {competitiveAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Marktführer</p>
                  <p className="text-lg font-bold text-blue-600">{competitiveAnalysis.marketLeader.provider}</p>
                  <p className="text-xs text-blue-700">Rating: {competitiveAnalysis.marketLeader.rating}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">Bester Preis</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(competitiveAnalysis.bestValue.price)}</p>
                  <p className="text-xs text-green-700">{competitiveAnalysis.bestValue.provider}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Durchschnittspreis</p>
                  <p className="text-lg font-bold text-yellow-600">{formatCurrency(competitiveAnalysis.avgPrice)}</p>
                  <p className="text-xs text-yellow-700">Marktdurchschnitt</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Preisspanne</p>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(competitiveAnalysis.priceRange.min)} - {formatCurrency(competitiveAnalysis.priceRange.max)}
                  </p>
                  <p className="text-xs text-purple-700">Min - Max</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Market Rates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Aktuelle Marktpreise</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anbieter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Features
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marketData.map((rate, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rate.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(rate.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-1">{rate.rating}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < Math.floor(rate.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {rate.features.slice(0, 2).map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {rate.features.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{rate.features.length - 2} weitere
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Preisentwicklung (30 Tage)</h4>
        <div className="h-64 flex items-end space-x-1">
          {trends.map((trend, index) => {
            const maxPrice = Math.max(...trends.map(t => t.avgPrice));
            const height = (trend.avgPrice / maxPrice) * 100;
            
            return (
              <div
                key={index}
                className="flex-1 bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%` }}
                title={`${trend.date}: ${formatCurrency(trend.avgPrice)}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{trends[0]?.date}</span>
          <span>Durchschnittspreis: {formatCurrency(competitiveAnalysis?.avgPrice || 0)}</span>
          <span>{trends[trends.length - 1]?.date}</span>
        </div>
      </div>

      {/* Price Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Preisalarme</h4>
          <Button
            variant="secondary"
            icon={<Bell size={16} />}
            className="bg-white border-gray-300"
          >
            Alarm erstellen
          </Button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">Automatische Benachrichtigungen</p>
              <p className="text-sm text-blue-700">
                Lassen Sie sich benachrichtigen, wenn Preise unter Ihre Zielwerte fallen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDataDashboard;