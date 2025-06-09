import { Client, ClientDetail, Rule } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechSolutions GmbH',
    industry: 'IT-Dienstleistungen',
    revenue: 2500000,
    profit: 350000,
    legalForm: 'GmbH',
    status: 'active',
    lastAnalyzed: '2025-04-15',
    employeeCount: 42,
    expectedRevenue: 2800000,
    expectedProfit: 420000,
    tradeTaxMultiplier: 400
  },
  {
    id: '2',
    name: 'Baumeister & Partner GmbH & Co. KG',
    industry: 'Baugewerbe',
    revenue: 5800000,
    profit: 780000,
    legalForm: 'GmbH & Co. KG',
    status: 'active',
    employeeCount: 85,
    expectedRevenue: 6200000,
    expectedProfit: 850000,
    tradeTaxMultiplier: 380
  },
  {
    id: '3',
    name: 'MedCare Plus AG',
    industry: 'Gesundheitswesen',
    revenue: 3700000,
    profit: 490000,
    legalForm: 'AG',
    status: 'active',
    lastAnalyzed: '2025-04-01',
    employeeCount: 64,
    expectedRevenue: 4100000,
    expectedProfit: 560000,
    tradeTaxMultiplier: 450
  },
  {
    id: '4',
    name: 'Logistik Express GmbH',
    industry: 'Logistik',
    revenue: 1800000,
    profit: 220000,
    legalForm: 'GmbH',
    status: 'active',
    employeeCount: 28,
    expectedRevenue: 2000000,
    expectedProfit: 260000,
    tradeTaxMultiplier: 380
  },
  {
    id: '5',
    name: 'Gastro Service KG',
    industry: 'Gastronomie',
    revenue: 920000,
    profit: 85000,
    legalForm: 'KG',
    status: 'inactive',
    employeeCount: 15,
    expectedRevenue: 1100000,
    expectedProfit: 110000,
    tradeTaxMultiplier: 360
  },
  {
    id: '6',
    name: 'Willi will sparen GmbH',
    industry: 'Einzelhandel',
    revenue: 1200000,
    profit: 180000,
    legalForm: 'GmbH',
    status: 'active',
    lastAnalyzed: null,
    employeeCount: 12,
    expectedRevenue: 1500000,
    expectedProfit: 225000,
    tradeTaxMultiplier: 380
  }
];

export const mockEmployees = {
  '1': [
    { id: 1, name: "Dr. Sarah Weber", position: "CTO", department: "Geschäftsführung", optimizations: ["Sachbezüge", "bAV", "Jobticket"] },
    { id: 2, name: "Michael Schmidt", position: "Senior Developer", department: "Entwicklung", optimizations: ["Sachbezüge", "bAV"] },
    { id: 3, name: "Julia Bauer", position: "HR Manager", department: "Personal", optimizations: ["Sachbezüge", "Jobticket"] },
    { id: 4, name: "Thomas Müller", position: "Product Owner", department: "Produktmanagement", optimizations: ["bAV", "Jobticket"] },
    { id: 5, name: "Anna Schneider", position: "Developer", department: "Entwicklung", optimizations: ["Sachbezüge", "Internetpauschale"] },
    { id: 6, name: "Markus Weber", position: "Developer", department: "Entwicklung", optimizations: ["Sachbezüge", "Internetpauschale"] },
    { id: 7, name: "Lisa Wagner", position: "UX Designer", department: "Design", optimizations: ["Sachbezüge"] },
    { id: 8, name: "Felix Koch", position: "DevOps Engineer", department: "IT", optimizations: ["Internetpauschale", "Jobticket"] }
  ],
  '6': [
    { id: 1, name: "Wilhelm Spar", position: "Geschäftsführer", department: "Geschäftsführung", optimizations: ["Sachbezug"] },
    { id: 2, name: "Lisa Müller", position: "Verkaufsleiterin", department: "Vertrieb", optimizations: ["Sachbezug"] },
    { id: 3, name: "Max Weber", position: "Einkäufer", department: "Einkauf", optimizations: ["Sachbezug"] },
    { id: 4, name: "Anna Schmidt", position: "Verkäuferin", department: "Vertrieb", optimizations: [] },
    { id: 5, name: "Tom Fischer", position: "Verkäufer", department: "Vertrieb", optimizations: [] },
    { id: 6, name: "Sarah Wagner", position: "Kassiererin", department: "Kasse", optimizations: [] },
    { id: 7, name: "Peter Koch", position: "Lagerist", department: "Logistik", optimizations: [] },
    { id: 8, name: "Maria Bauer", position: "Verkäuferin", department: "Vertrieb", optimizations: [] },
    { id: 9, name: "Klaus Weber", position: "Hausmeister", department: "Facility", optimizations: [] },
    { id: 10, name: "Julia Schneider", position: "Marketing", department: "Marketing", optimizations: [] },
    { id: 11, name: "Martin Hoffmann", position: "IT-Support", department: "IT", optimizations: [] },
    { id: 12, name: "Sandra Klein", position: "Buchhaltung", department: "Finanzen", optimizations: [] }
  ]
};

