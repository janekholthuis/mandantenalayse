import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  requirement: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 15,
  },
  financialBox: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  amount: {
    fontSize: 20,
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#666',
  }
});

const OptimizationPDF = ({ 
  title, 
  description, 
  requirements,
  netBenefitEmployee,
  employerCost,
  employeesBenefiting,
  totalEmployees,
  employeesAnalyzed,
  potentialEmployees,
  totalPotentialSavings,
  totalPotentialCost
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anforderungen</Text>
        {requirements.map((req, index) => (
          <Text key={index} style={styles.requirement}>• {req}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Finanzielle Auswirkungen</Text>
        
        <View style={[styles.financialBox, { backgroundColor: '#f0fdf4' }]}>
          <Text style={styles.sectionTitle}>Netto-Gewinn für Arbeitnehmer</Text>
          <Text style={styles.amount}>{netBenefitEmployee.toLocaleString('de-DE')} € pro Jahr</Text>
          <Text style={styles.text}>pro Mitarbeiter ({(netBenefitEmployee / 12).toLocaleString('de-DE')} € monatlich)</Text>
          
          {potentialEmployees > 0 && (
            <>
              <Text style={styles.amount}>{totalPotentialSavings.toLocaleString('de-DE')} € Gesamtpotenzial</Text>
              <Text style={styles.text}>für {potentialEmployees} potenzielle Mitarbeiter</Text>
            </>
          )}
        </View>

        <View style={[styles.financialBox, { backgroundColor: '#f8fafc' }]}>
          <Text style={styles.sectionTitle}>Kosten für Arbeitgeber</Text>
          <Text style={styles.amount}>{employerCost.toLocaleString('de-DE')} € pro Jahr</Text>
          <Text style={styles.text}>pro Mitarbeiter (inkl. {((employerCost - netBenefitEmployee) / 12).toLocaleString('de-DE')} € monatliche Verwaltungskosten)</Text>
          
          {potentialEmployees > 0 && (
            <>
              <Text style={styles.amount}>{totalPotentialCost.toLocaleString('de-DE')} € Gesamtinvestition</Text>
              <Text style={styles.text}>für {potentialEmployees} potenzielle Mitarbeiter</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktuelle Nutzung</Text>
        <Text style={styles.text}>Aktive Mitarbeiter: {employeesBenefiting} von {totalEmployees}</Text>
        <Text style={styles.text}>Analysierte Mitarbeiter: {employeesAnalyzed} von {totalEmployees}</Text>
        {employeesAnalyzed < totalEmployees && (
          <Text style={styles.text}>
            Hinweis: Für {totalEmployees - employeesAnalyzed} Mitarbeiter liegen noch keine Analysedaten vor.
          </Text>
        )}
      </View>
    </Page>
  </Document>
);

interface OptimizationCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  employeeCount?: number;
  totalEmployees?: number;
  employeesAnalyzed?: number;
  employeesBenefiting?: number;
  requirements?: string[];
  netBenefitEmployee?: number;
  employerCost?: number;
}

const OptimizationCard: React.FC<OptimizationCardProps> = ({
  title,
  description,
  isActive,
  onToggle,
  employeeCount = 0,
  totalEmployees = 0,
  employeesAnalyzed = 0,
  employeesBenefiting = 0,
  requirements = [],
  netBenefitEmployee = 600,
  employerCost = 720
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const potentialEmployees = employeesAnalyzed - employeesBenefiting;
  const totalPotentialSavings = potentialEmployees * netBenefitEmployee;
  const totalPotentialCost = potentialEmployees * employerCost;

  const getProgressBars = () => {
    const total = 100;
    const benefitingWidth = (employeesAnalyzed > 0 || employeesBenefiting > 0) ? 
      (employeesBenefiting / totalEmployees) * 100 : 
      0;
    const analyzedWidth = (employeesAnalyzed / totalEmployees) * 100;
    const potentialWidth = analyzedWidth - benefitingWidth;
    const unanalyzedWidth = 100 - analyzedWidth;

    return (
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {benefitingWidth >= 0 && (
          <div 
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
            style={{ width: `${benefitingWidth}%` }}
          />
        )}
        {potentialWidth > 0 && (
          <div 
            className="absolute h-full bg-yellow-400 transition-all duration-300"
            style={{ 
              left: `${benefitingWidth}%`,
              width: `${potentialWidth}%`
            }}
          />
        )}
        {unanalyzedWidth > 0 && (
          <div 
            className="absolute right-0 top-0 h-full bg-gray-300 transition-all duration-300"
            style={{ width: `${unanalyzedWidth}%` }}
          />
        )}
      </div>
    );
  };

  const getLegend = () => {
    if (employeesAnalyzed === 0 && employeesBenefiting === 0) return null;
    
    return (
      <div className="mt-2 flex items-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
          <span className="text-gray-600">{employeesBenefiting} Aktiv</span>
        </div>
        {potentialEmployees > 0 && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1" />
            <span className="text-gray-600">{potentialEmployees} Potentiell</span>
          </div>
        )}
        {(totalEmployees - employeesAnalyzed) > 0 && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1" />
            <span className="text-gray-600">{totalEmployees - employeesAnalyzed} Unanalysiert</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setShowDetails(true)}
        className="w-full text-left"
      >
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-600 font-medium">
                {employeesBenefiting}/{totalEmployees} Mitarbeiter
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            {getProgressBars()}
            {getLegend()}
          </div>
        </div>
      </button>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <PDFDownloadLink
                  document={
                    <OptimizationPDF
                      title={title}
                      description={description}
                      requirements={requirements}
                      netBenefitEmployee={netBenefitEmployee}
                      employerCost={employerCost}
                      employeesBenefiting={employeesBenefiting}
                      totalEmployees={totalEmployees}
                      employeesAnalyzed={employeesAnalyzed}
                      potentialEmployees={potentialEmployees}
                      totalPotentialSavings={totalPotentialSavings}
                      totalPotentialCost={totalPotentialCost}
                    />
                  }
                  fileName={`${title.toLowerCase().replace(/\s+/g, '-')}-optimierung.pdf`}
                >
                  {({ loading }) => (
                    <button
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                      title="Als PDF herunterladen"
                    >
                      <Download size={20} />
                    </button>
                  )}
                </PDFDownloadLink>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Anforderungen</h3>
                <ul className="space-y-1">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                      <span className="text-blue-800">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Netto-Gewinn für Arbeitnehmer</h4>
                  <p className="text-2xl font-bold text-green-600">{netBenefitEmployee.toLocaleString('de-DE')} €</p>
                  <p className="text-xs text-green-700">pro Mitarbeiter/Jahr</p>
                  {potentialEmployees > 0 && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-lg font-bold text-green-600">{totalPotentialSavings.toLocaleString('de-DE')} €</p>
                      <p className="text-xs text-green-700">Potenzial für {potentialEmployees} MA/Jahr</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-1">Kosten für Arbeitgeber</h4>
                  <p className="text-2xl font-bold text-gray-600">{employerCost.toLocaleString('de-DE')} €</p>
                  <p className="text-xs text-gray-700">pro Mitarbeiter/Jahr</p>
                  {potentialEmployees > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-lg font-bold text-gray-600">{totalPotentialCost.toLocaleString('de-DE')} €</p>
                      <p className="text-xs text-gray-700">Investition für {potentialEmployees} MA/Jahr</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Aktuelle Nutzung</h4>
                {getProgressBars()}
                {getLegend()}
              </div>
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OptimizationCard;