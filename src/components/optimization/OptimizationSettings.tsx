import React from 'react';
import { X, Settings } from 'lucide-react';

interface OptimizationSettingsProps {
  optimizations: Array<{
    id: string;
    title: string;
    description: string;
    isActive: boolean;
  }>;
  onToggle: (id: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const OptimizationSettings: React.FC<OptimizationSettingsProps> = ({
  optimizations,
  onToggle,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Optimierungen konfigurieren</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {optimizations.map((opt) => (
            <div
              key={opt.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">{opt.title}</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={opt.isActive}
                    onChange={() => onToggle(opt.id, opt.title)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">{opt.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationSettings;