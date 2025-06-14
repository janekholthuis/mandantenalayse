export type Client = {
  id: string;
  name: string;
  revenue?: number;
  profit?: number;
  legalForm?: string;
  status: 'active' | 'inactive';
  lastAnalyzed?: string;
  employeeCount?: number;
  expectedRevenue?: number;
  expectedProfit?: number;
  plannedRevenue?: number;
  plannedProfit?: number;
  tradeTaxMultiplier?: number;
  city?: string;
  postalCode?: number;
  // Supabase fields
  mandanten_id?: string;
  beraternummer?: string;
  branchenschluessel?: string;
  branchenschluessel_bezeichnung?: string;
  unternehmensform?: string;
  unternehmensgegenstand?: string;
  typ?: string;
  typbezeichnung?: string;
  vdb_info?: string;
  vdb_info_textuell?: string;
  plz?: string;
  ort?: string;
  land?: string;
  strasse?: string;
  postfach?: string;
  telefon?: string;
  sepa?: string;
  created_at?: string;
  updated_at?: string;
};

export type Rule = {
  id: string;
  name: string;
  description: string;
  threshold: number;
  enabled: boolean;
  category: 'tax' | 'cost' | 'structure';
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  accountNumber: string;
  // Supabase fields matching DATEV structure
  datum?: string;
  buchungstext?: string;
  betrag?: number;
  waehrung?: string;
  konto?: string;
  gegenkonto?: string;
  soll_haben?: string;
  belegnummer?: string;
  mandant_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type TaxOptimization = {
  type: string;
  description: string;
  potentialSavings: number;
  requirements: string[];
  implementation: string[];
};