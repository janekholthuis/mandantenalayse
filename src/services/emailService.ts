import { supabase } from '../lib/supabase';

interface EmailTemplate {
  id: string;
  type: string;
  subject: string;
  html_content: string;
}

export class EmailService {
  private static async getTemplate(type: string): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('type', type)
        .single();

      if (error) {
        console.error('Error fetching email template:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTemplate:', error);
      return null;
    }
  }

  static async sendWelcomeEmail(userEmail: string, userName: string, companyName?: string): Promise<boolean> {
    try {
      const template = await this.getTemplate('welcome');
      
      if (!template) {
        console.error('Welcome email template not found');
        return false;
      }

      // Replace placeholders in the template
      let emailContent = template.html_content
        .replace(/{{user_name}}/g, userName || 'Lieber Nutzer')
        .replace(/{{company_name}}/g, companyName || 'Ihr Unternehmen')
        .replace(/{{user_email}}/g, userEmail)
        .replace(/{{login_url}}/g, `${window.location.origin}/login`)
        .replace(/{{support_email}}/g, 'support@mandantenanalyse.com')
        .replace(/{{current_year}}/g, new Date().getFullYear().toString());

      // In a real implementation, you would send this via your email service
      // For now, we'll log it and return true to simulate success
      console.log('Welcome email would be sent:', {
        to: userEmail,
        subject: template.subject,
        html: emailContent
      });

      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  static async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean> {
    try {
      const template = await this.getTemplate('password_reset');
      
      if (!template) {
        console.error('Password reset email template not found');
        return false;
      }

      const resetUrl = `${window.location.origin}/update-password?token=${resetToken}`;

      // Replace placeholders in the template
      let emailContent = template.html_content
        .replace(/{{user_email}}/g, userEmail)
        .replace(/{{reset_url}}/g, resetUrl)
        .replace(/{{support_email}}/g, 'support@mandantenanalyse.com')
        .replace(/{{current_year}}/g, new Date().getFullYear().toString());

      // In a real implementation, you would send this via your email service
      console.log('Password reset email would be sent:', {
        to: userEmail,
        subject: template.subject,
        html: emailContent
      });

      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  static async sendEmailConfirmationEmail(userEmail: string, confirmationToken: string): Promise<boolean> {
    try {
      const template = await this.getTemplate('email_confirmation');
      
      if (!template) {
        console.error('Email confirmation template not found');
        return false;
      }

      const confirmationUrl = `${window.location.origin}/confirm-email?token=${confirmationToken}`;

      // Replace placeholders in the template
      let emailContent = template.html_content
        .replace(/{{user_email}}/g, userEmail)
        .replace(/{{confirmation_url}}/g, confirmationUrl)
        .replace(/{{support_email}}/g, 'support@mandantenanalyse.com')
        .replace(/{{current_year}}/g, new Date().getFullYear().toString());

      console.log('Email confirmation would be sent:', {
        to: userEmail,
        subject: template.subject,
        html: emailContent
      });

      return true;
    } catch (error) {
      console.error('Error sending email confirmation:', error);
      return false;
    }
  }
}