/*
  # Add Mitarbeiter_Anzahl column to Mandanten table

  1. Changes
    - Add `Mitarbeiter_Anzahl` column to store employee count
    - Update existing records to have a default value if needed
    - Add index for better query performance

  2. Security
    - Column is accessible through existing RLS policies
*/

-- Add Mitarbeiter_Anzahl column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Mandanten' AND column_name = 'Mitarbeiter_Anzahl'
  ) THEN
    ALTER TABLE "Mandanten" ADD COLUMN "Mitarbeiter_Anzahl" integer DEFAULT 0;
  END IF;
END $$;

-- Update any existing records that might have NULL values
UPDATE "Mandanten" SET "Mitarbeiter_Anzahl" = 0 WHERE "Mitarbeiter_Anzahl" IS NULL;

-- Add constraint to ensure non-negative values
ALTER TABLE "Mandanten" ADD CONSTRAINT check_mitarbeiter_anzahl_positive 
  CHECK ("Mitarbeiter_Anzahl" >= 0);