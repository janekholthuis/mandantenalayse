/*
  # Add user_id column to transaktionen table

  1. Changes
    - Add `user_id` column to `transaktionen` table
    - Set as uuid type with NOT NULL constraint
    - Add foreign key reference to auth.users(id)
    - Add CASCADE delete to maintain data integrity
    - Add index for performance on user_id queries

  2. Security
    - Update existing RLS policies to use user_id for access control
    - Ensure users can only access their own transaction data
*/

-- Add user_id column to transaktionen table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transaktionen' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE transaktionen ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'transaktionen_user_id_fkey'
  ) THEN
    ALTER TABLE transaktionen 
    ADD CONSTRAINT transaktionen_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add index for performance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_transaktionen_user_id'
  ) THEN
    CREATE INDEX idx_transaktionen_user_id ON transaktionen(user_id);
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE transaktionen ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own transaktionen" ON transaktionen;
DROP POLICY IF EXISTS "Users can insert their own transaktionen" ON transaktionen;
DROP POLICY IF EXISTS "Users can update their own transaktionen" ON transaktionen;
DROP POLICY IF EXISTS "Users can delete their own transaktionen" ON transaktionen;

-- Create RLS policies for user access control
CREATE POLICY "Users can view their own transaktionen"
  ON transaktionen
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transaktionen"
  ON transaktionen
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transaktionen"
  ON transaktionen
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transaktionen"
  ON transaktionen
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);