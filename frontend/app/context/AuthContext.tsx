"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  username: string | null;
  userId: string | null;
  isLoading: boolean;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  authToken: null,
  username: null,
  userId: null,
  isLoading: true,
  logout: () => { },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);


  // Token doğrulama: backend /auth/me ile gerçek kontrol
  const validateTokenOnServer = async (token: string): Promise<{ valid: boolean; username?: string; id?: string; }> => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!res.ok) return { valid: false };
      const data = await res.json();
      return { valid: true, username: data.username, id: data.id };
    } catch {
      return { valid: false };
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR koruması

    const alreadyChecked = sessionStorage.getItem("authChecked");

    if (alreadyChecked === "true") {
      const token = localStorage.getItem("authToken");
      if (token) {
        setAuthToken(token);
        setIsAuthenticated(true);
        const storedUsername = localStorage.getItem("username");
        const storedUserId = localStorage.getItem("userId");
        if (storedUsername) setUsername(storedUsername);
        if (storedUserId) setUserId(storedUserId);
      }
      setIsLoading(false);
      return;
    }

    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const result = await validateTokenOnServer(token);
        if (result.valid) {
          setAuthToken(token);
          setIsAuthenticated(true);
          if (result.username) setUsername(result.username);
          if (result.id) setUserId(result.id);
          // localStorage'i de senkron tutalım
          if (result.username) localStorage.setItem('username', result.username);
          if (result.id) localStorage.setItem('userId', result.id);
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("username");
          localStorage.removeItem("userId");
        }
      }
      setIsLoading(false);
      sessionStorage.setItem("authChecked", "true");
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("authChecked");
    window.location.href = "/auth/login";
  };

  const value: AuthContextType = {
    isAuthenticated,
    authToken,
    username,
    userId,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-xl space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          <p>Oturum kontrol ediliyor...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Hook olarak kullanmak için:
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
