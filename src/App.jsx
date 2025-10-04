import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/templates/MainLayout';
import Home from './pages/Home';
import QuienesSomos from './pages/QuienesSomos';
import MercadoDetail from './pages/MercadoDetail';
import Productos from './pages/Productos';
import ProductoDetail from './pages/ProductoDetail';
import Soporte from './pages/Soporte';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import Admin from './pages/Admin';
import ProductoForm from './pages/ProductoForm';
import CategoriaForm from './pages/CategoriaForm';
import ProveedorForm from './pages/ProveedorForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="quienes-somos" element={<QuienesSomos />} />
            <Route path="mercado/:sector" element={<MercadoDetail />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/:categoria" element={<ProductoDetail />} />
            <Route path="soporte" element={<Soporte />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
          <Route path="/admin/productos/:id" element={<ProductoForm />} />
          <Route path="/admin/categorias/nueva" element={<CategoriaForm />} />
          <Route path="/admin/categorias/:id" element={<CategoriaForm />} />
          <Route path="/admin/proveedores/nuevo" element={<ProveedorForm />} />
          <Route path="/admin/proveedores/:id" element={<ProveedorForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
