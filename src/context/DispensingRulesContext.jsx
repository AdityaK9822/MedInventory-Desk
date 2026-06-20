import { createContext, useContext, useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';

const DispensingRulesContext = createContext(null);

const defaultRules = [
  {
    id: 'rule-1',
    drugId: 'drug-1',
    maxDailyDose: '3000mg',
    maxSingleDose: '500mg',
    frequency: 'TID (3 times daily)',
    requiresApproval: false,
    ageRestriction: 'All ages (weight-based for children)',
    contraindications: ['Penicillin allergy', 'Mononucleosis'],
    interactions: ['Warfarin', 'Methotrexate'],
    notes: 'Take with or without food. Complete full course.',
    severity: 'low',
  },
  {
    id: 'rule-2',
    drugId: 'drug-15',
    maxDailyDose: '80 IU',
    maxSingleDose: '40 IU',
    frequency: 'Once daily (same time each day)',
    requiresApproval: true,
    ageRestriction: '6+ years',
    contraindications: ['Hypoglycemia episode', 'Known allergy to insulin glargine'],
    interactions: ['Beta-blockers (mask hypoglycemia)', 'ACE inhibitors', 'Thiazolidinediones'],
    notes: 'Store in refrigerator (2-8°C). Do NOT freeze. Discard after 28 days once opened.',
    severity: 'high',
  },
  {
    id: 'rule-3',
    drugId: 'drug-7',
    maxDailyDose: '1200mg',
    maxSingleDose: '400mg',
    frequency: 'TID after meals',
    requiresApproval: false,
    ageRestriction: '12+ years',
    contraindications: ['Active GI bleeding', 'Severe renal impairment', 'Third trimester pregnancy'],
    interactions: ['Aspirin', 'Warfarin', 'Lithium', 'ACE inhibitors'],
    notes: 'Take with food. Avoid alcohol. Monitor renal function with prolonged use.',
    severity: 'medium',
  },
  {
    id: 'rule-4',
    drugId: 'drug-10',
    maxDailyDose: '100mg',
    maxSingleDose: '50mg',
    frequency: 'Once or twice daily',
    requiresApproval: false,
    ageRestriction: '18+ years',
    contraindications: ['Severe bradycardia', 'Heart block (2nd/3rd degree)', 'Decompensated heart failure'],
    interactions: ['Calcium channel blockers', 'Digoxin', 'Clonidine'],
    notes: 'Do not abruptly discontinue — taper over 1-2 weeks. Monitor HR and BP.',
    severity: 'medium',
  },
  {
    id: 'rule-5',
    drugId: 'drug-13',
    maxDailyDose: '2550mg',
    maxSingleDose: '850mg',
    frequency: 'BID or TID with meals',
    requiresApproval: false,
    ageRestriction: '10+ years',
    contraindications: ['eGFR < 30 mL/min', 'Metabolic acidosis', 'Heavy alcohol use'],
    interactions: ['Contrast dye (hold 48h)', 'Cimetidine', 'Carbonic anhydrase inhibitors'],
    notes: 'Take with meals to reduce GI side effects. Hold before surgery or iodinated contrast.',
    severity: 'medium',
  },
  {
    id: 'rule-6',
    drugId: 'drug-21',
    maxDailyDose: '16mg',
    maxSingleDose: '8mg',
    frequency: 'Every 8 hours PRN',
    requiresApproval: false,
    ageRestriction: '6 months+',
    contraindications: ['Congenital long QT syndrome', 'Concomitant apomorphine'],
    interactions: ['Apomorphine', 'Serotonergic drugs (risk of serotonin syndrome)', 'QT-prolonging agents'],
    notes: 'May cause headache and constipation. ECG monitoring for high-dose IV use.',
    severity: 'low',
  },
];

export function DispensingRulesProvider({ children }) {
  const [rules, setRules] = useState(defaultRules);

  const addRule = useCallback((rule) => {
    const newRule = { ...rule, id: generateId('rule') };
    setRules(prev => [...prev, newRule]);
    return newRule;
  }, []);

  const updateRule = useCallback((id, updates) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteRule = useCallback((id) => {
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  const getRuleForDrug = useCallback((drugId) => {
    return rules.find(r => r.drugId === drugId) || null;
  }, [rules]);

  return (
    <DispensingRulesContext.Provider value={{ rules, addRule, updateRule, deleteRule, getRuleForDrug }}>
      {children}
    </DispensingRulesContext.Provider>
  );
}

export function useDispensingRules() {
  const ctx = useContext(DispensingRulesContext);
  if (!ctx) throw new Error('useDispensingRules must be used within DispensingRulesProvider');
  return ctx;
}
