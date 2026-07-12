import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('transitops_user')) || null);

  const login = async (username, password) => {
    // We import axios or use the api service to avoid circular dependency if possible, but let's use standard fetch or import api
    // Wait, let's just use fetch to keep it simple, or import api.
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    const mockUser = { name: username, email: username, role: data.role, token: data.access_token }; 
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