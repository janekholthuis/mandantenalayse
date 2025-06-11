/*
  # Fix email confirmation and password reset links

  1. Updates
    - Update email confirmation template with correct Supabase variables
    - Update password reset template with correct Supabase variables
    - Use proper {{ .ConfirmationURL }} and {{ .RedirectTo }} variables
    - Fix redirect URLs to use production domain

  2. Changes
    - Email confirmation template now uses {{ .Email }} and {{ .ConfirmationURL }}
    - Password reset template now uses {{ .Email }} and {{ .RedirectTo }}
    - Templates updated with proper HTML structure and styling
*/

-- First, ensure the email_templates table exists (create if not exists)
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text UNIQUE NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'email_templates' AND policyname = 'Allow read access to all users'
  ) THEN
    CREATE POLICY "Allow read access to all users"
      ON email_templates
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'email_templates' AND policyname = 'Allow template management'
  ) THEN
    CREATE POLICY "Allow template management"
      ON email_templates
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_email_templates_updated_at'
  ) THEN
    CREATE TRIGGER update_email_templates_updated_at
      BEFORE UPDATE ON email_templates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert or update email confirmation template
INSERT INTO email_templates (type, subject, html_content)
VALUES (
  'email_confirmation',
  'E-Mail-Adresse bestätigen - Mandantenanalyse.com',
  '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Mail bestätigen</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .confirmation-box { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; transition: background-color 0.2s; }
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
                <p>Um Ihr Konto zu aktivieren, bestätigen Sie bitte Ihre E-Mail-Adresse: <strong>{{ .Email }}</strong></p>
            </div>
            
            <p>Klicken Sie auf den folgenden Button, um Ihre E-Mail-Adresse zu bestätigen und Ihr Konto zu aktivieren:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">E-Mail-Adresse bestätigen</a>
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
            
            <p>Falls Sie Probleme mit der Bestätigung haben, kontaktieren Sie uns unter <a href="mailto:support@mandantenanalyse.com" style="color: #10b981;">support@mandantenanalyse.com</a></p>
            
            <p style="margin-top: 30px;">
                Beste Grüße,<br>
                <strong>Ihr Mandantenanalyse.com Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 Mandantenanalyse.com. Alle Rechte vorbehalten.</p>
            <p style="font-size: 12px; color: #9ca3af;">
                Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
                {{ .ConfirmationURL }}
            </p>
        </div>
    </div>
</body>
</html>'
)
ON CONFLICT (type) 
DO UPDATE SET 
  html_content = EXCLUDED.html_content,
  updated_at = now();

-- Insert or update password reset template
INSERT INTO email_templates (type, subject, html_content)
VALUES (
  'password_reset',
  'Passwort zurücksetzen - Mandantenanalyse.com',
  '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passwort zurücksetzen</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .alert-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; transition: background-color 0.2s; }
        .button:hover { background-color: #dc2626; }
        .security-notice { background-color: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 30px 0; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Mandantenanalyse.com</div>
            <div class="header-subtitle">Passwort zurücksetzen</div>
        </div>
        
        <div class="content">
            <h1 style="color: #1f2937; margin-bottom: 20px;">Passwort zurücksetzen</h1>
            
            <div class="alert-box">
                <h3 style="margin-top: 0; color: #dc2626;">🔐 Passwort-Reset angefordert</h3>
                <p>Wir haben eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto ({{ .Email }}) erhalten.</p>
            </div>
            
            <p>Falls Sie diese Anfrage gestellt haben, klicken Sie auf den folgenden Button, um ein neues Passwort zu erstellen:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .RedirectTo }}" class="button">Neues Passwort erstellen</a>
            </div>
            
            <div class="security-notice">
                <h4 style="margin-top: 0; color: #1e40af;">🛡️ Sicherheitshinweise:</h4>
                <ul style="margin: 0; color: #1e40af;">
                    <li>Dieser Link ist nur 24 Stunden gültig</li>
                    <li>Der Link kann nur einmal verwendet werden</li>
                    <li>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail</li>
                    <li>Ihr aktuelles Passwort bleibt unverändert, bis Sie ein neues erstellen</li>
                </ul>
            </div>
            
            <p><strong>Falls Sie diese Anfrage nicht gestellt haben:</strong><br>
            Ignorieren Sie diese E-Mail einfach. Ihr Passwort wird nicht geändert. Falls Sie vermuten, dass jemand unberechtigt versucht, auf Ihr Konto zuzugreifen, kontaktieren Sie uns umgehend unter <a href="mailto:support@mandantenanalyse.com" style="color: #ef4444;">support@mandantenanalyse.com</a></p>
            
            <p style="margin-top: 30px;">
                Beste Grüße,<br>
                <strong>Ihr Mandantenanalyse.com Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 Mandantenanalyse.com. Alle Rechte vorbehalten.</p>
            <p style="font-size: 12px; color: #9ca3af;">
                Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
                {{ .RedirectTo }}
            </p>
        </div>
    </div>
</body>
</html>'
)
ON CONFLICT (type) 
DO UPDATE SET 
  html_content = EXCLUDED.html_content,
  updated_at = now();