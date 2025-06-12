import { showSuccess, showError } from '../lib/toast';

const UpdatePasswordForm: React.FC = () => {
  // …
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ...
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showSuccess('Passwort erfolgreich geändert 🔐');
      navigate('/login?passwordUpdated=true');
    } catch (err: any) {
      showError(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
};
