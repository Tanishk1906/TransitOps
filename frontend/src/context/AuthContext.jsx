import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('transitops_user')) || null);

  const login = (userData) => {
    // Mocking a JWT token for the backend middleware
    const mockUser = { ...userData, token: 'mock_jwt_token_123' }; 
    setUser(mockUser);
    localStorage.setItem('transitops_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('transitops_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);