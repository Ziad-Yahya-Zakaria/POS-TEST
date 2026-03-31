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

const moduleRoutes = [
  { path: 'purchases', pageKey: 'purchases' },
  { path: 'finance', pageKey: 'finance' },
  { path: 'reports', pageKey: 'reports' },
  { path: 'employees', pageKey: 'employees' },
  { path: 'integration', pageKey: 'integration' },
  { path: 'business-settings', pageKey: 'businessSettings' },
  { path: 'purchase-request', pageKey: 'purchaseRequest' },
  { path: 'purchase-confirmation', pageKey: 'purchaseConfirmation' },
  { path: 'employee-settings', pageKey: 'employeeSettings' },
  { path: 'product-settings', pageKey: 'productSettings' },
  { path: 'program-settings', pageKey: 'programSettings' },
  { path: 'branch-settings', pageKey: 'branchSettings' },
  { path: 'offer-settings', pageKey: 'offerSettings' },
  { path: 'customer-settings', pageKey: 'customerSettings' },
  { path: 'supplier-settings', pageKey: 'supplierSettings' },
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
