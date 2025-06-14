/*
  # Create employees table

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `position` (text)
      - `department` (text)
      - `mandant_id` (uuid, foreign key to Mandanten)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `employees` table
    - Add policy for users to manage their own employees
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text,
  department text,
  mandant_id uuid REFERENCES "Mandanten"(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_employees_mandant_id ON employees(mandant_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);