import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EmailService } from '../services/emailService';

interface EmailTemplate {
  id: string;
  type: string;
  subject: string;
  html_content: string;
  created_at: string;
  updated_at: string;
}

export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('type');

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch email templates');
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await fetchTemplates(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
      return false;
    }
  };

  const createTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert([{
          ...template,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
      await fetchTemplates(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      return false;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTemplates(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      return false;
    }
  };

  const getTemplate = (type: string): EmailTemplate | undefined => {
    return templates.find(template => template.type === type);
  };

  const previewTemplate = async (type: string, variables?: Record<string, string>): Promise<string | null> => {
    return await EmailService.previewTemplate(type, variables);
  };

  const sendTestEmail = async (email: string, templateType?: string, variables?: Record<string, string>): Promise<boolean> => {
    if (templateType) {
      return await EmailService.sendCustomEmail(templateType, email, variables);
    } else {
      return await EmailService.sendTestEmail(email);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    updateTemplate,
    createTemplate,
    deleteTemplate,
    getTemplate,
    previewTemplate,
    sendTestEmail
  };
};