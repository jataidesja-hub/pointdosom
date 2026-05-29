import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './store/StoreContext';
import { StoreLayout } from './components/StoreLayout';
import ClientHome from './pages/ClientHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryStatus from './pages/DeliveryStatus';

function App() {
  return (
    <StoreProvider>
      <StoreLayout>
        <Router>
          <Routes>
            <Route path="/cliente" element={<ClientHome />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/entregue/:id" element={<DeliveryStatus />} />
            <Route path="/" element={<Navigate to="/cliente" replace />} />
            <Route path="*" element={<Navigate to="/cliente" replace />} />
          </Routes>
        </Router>
      </StoreLayout>
    </StoreProvider>
  );
}

export default App;
