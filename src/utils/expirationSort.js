// Sort batches by expiration date and categorize by urgency

export function getExpiryUrgency(expiryDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { level: 'expired', label: 'Expired', days: diffDays, color: 'var(--color-danger)' };
  if (diffDays <= 30) return { level: 'critical', label: '≤ 30 Days', days: diffDays, color: 'var(--color-danger-light)' };
  if (diffDays <= 90) return { level: 'warning', label: '≤ 90 Days', days: diffDays, color: 'var(--color-warning)' };
  if (diffDays <= 180) return { level: 'caution', label: '≤ 6 Months', days: diffDays, color: 'var(--color-warning-light)' };
  return { level: 'safe', label: 'Safe', days: diffDays, color: 'var(--color-success)' };
}

// Flatten all batches from all drugs and sort by expiry ascending
export function getSortedBatchesByExpiry(drugs) {
  const allBatches = [];

  drugs.forEach(drug => {
    drug.batches.forEach(batch => {
      const urgency = getExpiryUrgency(batch.expiry);
      allBatches.push({
        ...batch,
        drugId: drug.id,
        drugName: drug.name,
        genericName: drug.genericName,
        category: drug.category,
        manufacturer: drug.manufacturer,
        urgency,
        _timestamp: new Date(batch.expiry).getTime(),
      });
    });
  });

  // Sort ascending by expiry date (soonest first)
  allBatches.sort((a, b) => a._timestamp - b._timestamp);

  return allBatches;
}

// Group batches by urgency level
export function groupByUrgency(sortedBatches) {
  const groups = {
    expired: [],
    critical: [],
    warning: [],
    caution: [],
    safe: [],
  };

  sortedBatches.forEach(batch => {
    groups[batch.urgency.level].push(batch);
  });

  return groups;
}
