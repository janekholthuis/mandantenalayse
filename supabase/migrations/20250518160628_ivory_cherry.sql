-- Add fields from Firmen table to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Firmenname" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Unternehmensform" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Umsatz 2024" numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "GvS 2024" numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "vsl. Umsatz 2025" numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "vsl. GvS 2025" numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "vsl. Umsatz 2026" numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "vsl. GvS 2026" numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Hebesatz (%)" numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Unternehmensform Link" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Unternehmensart" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Anfallende Steuern" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "GewSt. Freibetrag" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "GewSt. 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "GewSt. 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "GewSt. 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "KörpSt. inkl. SoLi 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "KörpSt. inkl. SoLi 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "KörpSt. inkl. SoLi 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "KapESt inkl. SoLi 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "KapESt inkl. SoLi 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "KapESt inkl. SoLi 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Unternehmenssteuern 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Unternehmenssteuern 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Unternehmenssteuern 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Personen" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Gewerbesteueranrechnung auf EkSt" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Wunschziel" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "VAE Unternehmenssteuern 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "VAE Unternehmenssteuern 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "VAE Unternehmenssteuern 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Zypern Unternehmenssteuern 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Zypern Unternehmenssteuern 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Zypern Unternehmenssteuern 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Potentielle Ersparnis Unternehmensebene 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Potentielle Ersparnis Unternehmensebene 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Potentielle Ersparnis Unternehmensebene 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Renditeerwartung 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Renditeerwartung 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Bilanzgewinn 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Bilanzgewinn 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Bilanzgewinn 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "VAE Bilanzgewinn 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "VAE Bilanzgewinn 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "VAE Bilanzgewinn 2026" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Zypern Bilanzgewinn 2024" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Zypern Bilanzgewinn 2025" text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS "Zypern Bilanzgewinn 2026" text;

-- Migrate data from Firmen table to clients
INSERT INTO clients (
  "Firmenname",
  "Unternehmensform",
  "Umsatz 2024",
  "GvS 2024",
  "vsl. Umsatz 2025",
  "vsl. GvS 2025",
  "vsl. Umsatz 2026",
  "vsl. GvS 2026",
  "Hebesatz (%)",
  "Unternehmensform Link",
  "Unternehmensart",
  "Anfallende Steuern",
  "GewSt. Freibetrag",
  "GewSt. 2024",
  "GewSt. 2025",
  "GewSt. 2026",
  "KörpSt. inkl. SoLi 2024",
  "KörpSt. inkl. SoLi 2025",
  "KörpSt. inkl. SoLi 2026",
  "KapESt inkl. SoLi 2024",
  "KapESt inkl. SoLi 2025",
  "KapESt inkl. SoLi 2026",
  "Unternehmenssteuern 2024",
  "Unternehmenssteuern 2025",
  "Unternehmenssteuern 2026",
  "Personen",
  "Gewerbesteueranrechnung auf EkSt",
  "Wunschziel",
  "VAE Unternehmenssteuern 2024",
  "VAE Unternehmenssteuern 2025",
  "VAE Unternehmenssteuern 2026",
  "Zypern Unternehmenssteuern 2024",
  "Zypern Unternehmenssteuern 2025",
  "Zypern Unternehmenssteuern 2026",
  "Potentielle Ersparnis Unternehmensebene 2024",
  "Potentielle Ersparnis Unternehmensebene 2025",
  "Potentielle Ersparnis Unternehmensebene 2026",
  "Renditeerwartung 2025",
  "Renditeerwartung 2026",
  "Bilanzgewinn 2024",
  "Bilanzgewinn 2025",
  "Bilanzgewinn 2026",
  "VAE Bilanzgewinn 2024",
  "VAE Bilanzgewinn 2025",
  "VAE Bilanzgewinn 2026",
  "Zypern Bilanzgewinn 2024",
  "Zypern Bilanzgewinn 2025",
  "Zypern Bilanzgewinn 2026"
)
SELECT
  "Firmenname",
  "Unternehmensform",
  "Umsatz 2024",
  "GvS 2024",
  "vsl. Umsatz 2025",
  "vsl. GvS 2025",
  "vsl. Umsatz 2026",
  "vsl. GvS 2026",
  "Hebesatz (%)",
  "Unternehmensform Link",
  "Unternehmensart",
  "Anfallende Steuern",
  "GewSt. Freibetrag",
  "GewSt. 2024",
  "GewSt. 2025",
  "GewSt. 2026",
  "KörpSt. inkl. SoLi 2024",
  "KörpSt. inkl. SoLi 2025",
  "KörpSt. inkl. SoLi 2026",
  "KapESt inkl. SoLi 2024",
  "KapESt inkl. SoLi 2025",
  "KapESt inkl. SoLi 2026",
  "Unternehmenssteuern 2024",
  "Unternehmenssteuern 2025",
  "Unternehmenssteuern 2026",
  "Personen",
  "Gewerbesteueranrechnung auf EkSt",
  "Wunschziel",
  "VAE Unternehmenssteuern 2024",
  "VAE Unternehmenssteuern 2025",
  "VAE Unternehmenssteuern 2026",
  "Zypern Unternehmenssteuern 2024",
  "Zypern Unternehmenssteuern 2025",
  "Zypern Unternehmenssteuern 2026",
  "Potentielle Ersparnis Unternehmensebene 2024",
  "Potentielle Ersparnis Unternehmensebene 2025",
  "Potentielle Ersparnis Unternehmensebene 2026",
  "Renditeerwartung 2025",
  "Renditeerwartung 2026",
  "Bilanzgewinn 2024",
  "Bilanzgewinn 2025",
  "Bilanzgewinn 2026",
  "VAE Bilanzgewinn 2024",
  "VAE Bilanzgewinn 2025",
  "VAE Bilanzgewinn 2026",
  "Zypern Bilanzgewinn 2024",
  "Zypern Bilanzgewinn 2025",
  "Zypern Bilanzgewinn 2026"
FROM "Firmen"
ON CONFLICT DO NOTHING;

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_clients_firmenname ON clients ("Firmenname");
CREATE INDEX IF NOT EXISTS idx_clients_unternehmensform ON clients ("Unternehmensform");
CREATE INDEX IF NOT EXISTS idx_clients_unternehmensart ON clients ("Unternehmensart");