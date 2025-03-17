import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for newer versions

import { useNavigate } from "react-router-dom"; // Import for redirection

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // For redirection

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.error("Token expired");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
          navigate("/login"); // Redirect to login on expiry
        } else {
          setUser(decoded);
          setIsAuthenticated(true);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Auto-redirect based on role
          switch (decoded.role) {
            case "Admin":
              navigate("/admin");
              break;
            case "Agent":
              navigate("/agent");
              break;
            case "Vendor":
              navigate("/vendor");
              break;
            default:
              navigate("/login");
          }
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      console.error("Token expired at login");
      logout();
      return;
    }

    localStorage.setItem("token", token);
    setUser(decoded);
    setIsAuthenticated(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login"); // Redirect on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
