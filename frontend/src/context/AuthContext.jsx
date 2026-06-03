import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("gullyhunt_user") || "null")
  );
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      setUser(data);
      localStorage.setItem("gullyhunt_user", JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      setUser(data);
      localStorage.setItem("gullyhunt_user", JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Register failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gullyhunt_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);