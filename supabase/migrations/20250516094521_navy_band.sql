/*
  # Mandanten und Optimierungen Schema

  1. Neue Tabellen
    - `clients` - Mandantendaten
    - `optimizations` - Optimierungsvorschläge
    - `rules` - Optimierungsregeln

  2. Sicherheit
    - RLS für alle Tabellen aktiviert
    - Richtlinien für authentifizierte Benutzer
*/

-- Mandanten Tabelle
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text NOT NULL,
  revenue numeric NOT NULL,
  profit numeric NOT NULL,
  legal_form text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  last_analyzed timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Optimierungen Tabelle
CREATE TABLE IF NOT EXISTS optimizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  potential_savings numeric NOT NULL,
  status text NOT NULL CHECK (status IN ('unused', 'potential', 'used', 'discussed', 'planned', 'implemented')),
  category text NOT NULL CHECK (category IN ('tax', 'cost', 'structure')),
  details text,
  requirements jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own optimizations"
  ON optimizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own optimizations"
  ON optimizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own optimizations"
  ON optimizations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Regeln Tabelle
CREATE TABLE IF NOT EXISTS rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  threshold numeric NOT NULL,
  enabled boolean DEFAULT true,
  category text NOT NULL CHECK (category IN ('tax', 'cost', 'structure')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rules"
  ON rules
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own rules"
  ON rules
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_optimizations_updated_at
  BEFORE UPDATE ON optimizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();