# Mandantenanalyse.com

Eine cloudbasierte Plattform zur Mandantenanalyse und -verwaltung für Steuerkanzleien.

## Features

- **Mandantenverwaltung**: Übersichtliche Verwaltung aller Mandanten
- **Automatische Steueranalysen**: Identifizierung von Optimierungspotenzialen
- **Mitarbeiter-Benefits**: Verwaltung steuerlicher Vorteile
- **Kostenoptimierung**: Automatische Analyse von Verträgen und Ausgaben
- **E-Mail-System**: Professionelle E-Mail-Vorlagen für Authentifizierung

## Email Service Setup

Die Anwendung verwendet Supabase für Authentifizierung und Edge Functions für den E-Mail-Versand. 

### Supabase E-Mail-Konfiguration

1. **Supabase Auth Settings aktivieren**:
   - Gehen Sie zu Ihrem Supabase-Dashboard
   - Navigieren Sie zu "Authentication" > "Settings"
   - Aktivieren Sie "Enable email confirmations"
   - Setzen Sie "Confirm email" auf "enabled"
   - Optional: Passen Sie die "Site URL" an (z.B. `https://your-domain.com`)

2. **E-Mail-Vorlagen in Supabase konfigurieren**:
   - Gehen Sie zu "Authentication" > "Email Templates"
   - Passen Sie die Vorlagen für "Confirm signup", "Magic Link", etc. an
   - Oder verwenden Sie unsere benutzerdefinierten Vorlagen (siehe unten)

### Erforderliche Umgebungsvariablen

Für benutzerdefinierte E-Mails über Edge Functions:

1. **EMAIL_PROVIDER**: Der E-Mail-Service-Anbieter (`sendgrid` oder `mailgun`)
2. **EMAIL_API_KEY**: API-Schlüssel Ihres E-Mail-Anbieters  
3. **FROM_EMAIL**: Absender-E-Mail-Adresse (z.B. `noreply@mandantenanalyse.com`)
4. **MAILGUN_DOMAIN**: Nur für Mailgun erforderlich

### Für SendGrid:
```
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@mandantenanalyse.com
```

### Für Mailgun:
```
EMAIL_PROVIDER=mailgun
EMAIL_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
FROM_EMAIL=noreply@mandantenanalyse.com
```

### Detaillierte Setup-Schritte:

#### 1. Supabase Auth konfigurieren:
```bash
# In Ihrem Supabase Dashboard:
# 1. Authentication > Settings
# 2. Enable email confirmations: ON
# 3. Confirm email: enabled  
# 4. Site URL: https://your-domain.com (oder http://localhost:5173 für Development)
```

#### 2. E-Mail-Service-Anbieter einrichten:

   - **SendGrid**: Registrieren Sie sich bei [SendGrid](https://sendgrid.com/) und erstellen Sie einen API-Schlüssel
   - **Mailgun**: Registrieren Sie sich bei [Mailgun](https://www.mailgun.com/) und erstellen Sie einen API-Schlüssel

#### 3. Supabase Edge Function Secrets konfigurieren:
   - Gehen Sie zu Ihrem Supabase-Dashboard
   - Navigieren Sie zu "Settings" > "Edge Functions"
   - Fügen Sie die erforderlichen Umgebungsvariablen hinzu

#### 4. Edge Function deployen:
   ```bash
   supabase functions deploy send-email
   ```

#### 5. Test durchführen:
   - Gehen Sie zur E-Mail-Vorlagen-Seite in der Anwendung
   - Klicken Sie auf "Test-E-Mail senden"
   - Geben Sie Ihre E-Mail-Adresse ein und senden Sie eine Test-E-Mail
   - Testen Sie die Registrierung mit einer neuen E-Mail-Adresse

### Troubleshooting

**Problem: Bestätigungs-E-Mails werden nicht gesendet**
- Überprüfen Sie, ob "Enable email confirmations" in Supabase aktiviert ist
- Stellen Sie sicher, dass die Site URL korrekt konfiguriert ist
- Überprüfen Sie die Supabase Logs unter "Logs" > "Auth"

**Problem: E-Mails landen im Spam**
- Konfigurieren Sie SPF, DKIM und DMARC Records für Ihre Domain
- Verwenden Sie eine verifizierte Absender-Domain
- Testen Sie mit verschiedenen E-Mail-Anbietern

**Problem: Edge Function Fehler**
- Überprüfen Sie die Edge Function Logs in Supabase
- Stellen Sie sicher, dass alle Umgebungsvariablen gesetzt sind
- Testen Sie die Edge Function direkt über das Supabase Dashboard

### E-Mail-Vorlagen

Die Anwendung enthält drei vorgefertigte E-Mail-Vorlagen:

1. **Willkommens-E-Mail**: Wird nach der Registrierung gesendet
2. **Passwort zurücksetzen**: Wird beim Zurücksetzen des Passworts gesendet
3. **E-Mail-Bestätigung**: Wird zur Bestätigung der E-Mail-Adresse gesendet

Alle Vorlagen können über die E-Mail-Vorlagen-Seite bearbeitet werden und unterstützen Platzhalter wie `{{user_name}}`, `{{company_name}}`, etc.

## Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build
```

## Technologie-Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **E-Mail**: SendGrid oder Mailgun via Supabase Edge Functions
- **Deployment**: Netlify (Frontend), Supabase (Backend)