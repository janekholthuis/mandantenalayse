/*
  # Merge Clients and Persons Tables

  1. Add person-related fields to clients table
  2. Migrate existing data
  3. Update constraints and indexes
*/

-- Add person-related fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS marital_status text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS church_tax_payer boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS church_tax_rate numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tax_class text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS has_children boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS children_count integer DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS annual_salary numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS monthly_salary numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS has_property boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS property_type text[];
ALTER TABLE clients ADD COLUMN IF NOT EXISTS has_investments boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS investment_types text[];
ALTER TABLE clients ADD COLUMN IF NOT EXISTS emigration_plans text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS target_country text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tax_id text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS vat_id text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tax_office text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tax_accountant text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS position text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS has_previous_tax_audit boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_tax_audit_year integer;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS preferred_contact_method text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes text;

-- Add constraints
ALTER TABLE clients ADD CONSTRAINT clients_tax_class_check 
  CHECK (tax_class IN ('1', '2', '3', '4', '5', '6'));

ALTER TABLE clients ADD CONSTRAINT clients_children_count_check 
  CHECK (children_count >= 0);

ALTER TABLE clients ADD CONSTRAINT clients_last_tax_audit_year_check 
  CHECK (last_tax_audit_year >= 2000 AND last_tax_audit_year <= extract(year from current_date));

ALTER TABLE clients ADD CONSTRAINT clients_preferred_contact_method_check 
  CHECK (preferred_contact_method IN ('email', 'phone', 'mail'));

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_tax_class ON clients (tax_class);
CREATE INDEX IF NOT EXISTS idx_clients_state ON clients (state);

-- Migrate existing data from client_submissions to clients
UPDATE clients c
SET 
  first_name = cs.first_name,
  last_name = cs.last_name,
  email = cs.email,
  phone = cs.phone,
  birth_date = cs.birth_date,
  marital_status = cs.marital_status,
  state = cs.state,
  church_tax_payer = cs.church_tax_payer,
  church_tax_rate = cs.church_tax_rate,
  tax_class = cs.tax_class,
  has_children = cs.has_children,
  children_count = cs.children_count,
  annual_salary = cs.annual_salary,
  monthly_salary = cs.monthly_salary,
  has_property = cs.has_property,
  property_type = cs.property_type,
  has_investments = cs.has_investments,
  investment_types = cs.investment_types,
  emigration_plans = cs.emigration_plans,
  target_country = cs.target_country,
  tax_id = cs.tax_id,
  vat_id = cs.vat_id,
  tax_office = cs.tax_office,
  tax_accountant = cs.tax_accountant,
  position = cs.position,
  has_previous_tax_audit = cs.has_previous_tax_audit,
  last_tax_audit_year = cs.last_tax_audit_year,
  preferred_contact_method = cs.preferred_contact_method,
  notes = cs.notes
FROM client_submissions cs
WHERE c.id = cs.client_id;