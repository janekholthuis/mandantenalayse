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

  private static async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          html,
        },
      });

      if (error) {
        console.error('Error calling send-email function:', error);
        return false;
      }

      if (data?.success) {
        console.log('Email sent successfully to:', to);
        return true;
      } else {
        console.error('Email sending failed:', data?.error);
        return false;
      }
    } catch (error) {
      console.error('Error in sendEmail:', error);
      return false;
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

      return await this.sendEmail(userEmail, template.subject, emailContent);
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

      return await this.sendEmail(userEmail, template.subject, emailContent);
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

      return await this.sendEmail(userEmail, template.subject, emailContent);
    } catch (error) {
      console.error('Error sending email confirmation:', error);
      return false;
    }
  }

  // Test function to verify email service is working
  static async sendTestEmail(userEmail: string): Promise<boolean> {
    try {
      const testHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">Test Email</h1>
            <p>Dies ist eine Test-E-Mail von Mandantenanalyse.com.</p>
            <p>Wenn Sie diese E-Mail erhalten, funktioniert der E-Mail-Service korrekt.</p>
            <p>Gesendet am: ${new Date().toLocaleString('de-DE')}</p>
          </div>
        </body>
        </html>
      `;

      return await this.sendEmail(userEmail, 'Test Email - Mandantenanalyse.com', testHtml);
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }
}