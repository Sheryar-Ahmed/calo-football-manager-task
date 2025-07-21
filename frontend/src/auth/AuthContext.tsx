import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { signIn as apiSignIn, getProfile } from "../api/auth";
import axiosInstance from "../utils/axios";

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Decode and check if token is expired
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (err) {
      return false;
    }
  };

  // Load user from token if valid
  const checkUserSession = async () => {
    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await getProfile();
      setUser(data);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await apiSignIn({ email, password });
      const token = data?.token;
      if (token) {
        localStorage.setItem("token", token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set it
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
