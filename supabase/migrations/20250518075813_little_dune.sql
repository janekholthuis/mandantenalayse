/*
  # Email Templates Storage
  
  1. New Table
    - `email_templates` - Store HTML email templates
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL UNIQUE,
  subject text NOT NULL,
  html_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert templates
INSERT INTO email_templates (type, subject, html_content) VALUES
('confirmation', 'Willkommen bei TaxOptim', '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 24px; margin: 0;">Willkommen bei TaxOptim</h1>
    </div>
    
    <div style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
      <p>Hallo {{ .Email }},</p>
      <p>vielen Dank für Ihre Registrierung bei TaxOptim. Um Ihr Konto zu aktivieren, klicken Sie bitte auf den folgenden Button:</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Konto aktivieren</a>
    </div>

    <div style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
      <p>Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:</p>
      <p style="word-break: break-all; color: #2563eb;">{{ .ConfirmationURL }}</p>
      <p style="margin-top: 24px;">Dieser Link ist 24 Stunden gültig.</p>
    </div>
  </div>
</body>
</html>'),

('recovery', 'Passwort zurücksetzen', '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 24px; margin: 0;">Passwort zurücksetzen</h1>
    </div>
    
    <div style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
      <p>Hallo {{ .Email }},</p>
      <p>Sie haben angefordert, Ihr Passwort zurückzusetzen. Klicken Sie auf den folgenden Button, um ein neues Passwort festzulegen:</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Neues Passwort festlegen</a>
    </div>

    <div style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
      <p>Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:</p>
      <p style="word-break: break-all; color: #2563eb;">{{ .ConfirmationURL }}</p>
      <p style="margin-top: 24px;">Dieser Link ist aus Sicherheitsgründen nur 24 Stunden gültig.</p>
      <p>Falls Sie keine Passwortänderung angefordert haben, können Sie diese E-Mail ignorieren.</p>
    </div>
  </div>
</body>
</html>'),

('change_email', 'E-Mail-Adresse bestätigen', '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 24px; margin: 0;">E-Mail-Adresse bestätigen</h1>
    </div>
    
    <div style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
      <p>Hallo {{ .Email }},</p>
      <p>bitte bestätigen Sie Ihre neue E-Mail-Adresse durch Klick auf den folgenden Button:</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">E-Mail-Adresse bestätigen</a>
    </div>

    <div style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
      <p>Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:</p>
      <p style="word-break: break-all; color: #2563eb;">{{ .ConfirmationURL }}</p>
      <p style="margin-top: 24px;">Dieser Link ist 24 Stunden gültig.</p>
    </div>
  </div>
</body>
</html>'),

('magic_link', 'Anmelden bei TaxOptim', '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 24px; margin: 0;">Anmelden bei TaxOptim</h1>
    </div>
    
    <div style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
      <p>Hallo {{ .Email }},</p>
      <p>klicken Sie auf den folgenden Button, um sich bei TaxOptim anzumelden:</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Jetzt anmelden</a>
    </div>

    <div style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
      <p>Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:</p>
      <p style="word-break: break-all; color: #2563eb;">{{ .ConfirmationURL }}</p>
      <p style="margin-top: 24px;">Dieser Link ist aus Sicherheitsgründen nur 24 Stunden gültig.</p>
    </div>
  </div>
</body>
</html>')
ON CONFLICT (type) DO UPDATE 
SET 
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  updated_at = now();