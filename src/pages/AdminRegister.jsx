import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/atoms/Button';
import './AdminLogin.css';

const AdminRegister = () => {
  const [email, setEmail] = useState('admin@gclab.com');
  const [password, setPassword] = useState('Admin123!');
  const [confirmPassword, setConfirmPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess('Usuario creado exitosamente. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Crear Usuario Admin</h1>
          <p className="login-subtitle">Registra el primer usuario administrador</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@gclab.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite la contraseña"
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creando usuario...' : 'Crear Usuario'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href="/admin/login" style={{ color: '#0066cc', fontSize: '14px' }}>
                ¿Ya tienes cuenta? Inicia sesión
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
