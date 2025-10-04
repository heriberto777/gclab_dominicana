import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          const { user: currentUser, error } = await apiClient.getUser();
          if (!error && currentUser) {
            setUser(currentUser);
          } else {
            apiClient.clearToken();
            setUser(null);
          }
        } catch (error) {
          console.error('Auth init error:', error);
          apiClient.clearToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { user: newUser, error } = await apiClient.signIn(email, password);
      if (error) {
        return { data: null, error };
      }
      setUser(newUser);
      return { data: { user: newUser }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email, password) => {
    try {
      const { user: newUser, error } = await apiClient.signUp(email, password);
      if (error) {
        return { data: null, error };
      }
      setUser(newUser);
      return { data: { user: newUser }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await apiClient.signOut();
      setUser(null);
      return { error };
    } catch (error) {
      setUser(null);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
