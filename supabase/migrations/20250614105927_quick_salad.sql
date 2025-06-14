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
      - `mandant_id` (uuid, foreign key to Mandanten)
      - `user_id` (uuid, required)
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
    - Add indexes on mandant_id and user_id for better performance
*/

-- Create the optimizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS optimizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'potential',
  category text DEFAULT 'tax',
  potential_savings numeric DEFAULT 0,
  mandant_id uuid,
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

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'optimizations_mandant_id_fkey'
    AND table_name = 'optimizations'
  ) THEN
    ALTER TABLE optimizations 
    ADD CONSTRAINT optimizations_mandant_id_fkey 
    FOREIGN KEY (mandant_id) REFERENCES "Mandanten"(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_optimizations_mandant_id ON optimizations(mandant_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_user_id ON optimizations(user_id);

-- Enable Row Level Security
ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'optimizations' 
    AND policyname = 'Users can manage their own optimizations'
  ) THEN
    DROP POLICY "Users can manage their own optimizations" ON optimizations;
  END IF;
END $$;

-- Create policy for authenticated users to manage their own optimizations
CREATE POLICY "Users can manage their own optimizations"
  ON optimizations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);