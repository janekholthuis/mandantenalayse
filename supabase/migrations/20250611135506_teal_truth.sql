/*
  # Fix Email Confirmation Setup

  1. Email Templates
    - Update email templates with proper confirmation URLs
    - Add better error handling
  
  2. Auth Configuration
    - Ensure proper RLS policies
    - Add indexes for better performance
*/

-- Update email confirmation template with proper Supabase confirmation URL format
UPDATE email_templates 
SET html_content = '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Mail bestätigen</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .confirmation-box { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .button:hover { background-color: #059669; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
        .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Mandantenanalyse.com</div>
            <div class="header-subtitle">E-Mail-Adresse bestätigen</div>
        </div>
        
        <div class="content">
            <h1 style="color: #1f2937; margin-bottom: 20px;">E-Mail-Adresse bestätigen</h1>
            
            <div class="confirmation-box">
                <h3 style="margin-top: 0; color: #059669;">✉️ Bestätigung erforderlich</h3>
                <p>Um Ihr Konto zu aktivieren, bestätigen Sie bitte Ihre E-Mail-Adresse: <strong>{{.Email}}</strong></p>
            </div>
            
            <p>Klicken Sie auf den folgenden Button, um Ihre E-Mail-Adresse zu bestätigen und Ihr Konto zu aktivieren:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{.ConfirmationURL}}" class="button">E-Mail-Adresse bestätigen</a>
            </div>
            
            <div class="warning">
                <h4 style="margin-top: 0; color: #92400e;">⚠️ Wichtige Hinweise:</h4>
                <ul style="margin: 0; color: #92400e;">
                    <li>Dieser Link ist nur 24 Stunden gültig</li>
                    <li>Der Link kann nur einmal verwendet werden</li>
                    <li>Falls Sie sich nicht registriert haben, ignorieren Sie diese E-Mail</li>
                </ul>
            </div>
            
            <p><strong>Warum ist diese Bestätigung notwendig?</strong><br>
            Die Bestätigung Ihrer E-Mail-Adresse hilft uns dabei:</p>
            <ul>
                <li>Ihr Konto vor unbefugtem Zugriff zu schützen</li>
                <li>Sicherzustellen, dass Sie wichtige Nachrichten erhalten</li>
                <li>Die Sicherheit unserer Plattform zu gewährleisten</li>
            </ul>
            
            <p>Falls Sie Probleme mit der Bestätigung haben, kontaktieren Sie uns unter <a href="mailto:{{support_email}}" style="color: #10b981;">support@mandantenanalyse.com</a></p>
            
            <p style="margin-top: 30px;">
                Beste Grüße,<br>
                <strong>Ihr Mandantenanalyse.com Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; {{current_year}} Mandantenanalyse.com. Alle Rechte vorbehalten.</p>
            <p style="font-size: 12px; color: #9ca3af;">
                Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
                {{.ConfirmationURL}}
            </p>
        </div>
    </div>
</body>
</html>',
updated_at = now()
WHERE type = 'email_confirmation';

-- Update password reset template to use Supabase variables
UPDATE email_templates 
SET html_content = REPLACE(html_content, '{{reset_url}}', '{{.RedirectTo}}'),
    updated_at = now()
WHERE type = 'password_reset';

-- Add index for better performance on email template lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);

-- Ensure RLS is properly configured
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Update RLS policy to allow updates for authenticated users (for template management)
DROP POLICY IF EXISTS "Allow template management" ON email_templates;
CREATE POLICY "Allow template management"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);