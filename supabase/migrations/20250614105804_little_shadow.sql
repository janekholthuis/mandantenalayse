/*
  # Create optimizations table

  1. New Tables
    - `optimizations`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `status` (text, default 'potential')
      - `category` (text, default 'tax')
      - `potential_savings` (numeric, default 0)
      - `mandant_id` (uuid, references Mandanten)
      - `user_id` (uuid, for RLS)
      - `employee_count` (integer, default 0)
      - `employees_analyzed` (integer, default 0)
      - `employees_benefiting` (integer, default 0)
      - `net_benefit_employee` (numeric, default 0)
      - `employer_cost` (numeric, default 0)
      - `requirements` (text array, default empty)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `optimizations` table
    - Add policy for authenticated users to manage their own optimizations

  3. Indexes
    - Add indexes for better performance on mandant_id and user_id
*/

CREATE TABLE IF NOT EXISTS optimizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'potential',
  category text DEFAULT 'tax',
  potential_savings numeric DEFAULT 0,
  mandant_id uuid REFERENCES "Mandanten"(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_optimizations_mandant_id ON optimizations(mandant_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_user_id ON optimizations(user_id);