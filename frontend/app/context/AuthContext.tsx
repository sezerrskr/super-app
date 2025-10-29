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
  isLoading: boolean;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  authToken: null,
  isLoading: true,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Token doğrulama (ileride backend ile entegre edebilirsin)
  const validateTokenOnServer = async (token: string): Promise<boolean> => {
    try {
      // API isteği simülasyonu (ileride backend'e bağlanacak)
      await new Promise((resolve) => setTimeout(resolve, 800));
      return !!token; // şimdilik token varsa geçerli
    } catch {
      return false;
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
      }
      setIsLoading(false);
      return;
    }

    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const isValid = await validateTokenOnServer(token);
        if (isValid) {
          setAuthToken(token);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
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
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authChecked");
    window.location.href = "/auth/login";
  };

  const value: AuthContextType = {
    isAuthenticated,
    authToken,
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
