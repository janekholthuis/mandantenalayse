import { toast } from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message, {
    icon: '✅',
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    icon: '📛',
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismiss = (toastId?: string) => {
  if (toastId) toast.dismiss(toastId);
  else toast.dismiss();
};
