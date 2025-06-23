import React from 'react';
import { Trash2 } from 'lucide-react';

const EmptyTrash: React.FC = () => (
  <div className="text-center py-20">
    <Trash2 className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-xl font-semibold text-gray-900">Papierkorb ist leer</h3>
    <p className="mt-2 text-gray-500">Es sind keine gelöschten Mandanten vorhanden.</p>
  </div>
);

export default EmptyTrash;
