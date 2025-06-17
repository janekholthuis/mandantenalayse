# Mandantenanalyse.com

Eine cloudbasierte Plattform zur Mandantenanalyse und -verwaltung für Steuerkanzleien.

---

## 🚀 Features

- **Mandantenverwaltung**: Übersichtliche Verwaltung aller Mandanten
- **Automatische Steueranalysen**: Identifizierung von Optimierungspotenzialen
- **Mitarbeiter-Benefits**: Verwaltung steuerlicher Vorteile
- **Kostenoptimierung**: Automatische Analyse von Verträgen und Ausgaben
- **E-Mail-System**: Verwendung der integrierten Supabase-Authentifizierungs-Mails Registrierung, Login und Passwort-Reset.

### ✅ Supabase Konfiguration

1. Gehe in dein [Supabase Dashboard](https://supabase.com)
2. Navigiere zu: `Authentication → Settings`
3. Aktiviere:
   - ✅ `Enable email confirmations`
   - ✅ `Confirm email`
4. Stelle sicher, dass folgende URLs gesetzt sind:
Site URL: https://app.mandantenanalyse.com
Redirect URLs:
https://app.mandantenanalyse.com/auth/callback
http://localhost:5173/auth/callback

---

## 📧 E-Mail-Vorlagen

Supabase sendet automatisch:
- **Bestätigungs-E-Mails**
- **Passwort-Zurücksetzen-E-Mails**
- **Magic Links (optional)**

### ✍️ Anpassung:

→ Gehe zu `Authentication → Email Templates`  
→ Dort kannst du alle Texte und HTML-Templates bearbeiten  
→ Platzhalter wie `{{ .ConfirmationURL }}`, `{{ .Email }}` sind erlaubt

---

## 🧑‍💻 Entwicklung

```bash
# Installiere Abhängigkeiten
npm install

# Starte Entwicklungsserver
npm run dev

# Produktions-Build
npm run build
