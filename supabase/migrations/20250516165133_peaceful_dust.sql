/*
  # Expanded Client Schema with Tax Calculations

  1. New Tables
    - `client_submissions` - Store detailed client submission data
    - `client_calculations` - Store calculated tax values
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create client_submissions table
CREATE TABLE IF NOT EXISTS client_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_date timestamptz DEFAULT now(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  state text NOT NULL,
  church_tax_rate numeric,
  marital_status text NOT NULL,
  birth_date date,
  num_children integer NOT NULL DEFAULT 0,
  tax_class text,
  annual_withdrawals numeric,
  has_salary boolean,
  monthly_salary numeric,
  annual_salary numeric,
  emigration_plans text NOT NULL,
  has_target_country boolean,
  target_country text,
  church_tax_payer boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create client_calculations table
CREATE TABLE IF NOT EXISTS client_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  year integer NOT NULL,
  taxable_income numeric NOT NULL,
  income_tax numeric NOT NULL,
  solidarity_surcharge numeric NOT NULL,
  church_tax numeric NOT NULL,
  total_income_tax numeric NOT NULL,
  capital_gains_tax numeric NOT NULL,
  total_private_tax numeric NOT NULL,
  cyprus_profit numeric,
  uae_profit numeric,
  total_profit numeric NOT NULL,
  potential_savings_corporate numeric,
  corporate_taxes numeric,
  trade_tax_allowance numeric,
  trade_tax_base numeric,
  trade_tax numeric,
  total_taxes numeric NOT NULL,
  uae_total_savings numeric,
  cyprus_total_savings numeric,
  salary numeric,
  private_profit numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  UNIQUE(client_id, year)
);

-- Enable RLS
ALTER TABLE client_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own client submissions"
  ON client_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own client submissions"
  ON client_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own client calculations"
  ON client_calculations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own client calculations"
  ON client_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to calculate taxes
CREATE OR REPLACE FUNCTION calculate_client_taxes(
  p_client_id uuid,
  p_year integer
) RETURNS void AS $$
DECLARE
  v_income numeric;
  v_church_rate numeric;
  v_trade_tax_rate numeric;
  v_submission client_submissions%ROWTYPE;
BEGIN
  -- Get client submission data
  SELECT * INTO v_submission
  FROM client_submissions
  WHERE client_id = p_client_id
  ORDER BY submission_date DESC
  LIMIT 1;

  -- Get base income for the year
  SELECT 
    CASE p_year
      WHEN 2024 THEN profit
      WHEN 2025 THEN expected_profit
      WHEN 2026 THEN planned_profit
    END INTO v_income
  FROM clients
  WHERE id = p_client_id;

  -- Calculate taxes based on income and other factors
  INSERT INTO client_calculations (
    client_id,
    year,
    taxable_income,
    income_tax,
    solidarity_surcharge,
    church_tax,
    total_income_tax,
    capital_gains_tax,
    total_private_tax,
    total_profit,
    trade_tax_allowance,
    trade_tax_base,
    trade_tax,
    total_taxes,
    salary,
    private_profit,
    user_id
  )
  VALUES (
    p_client_id,
    p_year,
    v_income,
    -- Simplified tax calculations (replace with actual formulas)
    v_income * 0.42, -- Income tax (42% flat rate for example)
    v_income * 0.055, -- Solidarity surcharge (5.5%)
    CASE WHEN v_submission.church_tax_payer THEN v_income * 0.09 ELSE 0 END, -- Church tax
    v_income * 0.42 + v_income * 0.055, -- Total income tax
    v_income * 0.25, -- Capital gains tax (25%)
    v_income * 0.42 + v_income * 0.055 + 
      CASE WHEN v_submission.church_tax_payer THEN v_income * 0.09 ELSE 0 END +
      v_income * 0.25, -- Total private tax
    v_income, -- Total profit
    24500, -- Trade tax allowance
    GREATEST(v_income - 24500, 0), -- Trade tax base
    GREATEST(v_income - 24500, 0) * 0.035, -- Trade tax (3.5% example)
    v_income * 0.42 + v_income * 0.055 + 
      CASE WHEN v_submission.church_tax_payer THEN v_income * 0.09 ELSE 0 END +
      v_income * 0.25 +
      GREATEST(v_income - 24500, 0) * 0.035, -- Total taxes
    v_submission.annual_salary, -- Salary
    v_income - v_submission.annual_salary, -- Private profit
    auth.uid()
  )
  ON CONFLICT (client_id, year) DO UPDATE
  SET
    taxable_income = EXCLUDED.taxable_income,
    income_tax = EXCLUDED.income_tax,
    solidarity_surcharge = EXCLUDED.solidarity_surcharge,
    church_tax = EXCLUDED.church_tax,
    total_income_tax = EXCLUDED.total_income_tax,
    capital_gains_tax = EXCLUDED.capital_gains_tax,
    total_private_tax = EXCLUDED.total_private_tax,
    total_profit = EXCLUDED.total_profit,
    trade_tax_allowance = EXCLUDED.trade_tax_allowance,
    trade_tax_base = EXCLUDED.trade_tax_base,
    trade_tax = EXCLUDED.trade_tax,
    total_taxes = EXCLUDED.total_taxes,
    salary = EXCLUDED.salary,
    private_profit = EXCLUDED.private_profit,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;