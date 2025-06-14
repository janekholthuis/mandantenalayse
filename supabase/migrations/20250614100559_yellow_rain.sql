/*
  # Add user_id column to Mandanten table

  1. Changes
    - Add `user_id` column to `Mandanten` table if it doesn't exist
    - Set up foreign key relationship to auth.users
    - Add index for better query performance
    - Update RLS policies to use user_id for access control

  2. Security
    - Enable RLS on `Mandanten` table
    - Add policy for authenticated users to access their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
    - Add policy for authenticated users to delete their own data
*/

-- Add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Mandanten' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE "Mandanten" ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_mandanten_user_id ON "Mandanten"(user_id);

-- Enable RLS if not already enabled
ALTER TABLE "Mandanten" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own mandanten" ON "Mandanten";
DROP POLICY IF EXISTS "Users can insert their own mandanten" ON "Mandanten";
DROP POLICY IF EXISTS "Users can update their own mandanten" ON "Mandanten";
DROP POLICY IF EXISTS "Users can delete their own mandanten" ON "Mandanten";

-- Create RLS policies
CREATE POLICY "Users can view their own mandanten"
  ON "Mandanten"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mandanten"
  ON "Mandanten"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mandanten"
  ON "Mandanten"
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mandanten"
  ON "Mandanten"
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);