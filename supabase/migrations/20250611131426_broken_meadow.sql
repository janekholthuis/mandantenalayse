/*
  # Email Templates Setup

  1. New Tables
    - `email_templates`
      - `id` (uuid, primary key)
      - `type` (text, unique)
      - `subject` (text)
      - `html_content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `email_templates` table
    - Add policy for authenticated users to read templates

  3. Data
    - Insert welcome email template
    - Insert password reset email template
    - Insert email confirmation template
*/

-- Create email_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text UNIQUE NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Allow read access to all users" ON email_templates;

-- Create policy for authenticated users to read templates
CREATE POLICY "Allow read access to all users"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert welcome email template
INSERT INTO email_templates (type, subject, html_content) VALUES (
  'welcome',
  'Willkommen bei Mandantenanalyse.com!',
  '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen bei Mandantenanalyse.com</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .welcome-box { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .button:hover { background-color: #2563eb; }
        .features { margin: 30px 0; }
        .feature { display: flex; align-items: flex-start; margin: 15px 0; }
        .feature-icon { background-color: #dbeafe; color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #3b82f6; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Mandantenanalyse.com</div>
            <div class="header-subtitle">Automatisierte Optimierung für Steuerkanzleien</div>
        </div>
        
        <div class="content">
            <h1 style="color: #1f2937; margin-bottom: 20px;">Willkommen, {{user_name}}!</h1>
            
            <div class="welcome-box">
                <h3 style="margin-top: 0; color: #1e40af;">🎉 Ihr Konto wurde erfolgreich erstellt!</h3>
                <p>Vielen Dank, dass Sie sich für Mandantenanalyse.com entschieden haben. Wir freuen uns, {{company_name}} bei der Optimierung Ihrer Mandantenbetreuung zu unterstützen.</p>
            </div>
            
            <p>Mit Mandantenanalyse.com können Sie:</p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">✓</div>
                    <div>
                        <strong>Automatische Steueranalysen</strong><br>
                        Identifizieren Sie Optimierungspotenziale in Sekunden
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">✓</div>
                    <div>
                        <strong>Mitarbeiter-Benefits verwalten</strong><br>
                        Übersicht über alle steuerlichen Vorteile Ihrer Mandanten
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">✓</div>
                    <div>
                        <strong>Kostenoptimierung</strong><br>
                        Automatische Analyse von Verträgen und Ausgaben
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">✓</div>
                    <div>
                        <strong>Professionelle Berichte</strong><br>
                        Erstellen Sie aussagekräftige Analysen für Ihre Mandanten
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{login_url}}" class="button">Jetzt anmelden und loslegen</a>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="margin-top: 0; color: #92400e;">💡 Erste Schritte:</h4>
                <ol style="margin: 0; color: #92400e;">
                    <li>Melden Sie sich in Ihrem Konto an</li>
                    <li>Fügen Sie Ihren ersten Mandanten hinzu</li>
                    <li>Starten Sie eine automatische Analyse</li>
                    <li>Entdecken Sie Optimierungspotenziale</li>
                </ol>
            </div>
            
            <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung. Kontaktieren Sie uns unter <a href="mailto:{{support_email}}" style="color: #3b82f6;">{{support_email}}</a></p>
            
            <p style="margin-top: 30px;">
                Beste Grüße,<br>
                <strong>Ihr Mandantenanalyse.com Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="mailto:{{support_email}}">Support</a>
                <a href="/datenschutz">Datenschutz</a>
                <a href="/agb">AGB</a>
            </div>
            <p>&copy; {{current_year}} Mandantenanalyse.com. Alle Rechte vorbehalten.</p>
            <p style="font-size: 12px; color: #9ca3af;">
                Sie erhalten diese E-Mail, weil Sie sich bei Mandantenanalyse.com registriert haben.<br>
                Mandantenanalyse.com GmbH, Deutschland
            </p>
        </div>
    </div>
</body>
</html>'
) ON CONFLICT (type) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  updated_at = now();

-- Insert password reset email template
INSERT INTO email_templates (type, subject, html_content) VALUES (
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
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .alert-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
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
                <p>Wir haben eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto ({{user_email}}) erhalten.</p>
            </div>
            
            <p>Falls Sie diese Anfrage gestellt haben, klicken Sie auf den folgenden Button, um ein neues Passwort zu erstellen:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{reset_url}}" class="button">Neues Passwort erstellen</a>
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
            Ignorieren Sie diese E-Mail einfach. Ihr Passwort wird nicht geändert. Falls Sie vermuten, dass jemand unberechtigt versucht, auf Ihr Konto zuzugreifen, kontaktieren Sie uns umgehend unter <a href="mailto:{{support_email}}" style="color: #ef4444;">{{support_email}}</a></p>
            
            <p style="margin-top: 30px;">
                Beste Grüße,<br>
                <strong>Ihr Mandantenanalyse.com Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; {{current_year}} Mandantenanalyse.com. Alle Rechte vorbehalten.</p>
            <p style="font-size: 12px; color: #9ca3af;">
                Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
                {{reset_url}}
            </p>
        </div>
    </div>
</body>
</html>'
) ON CONFLICT (type) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  updated_at = now();

-- Insert email confirmation template
INSERT INTO email_templates (type, subject, html_content) VALUES (
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
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .confirmation-box { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .button:hover { background-color: #059669; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
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
                <p>Um Ihr Konto zu aktivieren, bestätigen Sie bitte Ihre E-Mail-Adresse: <strong>{{user_email}}</strong></p>
            </div>
            
            <p>Klicken Sie auf den folgenden Button, um Ihre E-Mail-Adresse zu bestätigen und Ihr Konto zu aktivieren:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{confirmation_url}}" class="button">E-Mail-Adresse bestätigen</a>
            </div>
            
            <p><strong>Warum ist diese Bestätigung notwendig?</strong><br>
            Die Bestätigung Ihrer E-Mail-Adresse hilft uns dabei:</p>
            <ul>
                <li>Ihr Konto vor unbefugtem Zugriff zu schützen</li>
                <li>Sicherzustellen, dass Sie wichtige Nachrichten erhalten</li>
                <li>Die Sicherheit unserer Plattform zu gewährleisten</li>
            </ul>
            
            <p>Falls Sie Probleme mit der Bestätigung haben, kontaktieren Sie uns unter <a href="mailto:{{support_email}}" style="color: #10b981;">{{support_email}}</a></p>
            
            <p style="margin-top: 30px;">
                Beste Grüße,<br>
                <strong>Ihr Mandantenanalyse.com Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; {{current_year}} Mandantenanalyse.com. Alle Rechte vorbehalten.</p>
            <p style="font-size: 12px; color: #9ca3af;">
                Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
                {{confirmation_url}}
            </p>
        </div>
    </div>
</body>
</html>'
) ON CONFLICT (type) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  updated_at = now();