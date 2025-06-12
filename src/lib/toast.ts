// src/lib/toast.ts
import { toast } from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      borderRadius: '8px',
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #4ade80',
    },
    icon: '✅',
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    style: {
      borderRadius: '8px',
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #f87171',
    },
    icon: '📛',
  });
};
