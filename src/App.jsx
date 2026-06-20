import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import DrugCatalog from './components/DrugCatalog/DrugCatalog';
import StockUndo from './components/StockUndo/StockUndo';
import PrescriptionQueue from './components/PrescriptionQueue/PrescriptionQueue';
import BarcodeChecker from './components/BarcodeChecker/BarcodeChecker';
import ExpirationSorter from './components/ExpirationSorter/ExpirationSorter';
import DispensingRules from './components/DispensingRules/DispensingRules';
import DeliveryRoute from './components/DeliveryRoute/DeliveryRoute';
import ShelfManager from './components/ShelfManager/ShelfManager';

// Context Providers
import { InventoryProvider } from './context/InventoryContext';
import { DispensingRulesProvider } from './context/DispensingRulesContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <InventoryProvider>
        <DispensingRulesProvider>
          <BrowserRouter>
            <div className="app-layout">
              <Sidebar />
              <div className="main-area">
                <Header />
                <main className="page-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/catalogs" element={<DrugCatalog />} />
                    <Route path="/undo" element={<StockUndo />} />
                    <Route path="/queue" element={<PrescriptionQueue />} />
                    <Route path="/barcode" element={<BarcodeChecker />} />
                    <Route path="/expiration" element={<ExpirationSorter />} />
                    <Route path="/rules" element={<DispensingRules />} />
                    <Route path="/routing" element={<DeliveryRoute />} />
                    <Route path="/shelf" element={<ShelfManager />} />
                  </Routes>
                </main>
              </div>
            </div>
          </BrowserRouter>
        </DispensingRulesProvider>
      </InventoryProvider>
    </ThemeProvider>
  );
}

export default App;
