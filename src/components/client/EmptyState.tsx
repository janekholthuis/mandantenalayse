import React from 'react';
import { UserPlus, Upload } from 'lucide-react';
import Button from '../ui/Button';

interface Props { onAdd: () => void; }

const EmptyState: React.FC<Props> = ({ onAdd }) => (
  <div className="text-center py-20">
    <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-xl font-semibold text-gray-900">Keine Mandanten vorhanden</h3>
    <p className="mt-2 text-gray-500">Fügen Sie Mandanten hinzu, um mit der Analyse zu starten.</p>
    <div className="mt-6 flex justify-center gap-3">
      <Button variant="primary" icon={<UserPlus size={16} />} onClick={onAdd}>
        Neuer Mandant
      </Button>
      <Button variant="secondary" icon={<Upload size={16} />} onClick={onAdd}>
        CSV importieren
      </Button>
    </div>
  </div>
);

export default EmptyState;
