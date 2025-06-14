/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `datum` (date) - Belegdatum
      - `buchungstext` (text) - Buchungstext
      - `betrag` (decimal) - Betrag
      - `waehrung` (text) - Währung (optional, default EUR)
      - `konto` (text) - Konto
      - `gegenkonto` (text) - Gegenkonto
      - `soll_haben` (text) - Soll/Haben-Kennzeichen (optional)
      - `belegnummer` (text) - Belegfeld 1 (optional)
      - `mandant_id` (uuid) - Reference to Mandanten table
      - `user_id` (uuid) - Reference to auth.users
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to manage their own transactions