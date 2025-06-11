# Mandantenanalyse.com

Eine cloudbasierte Plattform zur Mandantenanalyse und -verwaltung für Steuerkanzleien.

## Features

- **Mandantenverwaltung**: Übersichtliche Verwaltung aller Mandanten
- **Automatische Steueranalysen**: Identifizierung von Optimierungspotenzialen
- **Mitarbeiter-Benefits**: Verwaltung steuerlicher Vorteile
- **Kostenoptimierung**: Automatische Analyse von Verträgen und Ausgaben
- **E-Mail-System**: Professionelle E-Mail-Vorlagen für Authentifizierung

## Email Service Setup

Die Anwendung verwendet Supabase Edge Functions für den E-Mail-Versand. Um E-Mails zu versenden, müssen Sie die folgenden Umgebungsvariablen in Ihrem Supabase-Projekt konfigurieren:

### Erforderliche Umgebungsvariablen

1. **EMAIL_PROVIDER**: Der E-Mail-Service-Anbieter (`sendgrid` oder `mailgun`)
2. **EMAIL_API_KEY**: API-Schlüssel Ihres E-Mail-Anbieters
3. **FROM_EMAIL**: Absender-E-Mail-Adresse (z.B. `noreply@mandantenanalyse.com`)

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

### Setup-Schritte:

1. **E-Mail-Service-Anbieter wählen**:
   - **SendGrid**: Registrieren Sie sich bei [SendGrid](https://sendgrid.com/) und erstellen Sie einen API-Schlüssel
   - **Mailgun**: Registrieren Sie sich bei [Mailgun](https://www.mailgun.com/) und erstellen Sie einen API-Schlüssel

2. **Supabase Secrets konfigurieren**:
   - Gehen Sie zu Ihrem Supabase-Dashboard
   - Navigieren Sie zu "Settings" > "Edge Functions"
   - Fügen Sie die erforderlichen Umgebungsvariablen hinzu

3. **Edge Function deployen**:
   ```bash
   supabase functions deploy send-email
   ```

4. **Test-E-Mail senden**:
   - Gehen Sie zur E-Mail-Vorlagen-Seite in der Anwendung
   - Klicken Sie auf "Test-E-Mail senden"
   - Geben Sie Ihre E-Mail-Adresse ein und senden Sie eine Test-E-Mail

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