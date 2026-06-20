// N-ary Tree structure for Drug Catalog
// Each node: { id, name, type: 'folder'|'drug', children?, ...drugData }

export const drugCatalog = {
  id: 'root',
  name: 'All Medicines',
  type: 'folder',
  children: [
    {
      id: 'cat-antibiotics',
      name: 'Antibiotics',
      type: 'folder',
      children: [
        {
          id: 'cat-penicillins',
          name: 'Penicillins',
          type: 'folder',
          children: [
            {
              id: 'drug-1',
              name: 'Amoxicillin 500mg',
              type: 'drug',
              genericName: 'Amoxicillin',
              manufacturer: 'Sun Pharma',
              category: 'Antibiotics',
              form: 'Capsule',
              strength: '500mg',
              totalStock: 450,
              reorderLevel: 100,
              unitPrice: 2.50,
              batches: [
                { batchId: 'B-AMX-001', barcode: 'MED-AMX-500-001', quantity: 200, expiry: '2026-08-15', location: 'Shelf A1' },
                { batchId: 'B-AMX-002', barcode: 'MED-AMX-500-002', quantity: 150, expiry: '2026-12-20', location: 'Shelf A1' },
                { batchId: 'B-AMX-003', barcode: 'MED-AMX-500-003', quantity: 100, expiry: '2026-07-01', location: 'Shelf A2' },
              ]
            },
            {
              id: 'drug-2',
              name: 'Ampicillin 250mg',
              type: 'drug',
              genericName: 'Ampicillin',
              manufacturer: 'Cipla',
              category: 'Antibiotics',
              form: 'Capsule',
              strength: '250mg',
              totalStock: 300,
              reorderLevel: 80,
              unitPrice: 1.80,
              batches: [
                { batchId: 'B-AMP-001', barcode: 'MED-AMP-250-001', quantity: 180, expiry: '2026-09-30', location: 'Shelf A2' },
                { batchId: 'B-AMP-002', barcode: 'MED-AMP-250-002', quantity: 120, expiry: '2027-03-15', location: 'Shelf A2' },
              ]
            },
          ]
        },
        {
          id: 'cat-cephalosporins',
          name: 'Cephalosporins',
          type: 'folder',
          children: [
            {
              id: 'drug-3',
              name: 'Cephalexin 500mg',
              type: 'drug',
              genericName: 'Cephalexin',
              manufacturer: 'Dr. Reddy\'s',
              category: 'Antibiotics',
              form: 'Tablet',
              strength: '500mg',
              totalStock: 180,
              reorderLevel: 50,
              unitPrice: 3.20,
              batches: [
                { batchId: 'B-CEP-001', barcode: 'MED-CEP-500-001', quantity: 100, expiry: '2026-07-10', location: 'Shelf A3' },
                { batchId: 'B-CEP-002', barcode: 'MED-CEP-500-002', quantity: 80, expiry: '2027-01-25', location: 'Shelf A3' },
              ]
            },
            {
              id: 'drug-4',
              name: 'Cefixime 200mg',
              type: 'drug',
              genericName: 'Cefixime',
              manufacturer: 'Lupin',
              category: 'Antibiotics',
              form: 'Tablet',
              strength: '200mg',
              totalStock: 220,
              reorderLevel: 60,
              unitPrice: 4.50,
              batches: [
                { batchId: 'B-CFX-001', barcode: 'MED-CFX-200-001', quantity: 120, expiry: '2026-11-05', location: 'Shelf A3' },
                { batchId: 'B-CFX-002', barcode: 'MED-CFX-200-002', quantity: 100, expiry: '2027-04-18', location: 'Shelf A4' },
              ]
            },
          ]
        },
        {
          id: 'drug-5',
          name: 'Azithromycin 500mg',
          type: 'drug',
          genericName: 'Azithromycin',
          manufacturer: 'Zydus',
          category: 'Antibiotics',
          form: 'Tablet',
          strength: '500mg',
          totalStock: 350,
          reorderLevel: 90,
          unitPrice: 5.00,
          batches: [
            { batchId: 'B-AZI-001', barcode: 'MED-AZI-500-001', quantity: 200, expiry: '2026-10-12', location: 'Shelf A4' },
            { batchId: 'B-AZI-002', barcode: 'MED-AZI-500-002', quantity: 150, expiry: '2027-02-28', location: 'Shelf A5' },
          ]
        },
      ]
    },
    {
      id: 'cat-analgesics',
      name: 'Analgesics & Anti-inflammatories',
      type: 'folder',
      children: [
        {
          id: 'drug-6',
          name: 'Paracetamol 500mg',
          type: 'drug',
          genericName: 'Acetaminophen',
          manufacturer: 'GSK',
          category: 'Analgesics',
          form: 'Tablet',
          strength: '500mg',
          totalStock: 800,
          reorderLevel: 200,
          unitPrice: 0.50,
          batches: [
            { batchId: 'B-PAR-001', barcode: 'MED-PAR-500-001', quantity: 400, expiry: '2027-06-15', location: 'Shelf B1' },
            { batchId: 'B-PAR-002', barcode: 'MED-PAR-500-002', quantity: 400, expiry: '2027-09-30', location: 'Shelf B1' },
          ]
        },
        {
          id: 'drug-7',
          name: 'Ibuprofen 400mg',
          type: 'drug',
          genericName: 'Ibuprofen',
          manufacturer: 'Abbott',
          category: 'Analgesics',
          form: 'Tablet',
          strength: '400mg',
          totalStock: 500,
          reorderLevel: 120,
          unitPrice: 1.20,
          batches: [
            { batchId: 'B-IBU-001', barcode: 'MED-IBU-400-001', quantity: 250, expiry: '2026-07-20', location: 'Shelf B2' },
            { batchId: 'B-IBU-002', barcode: 'MED-IBU-400-002', quantity: 250, expiry: '2027-01-10', location: 'Shelf B2' },
          ]
        },
        {
          id: 'drug-8',
          name: 'Diclofenac 50mg',
          type: 'drug',
          genericName: 'Diclofenac Sodium',
          manufacturer: 'Novartis',
          category: 'Analgesics',
          form: 'Tablet',
          strength: '50mg',
          totalStock: 300,
          reorderLevel: 80,
          unitPrice: 1.50,
          batches: [
            { batchId: 'B-DIC-001', barcode: 'MED-DIC-050-001', quantity: 150, expiry: '2026-08-25', location: 'Shelf B3' },
            { batchId: 'B-DIC-002', barcode: 'MED-DIC-050-002', quantity: 150, expiry: '2027-05-14', location: 'Shelf B3' },
          ]
        },
        {
          id: 'drug-9',
          name: 'Aspirin 325mg',
          type: 'drug',
          genericName: 'Acetylsalicylic Acid',
          manufacturer: 'Bayer',
          category: 'Analgesics',
          form: 'Tablet',
          strength: '325mg',
          totalStock: 600,
          reorderLevel: 150,
          unitPrice: 0.80,
          batches: [
            { batchId: 'B-ASP-001', barcode: 'MED-ASP-325-001', quantity: 300, expiry: '2026-06-25', location: 'Shelf B4' },
            { batchId: 'B-ASP-002', barcode: 'MED-ASP-325-002', quantity: 300, expiry: '2027-04-20', location: 'Shelf B4' },
          ]
        },
      ]
    },
    {
      id: 'cat-cardiovascular',
      name: 'Cardiovascular',
      type: 'folder',
      children: [
        {
          id: 'drug-10',
          name: 'Atenolol 50mg',
          type: 'drug',
          genericName: 'Atenolol',
          manufacturer: 'AstraZeneca',
          category: 'Cardiovascular',
          form: 'Tablet',
          strength: '50mg',
          totalStock: 200,
          reorderLevel: 50,
          unitPrice: 2.00,
          batches: [
            { batchId: 'B-ATE-001', barcode: 'MED-ATE-050-001', quantity: 100, expiry: '2026-09-18', location: 'Shelf C1' },
            { batchId: 'B-ATE-002', barcode: 'MED-ATE-050-002', quantity: 100, expiry: '2027-03-10', location: 'Shelf C1' },
          ]
        },
        {
          id: 'drug-11',
          name: 'Amlodipine 5mg',
          type: 'drug',
          genericName: 'Amlodipine Besylate',
          manufacturer: 'Pfizer',
          category: 'Cardiovascular',
          form: 'Tablet',
          strength: '5mg',
          totalStock: 280,
          reorderLevel: 70,
          unitPrice: 3.00,
          batches: [
            { batchId: 'B-AML-001', barcode: 'MED-AML-005-001', quantity: 140, expiry: '2026-10-30', location: 'Shelf C2' },
            { batchId: 'B-AML-002', barcode: 'MED-AML-005-002', quantity: 140, expiry: '2027-07-22', location: 'Shelf C2' },
          ]
        },
        {
          id: 'drug-12',
          name: 'Losartan 50mg',
          type: 'drug',
          genericName: 'Losartan Potassium',
          manufacturer: 'Merck',
          category: 'Cardiovascular',
          form: 'Tablet',
          strength: '50mg',
          totalStock: 160,
          reorderLevel: 40,
          unitPrice: 3.50,
          batches: [
            { batchId: 'B-LOS-001', barcode: 'MED-LOS-050-001', quantity: 80, expiry: '2026-07-15', location: 'Shelf C3' },
            { batchId: 'B-LOS-002', barcode: 'MED-LOS-050-002', quantity: 80, expiry: '2027-02-05', location: 'Shelf C3' },
          ]
        },
      ]
    },
    {
      id: 'cat-diabetes',
      name: 'Diabetes Management',
      type: 'folder',
      children: [
        {
          id: 'drug-13',
          name: 'Metformin 500mg',
          type: 'drug',
          genericName: 'Metformin HCl',
          manufacturer: 'Merck',
          category: 'Diabetes',
          form: 'Tablet',
          strength: '500mg',
          totalStock: 400,
          reorderLevel: 100,
          unitPrice: 1.00,
          batches: [
            { batchId: 'B-MET-001', barcode: 'MED-MET-500-001', quantity: 200, expiry: '2026-11-20', location: 'Shelf D1' },
            { batchId: 'B-MET-002', barcode: 'MED-MET-500-002', quantity: 200, expiry: '2027-06-30', location: 'Shelf D1' },
          ]
        },
        {
          id: 'drug-14',
          name: 'Glimepiride 2mg',
          type: 'drug',
          genericName: 'Glimepiride',
          manufacturer: 'Sanofi',
          category: 'Diabetes',
          form: 'Tablet',
          strength: '2mg',
          totalStock: 240,
          reorderLevel: 60,
          unitPrice: 2.80,
          batches: [
            { batchId: 'B-GLI-001', barcode: 'MED-GLI-002-001', quantity: 120, expiry: '2026-08-05', location: 'Shelf D2' },
            { batchId: 'B-GLI-002', barcode: 'MED-GLI-002-002', quantity: 120, expiry: '2027-01-18', location: 'Shelf D2' },
          ]
        },
        {
          id: 'drug-15',
          name: 'Insulin Glargine 100IU/mL',
          type: 'drug',
          genericName: 'Insulin Glargine',
          manufacturer: 'Novo Nordisk',
          category: 'Diabetes',
          form: 'Injection',
          strength: '100IU/mL',
          totalStock: 50,
          reorderLevel: 15,
          unitPrice: 45.00,
          batches: [
            { batchId: 'B-INS-001', barcode: 'MED-INS-100-001', quantity: 25, expiry: '2026-07-05', location: 'Cold Storage 1' },
            { batchId: 'B-INS-002', barcode: 'MED-INS-100-002', quantity: 25, expiry: '2026-09-15', location: 'Cold Storage 1' },
          ]
        },
      ]
    },
    {
      id: 'cat-respiratory',
      name: 'Respiratory',
      type: 'folder',
      children: [
        {
          id: 'drug-16',
          name: 'Salbutamol Inhaler 100mcg',
          type: 'drug',
          genericName: 'Salbutamol',
          manufacturer: 'GSK',
          category: 'Respiratory',
          form: 'Inhaler',
          strength: '100mcg',
          totalStock: 120,
          reorderLevel: 30,
          unitPrice: 8.00,
          batches: [
            { batchId: 'B-SAL-001', barcode: 'MED-SAL-100-001', quantity: 60, expiry: '2026-12-10', location: 'Shelf E1' },
            { batchId: 'B-SAL-002', barcode: 'MED-SAL-100-002', quantity: 60, expiry: '2027-05-22', location: 'Shelf E1' },
          ]
        },
        {
          id: 'drug-17',
          name: 'Montelukast 10mg',
          type: 'drug',
          genericName: 'Montelukast Sodium',
          manufacturer: 'Sun Pharma',
          category: 'Respiratory',
          form: 'Tablet',
          strength: '10mg',
          totalStock: 200,
          reorderLevel: 50,
          unitPrice: 4.00,
          batches: [
            { batchId: 'B-MON-001', barcode: 'MED-MON-010-001', quantity: 100, expiry: '2026-10-01', location: 'Shelf E2' },
            { batchId: 'B-MON-002', barcode: 'MED-MON-010-002', quantity: 100, expiry: '2027-08-15', location: 'Shelf E2' },
          ]
        },
        {
          id: 'drug-18',
          name: 'Cetirizine 10mg',
          type: 'drug',
          genericName: 'Cetirizine HCl',
          manufacturer: 'Cipla',
          category: 'Respiratory',
          form: 'Tablet',
          strength: '10mg',
          totalStock: 500,
          reorderLevel: 120,
          unitPrice: 0.60,
          batches: [
            { batchId: 'B-CET-001', barcode: 'MED-CET-010-001', quantity: 250, expiry: '2026-06-20', location: 'Shelf E3' },
            { batchId: 'B-CET-002', barcode: 'MED-CET-010-002', quantity: 250, expiry: '2027-03-08', location: 'Shelf E3' },
          ]
        },
      ]
    },
    {
      id: 'cat-gastrointestinal',
      name: 'Gastrointestinal',
      type: 'folder',
      children: [
        {
          id: 'drug-19',
          name: 'Omeprazole 20mg',
          type: 'drug',
          genericName: 'Omeprazole',
          manufacturer: 'AstraZeneca',
          category: 'Gastrointestinal',
          form: 'Capsule',
          strength: '20mg',
          totalStock: 350,
          reorderLevel: 90,
          unitPrice: 2.20,
          batches: [
            { batchId: 'B-OME-001', barcode: 'MED-OME-020-001', quantity: 175, expiry: '2026-08-30', location: 'Shelf F1' },
            { batchId: 'B-OME-002', barcode: 'MED-OME-020-002', quantity: 175, expiry: '2027-04-12', location: 'Shelf F1' },
          ]
        },
        {
          id: 'drug-20',
          name: 'Pantoprazole 40mg',
          type: 'drug',
          genericName: 'Pantoprazole Sodium',
          manufacturer: 'Sun Pharma',
          category: 'Gastrointestinal',
          form: 'Tablet',
          strength: '40mg',
          totalStock: 280,
          reorderLevel: 70,
          unitPrice: 2.80,
          batches: [
            { batchId: 'B-PAN-001', barcode: 'MED-PAN-040-001', quantity: 140, expiry: '2026-09-25', location: 'Shelf F2' },
            { batchId: 'B-PAN-002', barcode: 'MED-PAN-040-002', quantity: 140, expiry: '2027-06-18', location: 'Shelf F2' },
          ]
        },
        {
          id: 'drug-21',
          name: 'Ondansetron 4mg',
          type: 'drug',
          genericName: 'Ondansetron HCl',
          manufacturer: 'Zydus',
          category: 'Gastrointestinal',
          form: 'Tablet',
          strength: '4mg',
          totalStock: 150,
          reorderLevel: 40,
          unitPrice: 3.50,
          batches: [
            { batchId: 'B-OND-001', barcode: 'MED-OND-004-001', quantity: 75, expiry: '2026-07-28', location: 'Shelf F3' },
            { batchId: 'B-OND-002', barcode: 'MED-OND-004-002', quantity: 75, expiry: '2027-02-14', location: 'Shelf F3' },
          ]
        },
        {
          id: 'drug-22',
          name: 'Ranitidine 150mg',
          type: 'drug',
          genericName: 'Ranitidine HCl',
          manufacturer: 'GSK',
          category: 'Gastrointestinal',
          form: 'Tablet',
          strength: '150mg',
          totalStock: 90,
          reorderLevel: 30,
          unitPrice: 1.10,
          batches: [
            { batchId: 'B-RAN-001', barcode: 'MED-RAN-150-001', quantity: 45, expiry: '2026-06-22', location: 'Shelf F4' },
            { batchId: 'B-RAN-002', barcode: 'MED-RAN-150-002', quantity: 45, expiry: '2026-11-08', location: 'Shelf F4' },
          ]
        },
      ]
    },
  ]
};

// Flatten the tree to get all drugs (for barcode lookup, stock ops, etc.)
export function flattenDrugs(node, result = []) {
  if (node.type === 'drug') {
    const totalStock = node.batches.reduce((sum, b) => sum + b.quantity, 0);
    result.push({ ...node, totalStock });
  }
  if (node.children) {
    node.children.forEach(child => flattenDrugs(child, result));
  }
  return result;
}

// Build a barcode -> drug+batch Map for O(1) lookup
export function buildBarcodeMap(drugs) {
  const map = new Map();
  drugs.forEach(drug => {
    drug.batches.forEach(batch => {
      map.set(batch.barcode, {
        drugId: drug.id,
        drugName: drug.name,
        genericName: drug.genericName,
        manufacturer: drug.manufacturer,
        category: drug.category,
        form: drug.form,
        strength: drug.strength,
        batchId: batch.batchId,
        barcode: batch.barcode,
        quantity: batch.quantity,
        expiry: batch.expiry,
        location: batch.location,
      });
    });
  });
  return map;
}
