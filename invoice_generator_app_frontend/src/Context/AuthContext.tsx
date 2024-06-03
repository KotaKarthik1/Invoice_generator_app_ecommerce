import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    const role = localStorage.getItem('role');
    return role === 'admin';
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      if (role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsLoggedIn(true);
    if (role === 'admin') {
      setIsAdmin(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
