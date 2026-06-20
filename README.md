# MedInventory-Desk 💊

A comprehensive Pharmacy Inventory Management System designed for clinics and hospitals to track medicine stock, manage batches, and optimize drug dispensing.

## 🚀 Features

### 📦 Inventory & Stock Management
- **Drug Catalog**: A detailed, tree-structured catalog for organizing medicines.
- **Shelf Manager**: Visual representation of medicine placement with optimized bin-packing logic.
- **Expiration Sorter**: Automatic tracking and sorting of medicines by expiration date to minimize waste.
- **Stock Undo**: A robust undo/redo system for inventory adjustments.

### ⚡ Dispensing & Workflow
- **Prescription Queue**: Manages pending prescriptions with priority handling.
- **Barcode Checker**: Fast search and verification using barcode scanning simulation.
- **Dispensing Rules**: Customizable rules for how medicines are dispensed and prioritized.

### 🗺️ Logistics & Analytics
- **Delivery Route Optimization**: Uses Dijkstra's algorithm to find the most efficient path for medicine delivery within the facility.
- **Interactive Dashboard**: Real-time analytics and stock overviews powered by Recharts.

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: GSAP
- **Icons**: Lucide React & React Icons
- **Charts**: Recharts
- **Routing**: React Router DOM

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AdityaK9822/MedInventory-Desk.git
   cd MedInventory-Desk
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to `http://localhost:5173` in your browser.

## 📁 Project Structure

- `src/components/`: All UI components categorized by feature (Dashboard, ShelfManager, etc.).
- `src/context/`: Global state management for Inventory, Theme, and Dispensing Rules.
- `src/hooks/`: Custom logic for Bin Packing, Priority Queues, and Barcode Searching.
- `src/utils/`: Core algorithms (Dijkstra's, Expiration Sorting, Undo Logic).
- `src/data/`: Mock data for medications, prescriptions, and facility graphs.

---
*Developed as a final project for professional pharmacy management.*
