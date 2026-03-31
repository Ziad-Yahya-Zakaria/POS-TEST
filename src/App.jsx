import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { PosLayout } from './components/PosLayout.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { SalesPage } from './pages/SalesPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { ModulePage } from './pages/ModulePage.jsx'
import { InvoiceDesignerPage } from './pages/InvoiceDesignerPage.jsx'
import { BusinessTypePage } from './pages/BusinessTypePage.jsx'
import { SupportPage } from './pages/SupportPage.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { BranchSettingsPage } from './pages/BranchSettingsPage.jsx'
import { CustomerSettingsPage } from './pages/CustomerSettingsPage.jsx'
import { EmployeesPage } from './pages/EmployeesPage.jsx'
import { EmployeeSettingsPage } from './pages/EmployeeSettingsPage.jsx'
import { ProductSettingsPage } from './pages/ProductSettingsPage.jsx'
import { SupplierSettingsPage } from './pages/SupplierSettingsPage.jsx'

const moduleRoutes = [
  { path: 'purchases', pageKey: 'purchases' },
  { path: 'finance', pageKey: 'finance' },
  { path: 'reports', pageKey: 'reports' },
  { path: 'integration', pageKey: 'integration' },
  { path: 'business-settings', pageKey: 'businessSettings' },
  { path: 'purchase-request', pageKey: 'purchaseRequest' },
  { path: 'purchase-confirmation', pageKey: 'purchaseConfirmation' },
  { path: 'program-settings', pageKey: 'programSettings' },
  { path: 'offer-settings', pageKey: 'offerSettings' },
  { path: 'customer-returns', pageKey: 'customerReturns' },
  { path: 'purchase-returns', pageKey: 'purchaseReturns' },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PosLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employee-settings" element={<EmployeeSettingsPage />} />
          <Route path="/branch-settings" element={<BranchSettingsPage />} />
          <Route path="/product-settings" element={<ProductSettingsPage />} />
          <Route path="/customer-settings" element={<CustomerSettingsPage />} />
          <Route path="/supplier-settings" element={<SupplierSettingsPage />} />
          <Route path="/invoice-designer" element={<InvoiceDesignerPage />} />
          <Route path="/business-type" element={<BusinessTypePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          {moduleRoutes.map((route) => (
            <Route
              key={route.path}
              path={`/${route.path}`}
              element={<ModulePage pageKey={route.pageKey} />}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
