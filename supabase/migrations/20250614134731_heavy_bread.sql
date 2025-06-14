/*
  # Create optimizations table

  1. New Tables
    - `optimizations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `title` (text, required)
      - `description` (text)
      - `potential_savings` (numeric)
      - `status` (text)
      - `category` (text)
      - `requirements` (text array)
      - `employee_count` (integer)
      - `employees_analyzed` (integer)
      - `employees_benefiting` (integer)
      - `net_benefit_employee` (numeric)
      - `employer_cost` (numeric)
      - `mandant_id` (uuid, foreign key to Mandanten table)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `optimizations` table
    - Add policies for authenticated users to manage their own optimization data
    - Users can only access optimizations they created
    - Foreign key constraints ensure data integrity

  3. Indexes
    - Index on mandant_id for efficient client-based queries
    - Index on user_id for user-based filtering
*/

CREATE TABLE IF NOT EXISTS public.optimizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    potential_savings numeric DEFAULT 0,
    status text DEFAULT 'potential',
    category text,
    requirements text[],
    employee_count integer DEFAULT 0,
    employees_analyzed integer DEFAULT 0,
    employees_benefiting integer DEFAULT 0,
    net_benefit_employee numeric DEFAULT 0,
    employer_cost numeric DEFAULT 0,
    mandant_id uuid,
    user_id uuid
);

-- Add foreign key constraints
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'optimizations_mandant_id_fkey'
    ) THEN
        ALTER TABLE public.optimizations 
        ADD CONSTRAINT optimizations_mandant_id_fkey 
        FOREIGN KEY (mandant_id) REFERENCES public."Mandanten"(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'optimizations_user_id_fkey'
    ) THEN
        ALTER TABLE public.optimizations 
        ADD CONSTRAINT optimizations_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_optimizations_mandant_id ON public.optimizations(mandant_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_user_id ON public.optimizations(user_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_created_at ON public.optimizations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.optimizations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own optimizations"
    ON public.optimizations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own optimizations"
    ON public.optimizations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own optimizations"
    ON public.optimizations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own optimizations"
    ON public.optimizations
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);