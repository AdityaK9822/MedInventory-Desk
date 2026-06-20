import { useState, useCallback, useMemo } from 'react';
import { flattenDrugs, buildBarcodeMap } from '../data/mockDrugs';


export function useBarcodeSearch(drugs) {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);


  const barcodeMap = useMemo(() => buildBarcodeMap(drugs), [drugs]);


  const lookup = useCallback((barcode) => {
    return barcodeMap.get(barcode) || null;
  }, [barcodeMap]);
  const search = useCallback((barcode) => {
    setQuery(barcode);
    const result = barcodeMap.get(barcode) || null;
    if (barcode.trim()) {
      setSearchHistory(prev => {
        const entry = {
          barcode,
          found: !!result,
          timestamp: new Date().toISOString(),
          drugName: result?.drugName || null,
        };
        return [entry, ...prev.filter(h => h.barcode !== barcode)].slice(0, 20);
      });
    }
    return result;
  }, [barcodeMap]);


  const partialSearch = useCallback((partial) => {
    if (!partial || partial.length < 2) return [];
    const results = [];
    const upperPartial = partial.toUpperCase();
    for (const [barcode, data] of barcodeMap.entries()) {
      if (barcode.toUpperCase().includes(upperPartial) || 
          data.drugName.toUpperCase().includes(upperPartial)) {
        results.push(data);
        if (results.length >= 10) break;
      }
    }
    return results;
  }, [barcodeMap]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    query,
    setQuery,
    lookup,
    search,
    partialSearch,
    searchHistory,
    clearHistory,
    totalEntries: barcodeMap.size,
  };
}
