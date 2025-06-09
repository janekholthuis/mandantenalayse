/*
  # Update Client Schema

  1. Changes to clients table
    - Add new fields for financial data and planning
    - Add validation constraints
    
  2. Changes to client_submissions table
    - Add new fields for personal information
    - Add validation constraints
    
  3. Security
    - Maintain existing RLS policies
*/

-- Add new fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS expected_revenue numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS expected_profit numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS planned_revenue numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS planned_profit numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tax_rate numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS business_type text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS founding_year integer;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS employee_count integer;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS business_focus text[];
ALTER TABLE clients ADD COLUMN IF NOT EXISTS international_business boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS main_markets text[];

-- Add constraints to clients table
ALTER TABLE clients ADD CONSTRAINT clients_tax_rate_check 
  CHECK (tax_rate >= 0 AND tax_rate <= 100);
  
ALTER TABLE clients ADD CONSTRAINT clients_founding_year_check 
  CHECK (founding_year >= 1800 AND founding_year <= extract(year from current_date));
  
ALTER TABLE clients ADD CONSTRAINT clients_employee_count_check 
  CHECK (employee_count >= 0);

-- Add new fields to client_submissions table
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS position text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS tax_id text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS vat_id text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS tax_office text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS tax_accountant text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS tax_class text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS has_children boolean DEFAULT false;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS children_count integer DEFAULT 0;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS has_property boolean DEFAULT false;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS property_type text[];
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS has_investments boolean DEFAULT false;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS investment_types text[];
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS has_previous_tax_audit boolean DEFAULT false;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS last_tax_audit_year integer;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS preferred_contact_method text;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS notes text;

-- Add constraints to client_submissions table
ALTER TABLE client_submissions ADD CONSTRAINT client_submissions_children_count_check 
  CHECK (children_count >= 0);
  
ALTER TABLE client_submissions ADD CONSTRAINT client_submissions_tax_class_check 
  CHECK (tax_class IN ('1', '2', '3', '4', '5', '6'));
  
ALTER TABLE client_submissions ADD CONSTRAINT client_submissions_last_tax_audit_year_check 
  CHECK (last_tax_audit_year >= 2000 AND last_tax_audit_year <= extract(year from current_date));
  
ALTER TABLE client_submissions ADD CONSTRAINT client_submissions_preferred_contact_method_check 
  CHECK (preferred_contact_method IN ('email', 'phone', 'mail'));

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients (industry);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (status);
CREATE INDEX IF NOT EXISTS idx_client_submissions_tax_class ON client_submissions (tax_class);

-- Update trigger function to handle new fields
CREATE OR REPLACE FUNCTION update_client_calculations() RETURNS TRIGGER AS $$
BEGIN
  -- Trigger existing tax calculations with new data
  PERFORM calculate_client_taxes(NEW.client_id, extract(year from current_date)::integer);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for client submissions
CREATE TRIGGER trigger_update_calculations
  AFTER INSERT OR UPDATE ON client_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_client_calculations();