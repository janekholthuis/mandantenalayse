/*
  # Beispieldaten für die Anwendung

  1. Testbenutzer
    - Zwei Testbenutzer mit verschlüsselten Passwörtern
  2. Beispieldaten
    - Mandanten
    - Optimierungen
    - Berichte
    - Mandanteneinreichungen
*/

-- Testbenutzer einfügen
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('d0d4e39c-3d54-4d0b-8fb9-3519b3728f98', 'berater@beispiel.de', '$2a$10$RU3zTYcLsdVXUff9Wz1dT.mYQGVpKVEKQLWVYe3Q4zYw4XY4Z4Y2q', now(), now(), now()),
  ('f8b4c9d2-7e65-4a12-bc9a-4567b8c9d0e1', 'assistent@beispiel.de', '$2a$10$RU3zTYcLsdVXUff9Wz1dT.mYQGVpKVEKQLWVYe3Q4zYw4XY4Z4Y2q', now(), now(), now());

-- Beispiel-Mandanten einfügen
INSERT INTO clients (id, name, industry, revenue, profit, legal_form, status, last_analyzed, user_id)
VALUES
  ('a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c5d', 'TechSolutions GmbH', 'IT-Dienstleistungen', 2500000, 450000, 'GmbH', 'active', '2025-04-15', 'd0d4e39c-3d54-4d0b-8fb9-3519b3728f98'),
  ('b2c3d4e5-f6a7-5b2c-9d0e-1f2a3b4c5d6e', 'BioHealth AG', 'Gesundheitswesen', 5800000, 890000, 'AG', 'active', '2025-04-10', 'd0d4e39c-3d54-4d0b-8fb9-3519b3728f98'),
  ('c3d4e5f6-a7b8-6c3d-0e1f-2a3b4c5d6e7f', 'EcoBuilders GmbH & Co. KG', 'Baugewerbe', 3200000, 420000, 'GmbH & Co. KG', 'active', null, 'd0d4e39c-3d54-4d0b-8fb9-3519b3728f98');

-- Beispiel-Optimierungen einfügen
INSERT INTO optimizations (id, client_id, title, description, potential_savings, status, category, details, requirements, user_id)
VALUES
  ('d4e5f6a7-b8c9-7d4e-1f2a-3b4c5d6e7f8a', 'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c5d', 
   'Forschungszulage optimieren', 
   'Nutzung der steuerlichen Forschungszulage für IT-Entwicklungsprojekte',
   75000, 'potential', 'tax',
   'Durch die systematische Erfassung und Dokumentation von F&E-Aktivitäten kann die Forschungszulage optimal genutzt werden.',
   '["Dokumentation der F&E-Aktivitäten", "Bescheinigung durch die Bescheinigungsstelle", "Antrag beim Finanzamt"]',
   'd0d4e39c-3d54-4d0b-8fb9-3519b3728f98'),
   
  ('e5f6a7b8-c9d0-8e5f-2a3b-4c5d6e7f8a9b', 'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c5d',
   'Mitarbeiter-Benefit-Programm',
   'Implementierung eines steueroptimalen Benefit-Programms',
   45000, 'planned', 'structure',
   'Einführung von steuerfreien oder -begünstigten Mitarbeitervorteilen wie Jobtickets, Gesundheitsleistungen und Sachbezügen.',
   '["Anpassung der Arbeitsverträge", "Dokumentationssystem für Benefits", "Information der Mitarbeiter"]',
   'd0d4e39c-3d54-4d0b-8fb9-3519b3728f98');

-- Beispiel-Berichte einfügen
INSERT INTO reports (id, client_id, title, content, summary, total_savings, status, user_id)
VALUES
  ('f6a7b8c9-d0e1-9f6a-3b4c-5d6e7f8a9b0c', 'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c5d',
   'Steueroptimierungsanalyse Q2 2025',
   'Detaillierte Analyse der Steueroptimierungspotenziale für TechSolutions GmbH',
   'Identifizierung von Einsparpotenzialen in Höhe von 120.000 € durch verschiedene Optimierungsmaßnahmen',
   120000, 'final',
   'd0d4e39c-3d54-4d0b-8fb9-3519b3728f98');

-- Beispiel-Mandanteneinreichungen einfügen
INSERT INTO client_submissions (
  id, client_id, first_name, last_name, email, state, marital_status,
  num_children, church_tax_payer, emigration_plans, user_id
)
VALUES
  ('f7b8c9d0-e1f2-a7b8-4c5d-6e7f8a9b0c1d', 'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c5d',
   'Thomas', 'Müller', 'thomas.mueller@techsolutions.de', 'Bayern', 'married',
   2, true, 'no', 'd0d4e39c-3d54-4d0b-8fb9-3519b3728f98');