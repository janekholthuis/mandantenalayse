/*
  # Create optimizations table

  1. New Tables
    - `optimizations`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `category` (text)
      - `potential_savings` (numeric)
      - `mandant_id` (uuid, foreign key to Mandanten)
      - `user_id` (uuid, foreign key to users)
      - `employee_count` (integer)
      - `employees_analyzed` (integer)
      - `employees_benefiting` (integer)
      - `net_benefit_employee` (numeric)
      - `employer_cost` (numeric)
      - `requirements` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `optimizations` table
    - Add policy for users to manage their own optimizations
*/

CREATE TABLE IF NOT EXISTS optimizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'potential',
  category text DEFAULT 'tax',
  potential_savings numeric DEFAULT 0,
  mandant_id uuid REFERENCES "Mandanten"(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  employee_count integer DEFAULT 0,
  employees_analyzed integer DEFAULT 0,
  employees_benefiting integer DEFAULT 0,
  net_benefit_employee numeric DEFAULT 0,
  employer_cost numeric DEFAULT 0,
  requirements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own optimizations"
  ON optimizations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_optimizations_mandant_id ON optimizations(mandant_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_user_id ON optimizations(user_id);