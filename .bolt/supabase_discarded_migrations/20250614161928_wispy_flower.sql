/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `datum` (date) - Belegdatum
      - `buchungstext` (text) - Buchungstext
      - `betrag` (decimal) - Betrag
      - `waehrung` (text) - Währung (optional, default EUR)
      - `konto` (text) - Konto
      - `gegenkonto` (text) - Gegenkonto
      - `soll_haben` (text) - Soll/Haben-Kennzeichen (optional)
      - `belegnummer` (text) - Belegfeld 1 (optional)
      - `mandant_id` (uuid) - Reference to Mandanten table
      - `user_id` (uuid) - Reference to auth.users
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to manage their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  datum date NOT NULL,
  buchungstext text NOT NULL,
  betrag decimal(15,2) NOT NULL,
  waehrung text DEFAULT 'EUR',
  konto text,
  gegenkonto text,
  soll_haben text,
  belegnummer text,
  mandant_id uuid REFERENCES "Mandanten"(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_mandant_id ON transactions(mandant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_datum ON transactions(datum);