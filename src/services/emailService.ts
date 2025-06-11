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

  private static replacePlaceholders(content: string, variables: Record<string, string>): string {
    let result = content;
    
    // Replace all placeholders with actual values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });

    // Replace Supabase-style placeholders
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\.${key}}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  }

  static async sendWelcomeEmail(userEmail: string, userName: string, companyName?: string): Promise<boolean> {
    try {
      const template = await this.getTemplate('welcome');
      
      if (!template) {
        console.error('Welcome email template not found');
        return false;
      }

      const variables = {
        user_name: userName || 'Lieber Nutzer',
        company_name: companyName || 'Ihr Unternehmen',
        user_email: userEmail,
        login_url: `${window.location.origin}/login`,
        support_email: 'support@mandantenanalyse.com',
        current_year: new Date().getFullYear().toString(),
        Email: userEmail, // Supabase style
      };

      const emailContent = this.replacePlaceholders(template.html_content, variables);
      const subject = this.replacePlaceholders(template.subject, variables);

      return await this.sendEmail(userEmail, subject, emailContent);
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

      const variables = {
        user_email: userEmail,
        reset_url: resetUrl,
        RedirectTo: resetUrl, // Supabase style
        support_email: 'support@mandantenanalyse.com',
        current_year: new Date().getFullYear().toString(),
        Email: userEmail, // Supabase style
      };

      const emailContent = this.replacePlaceholders(template.html_content, variables);
      const subject = this.replacePlaceholders(template.subject, variables);

      return await this.sendEmail(userEmail, subject, emailContent);
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

      const confirmationUrl = `${window.location.origin}/confirm-email?token_hash=${confirmationToken}&type=signup`;

      const variables = {
        user_email: userEmail,
        confirmation_url: confirmationUrl,
        Email: userEmail, // Supabase style
        ConfirmationURL: confirmationUrl, // Supabase style
        support_email: 'support@mandantenanalyse.com',
        current_year: new Date().getFullYear().toString(),
      };

      const emailContent = this.replacePlaceholders(template.html_content, variables);
      const subject = this.replacePlaceholders(template.subject, variables);

      return await this.sendEmail(userEmail, subject, emailContent);
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
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .status-box { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">✅ Test Email</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Mandantenanalyse.com E-Mail-Service</p>
            </div>
            
            <div class="content">
              <h2 style="color: #1f2937; margin-bottom: 20px;">E-Mail-Service funktioniert!</h2>
              <p>Dies ist eine Test-E-Mail von Mandantenanalyse.com.</p>
              <p>Wenn Sie diese E-Mail erhalten, funktioniert der E-Mail-Service korrekt.</p>
              
              <div class="status-box">
                <h3 style="margin-top: 0; color: #1e40af;">📧 E-Mail-Service Status</h3>
                <ul style="margin: 0; color: #1e40af;">
                  <li>✅ Edge Function erreichbar</li>
                  <li>✅ E-Mail-Provider verbunden</li>
                  <li>✅ Template-System funktional</li>
                  <li>✅ Zustellung erfolgreich</li>
                </ul>
              </div>
              
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #92400e;">📊 Test-Details:</h4>
                <ul style="margin: 0; color: #92400e;">
                  <li><strong>Empfänger:</strong> ${userEmail}</li>
                  <li><strong>Gesendet am:</strong> ${new Date().toLocaleString('de-DE')}</li>
                  <li><strong>Service:</strong> Supabase Edge Functions</li>
                  <li><strong>Template-Quelle:</strong> Datenbank-Templates verfügbar</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Mandantenanalyse.com. Alle Rechte vorbehalten.</p>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                Diese Test-E-Mail wurde über die Mandantenanalyse.com Plattform versendet.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      return await this.sendEmail(userEmail, '✅ Test Email - Mandantenanalyse.com E-Mail-Service', testHtml);
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }

  // Send custom email using a template from database
  static async sendCustomEmail(
    templateType: string, 
    userEmail: string, 
    variables: Record<string, string> = {}
  ): Promise<boolean> {
    try {
      const template = await this.getTemplate(templateType);
      
      if (!template) {
        console.error(`Email template '${templateType}' not found`);
        return false;
      }

      // Default variables
      const defaultVariables = {
        user_email: userEmail,
        support_email: 'support@mandantenanalyse.com',
        current_year: new Date().getFullYear().toString(),
        login_url: `${window.location.origin}/login`,
        Email: userEmail, // Supabase style
      };

      // Merge with provided variables
      const allVariables = { ...defaultVariables, ...variables };

      const emailContent = this.replacePlaceholders(template.html_content, allVariables);
      const subject = this.replacePlaceholders(template.subject, allVariables);

      return await this.sendEmail(userEmail, subject, emailContent);
    } catch (error) {
      console.error(`Error sending custom email (${templateType}):`, error);
      return false;
    }
  }

  // Get all available email templates
  static async getAvailableTemplates(): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('type');

      if (error) {
        console.error('Error fetching email templates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAvailableTemplates:', error);
      return [];
    }
  }

  // Preview email template with sample data
  static async previewTemplate(templateType: string, sampleVariables?: Record<string, string>): Promise<string | null> {
    try {
      const template = await this.getTemplate(templateType);
      
      if (!template) {
        return null;
      }

      // Default sample variables
      const defaultSampleVariables = {
        user_name: 'Max Mustermann',
        company_name: 'Beispiel Steuerberatung GmbH',
        user_email: 'max@beispiel.de',
        login_url: `${window.location.origin}/login`,
        reset_url: `${window.location.origin}/update-password?token=sample-token`,
        confirmation_url: `${window.location.origin}/confirm-email?token=sample-token`,
        support_email: 'support@mandantenanalyse.com',
        current_year: new Date().getFullYear().toString(),
        Email: 'max@beispiel.de', // Supabase style
        ConfirmationURL: `${window.location.origin}/confirm-email?token=sample-token`, // Supabase style
        RedirectTo: `${window.location.origin}/update-password?token=sample-token`, // Supabase style
      };

      const variables = { ...defaultSampleVariables, ...sampleVariables };
      return this.replacePlaceholders(template.html_content, variables);
    } catch (error) {
      console.error('Error previewing template:', error);
      return null;
    }
  }
}