// … Import Toaster
import { showSuccess, showError } from '../lib/toast';

const PasswordResetForm: React.FC = () => {
  // ...
  const handleSubmit = async e => {
    e.preventDefault();
    // ...
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` });
      if (error) throw error;
      showSuccess('Passwort-Reset-Link gesendet 📧');
      setSuccess(true);
    } catch (err: any) {
      showError(err.message);
      setError(err.message);
    } finally { setIsLoading(false); }
  };
  // …
};
