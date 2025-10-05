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
import SocialMediaForm from "./pages/SocialMediaForm";
import IndustriaForm from "./pages/IndustriaForm";
import HeroForm from "./pages/HeroForm";
import MercadoForm from "./pages/MercadoForm";

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
          <Route
            path="/admin/redes-sociales/nueva"
            element={<SocialMediaForm />}
          />
          <Route
            path="/admin/redes-sociales/:id"
            element={<SocialMediaForm />}
          />
          <Route path="/admin/industrias/nueva" element={<IndustriaForm />} />
          <Route path="/admin/industrias/:id" element={<IndustriaForm />} />
          <Route path="/admin/heroes/nuevo" element={<HeroForm />} />
          <Route path="/admin/heroes/:id" element={<HeroForm />} />
          <Route path="/admin/mercados/nuevo" element={<MercadoForm />} />
          <Route path="/admin/mercados/:id" element={<MercadoForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