export const mockOptimizations = {
  '6': [
    {
      id: 'sachbezug',
      title: 'Sachbezug',
      description: 'Steuerfreier oder pauschalversteuerter geldwerter Vorteil bis zu 50 € pro Monat, z. B. als Gutschein.',
      potentialSavings: 1800,
      status: 'implemented' as const,
      category: 'structure' as const,
      details: 'Durch die Implementierung von Sachbezügen wie Gutscheinen oder Prepaidkarten können Sie Ihren Mitarbeitern steuerfreie Zusatzleistungen gewähren.',
      requirements: [
        'Dokumentation der Sachbezüge',
        'Einhaltung der monatlichen Grenze von 50€',
        'Keine Bargeldauszahlung'
      ],
      employeeCount: 12,
      employeesAnalyzed: 5,
      employeesBenefiting: 3,
      netBenefitEmployee: 600,
      employerCost: 720
    },
    {
      id: 'fahrtkostenzuschuss',
      title: 'Fahrtkostenzuschuss',
      description: 'Zuschuss für Fahrten zwischen Wohnung und Arbeitsstätte',
      potentialSavings: 4440,
      status: 'potential' as const,
      category: 'cost' as const,
      details: 'Zuschuss für Fahrten zwischen Wohnung und Arbeitsstätte.',
      requirements: [
        'Nachweis der Fahrtkosten',
        'Einhaltung der Höchstgrenzen',
        'Dokumentation der Entfernung'
      ],
      employeeCount: 12,
      employeesAnalyzed: 5,
      employeesBenefiting: 0,
      netBenefitEmployee: 900,
      employerCost: 1080
    },
    {
      id: 'internetpauschale',
      title: 'Internetpauschale',
      description: 'Steuerfreier Zuschuss bis 50 € monatlich für private Internetnutzung',
      potentialSavings: 4440,
      status: 'potential' as const,
      category: 'tax' as const,
      details: 'Steuerfreier Zuschuss bis 50 € monatlich für private Internetnutzung.',
      requirements: [
        'Nachweis der Internetkosten',
        'Einhaltung der Höchstgrenzen',
        'Dokumentation der beruflichen Nutzung'
      ],
      employeeCount: 12,
      employeesAnalyzed: 5,
      employeesBenefiting: 0,
      netBenefitEmployee: 450,
      employerCost: 600
    }
  ]
};

export const mockRules: Rule[] = [
  {
    id: 'rule1',
    name: 'Sachbezüge',
    description: 'Prüfung der Sachbezüge-Optimierung',
    threshold: 50,
    enabled: true,
    category: 'structure'
  },
  {
    id: 'rule2',
    name: 'Betriebliche Altersvorsorge',
    description: 'Analyse der bAV-Möglichkeiten',
    threshold: 568,
    enabled: true,
    category: 'tax'
  },
  {
    id: 'rule3',
    name: 'Gesundheitsförderung',
    description: 'Prüfung der Gesundheitsmaßnahmen',
    threshold: 600,
    enabled: true,
    category: 'cost'
  }
];

export const getClientDetail = (id: string): ClientDetail | undefined => {
  const client = mockClients.find(c => c.id === id);
  if (!client) return undefined;
  
  return {
    ...client,
    optimizations: mockOptimizations[id as keyof typeof mockOptimizations] || [],
    employees: mockEmployees[id as keyof typeof mockEmployees] || [],
    totalEmployeesAnalyzed: id === '6' ? 12 : undefined
  };
};