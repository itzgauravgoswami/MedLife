import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (token, userData, role) => {
    setToken(token);
    setUser(userData);
    setUserRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('deliveryToken');
    localStorage.removeItem('deliveryData');
    navigate('/');
  };

  const value = {
    user,
    userRole,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isPatient: userRole === 'patient',
    isDoctor: userRole === 'doctor',
    isAdmin: userRole === 'admin',
    isDelivery: userRole === 'delivery'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
