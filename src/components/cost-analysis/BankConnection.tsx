import React, { useState } from 'react';
import { Building2, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

interface BankConnectionProps {
  onConnectionComplete: (bank: string, fromDate: string, toDate: string) => void;
}

const BankConnection: React.FC<BankConnectionProps> = ({ onConnectionComplete }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'from' | 'to'>('from');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const banks = [
    { id: 'n26', name: 'N26', logo: '🏦' },
    { id: 'deutsche-bank', name: 'Deutsche Bank', logo: '🏛️' },
    { id: 'demo', name: 'Demo-Konto', logo: '🎯' }
  ];

  const presetRanges = [
    { 
      label: 'Letzter Monat', 
      getValue: () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          from: lastMonth.toISOString().split('T')[0],
          to: lastMonthEnd.toISOString().split('T')[0]
        };
      }
    },
    { 
      label: 'Letzte 3 Monate', 
      getValue: () => {
        const today = new Date();
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        return {
          from: threeMonthsAgo.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0]
        };
      }
    },
    { 
      label: 'Letzte 6 Monate', 
      getValue: () => {
        const today = new Date();
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        return {
          from: sixMonthsAgo.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0]
        };
      }
    },
    { 
      label: 'Dieses Jahr', 
      getValue: () => {
        const today = new Date();
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return {
          from: yearStart.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0]
        };
      }
    }
  ];

  const handleConnect = () => {
    if (selectedBank && fromDate && toDate) {
      setIsConnected(true);
      setTimeout(() => {
        onConnectionComplete(selectedBank, fromDate, toDate);
      }, 1500);
    }
  };

  const handlePresetSelect = (preset: typeof presetRanges[0]) => {
    const dates = preset.getValue();
    setFromDate(dates.from);
    setToDate(dates.to);
  };

  const openDatePicker = (type: 'from' | 'to') => {
    setDatePickerType(type);
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (datePickerType === 'from') {
      setFromDate(dateString);
    } else {
      setToDate(dateString);
    }
    setShowDatePicker(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Datum auswählen';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = new Date();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = dateString === (datePickerType === 'from' ? fromDate : toDate);
      const isPast = date <= today;
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={!isPast}
          className={`h-8 w-8 text-sm rounded-full flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white'
              : isToday
              ? 'bg-blue-100 text-blue-600 font-medium'
              : isPast
              ? 'hover:bg-gray-100 text-gray-900'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Bankkonto erfolgreich verknüpft
        </h3>
        <p className="text-green-700">
          Verbindung zu {banks.find(b => b.id === selectedBank)?.name} hergestellt
        </p>
        <p className="text-sm text-green-600 mt-2">
          Zeitraum: {formatDate(fromDate)} bis {formatDate(toDate)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Building2 className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Bankkonto verknüpfen</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank auswählen
          </label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Bitte wählen Sie eine Bank</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>
                {bank.logo} {bank.name}
              </option>
            ))}
          </select>
        </div>

        {selectedBank && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="inline h-4 w-4 mr-1" />
              Zeitraum für Transaktionen
            </label>
            
            {/* Preset Ranges */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {presetRanges.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSelect(preset)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Von</label>
                <button
                  type="button"
                  onClick={() => openDatePicker('from')}
                  className="w-full text-left rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={fromDate ? 'text-gray-900' : 'text-gray-500'}>
                      {formatDate(fromDate)}
                    </span>
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bis</label>
                <button
                  type="button"
                  onClick={() => openDatePicker('to')}
                  className="w-full text-left rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={toDate ? 'text-gray-900' : 'text-gray-500'}>
                      {formatDate(toDate)}
                    </span>
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Date Picker */}
            {showDatePicker && (
              <div className="absolute z-20 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h3 className="font-medium">
                    {currentMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={currentMonth >= new Date()}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleConnect}
          disabled={!selectedBank || !fromDate || !toDate}
          className="w-full"
        >
          Bankkonto verknüpfen
        </Button>
      </div>
    </div>
  );
};

export default BankConnection;