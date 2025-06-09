/*
  # Create DATEV integration tables

  1. New Tables
    - `auth_states` - Store OAUTH state parameters
    - `datev_tokens` - Store DATEV access tokens
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create auth_states table
CREATE TABLE IF NOT EXISTS auth_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE auth_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own auth states"
  ON auth_states
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create datev_tokens table
CREATE TABLE IF NOT EXISTS datev_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE datev_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tokens"
  ON datev_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);