export type Client = {
  id: string;
  name: string;
  industry: string;
  revenue: number;
  profit: number;
  legalForm: string;
  status: 'active' | 'inactive';
  lastAnalyzed?: string;
  employeeCount: number;
  expectedRevenue?: number;
  expectedProfit?: number;
  plannedRevenue?: number;
  plannedProfit?: number;
  tradeTaxMultiplier?: number;
};

export type Employee = {
  id: number;
  name: string;
  position: string;
  department: string;
  optimizations: string[];
};

export type OptimizationItem = {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  status: 'unused' | 'potential' | 'used' | 'discussed' | 'planned' | 'implemented' | 'document-missing' | 'send-offers' | 'waiting-for-client' | 'completed';
  category: 'tax' | 'cost' | 'structure';
  details: string;
  requirements: string[];
  employeeCount: number;
  employeesAnalyzed?: number;
  employeesBenefiting?: number;
  netBenefitEmployee?: number;
  employerCost?: number;
};

export type ClientDetail = Client & {
  optimizations: OptimizationItem[];
  employees: Employee[];
  totalEmployeesAnalyzed?: number;
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
};

export type TaxOptimization = {
  type: string;
  description: string;
  potentialSavings: number;
  requirements: string[];
  implementation: string[];
};