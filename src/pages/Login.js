import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Container, Box, TextField, Button, Typography, Paper, Divider,
  CircularProgress, Snackbar, Alert, InputAdornment, IconButton
} from "@mui/material";
import {
  LockOutlined as LockIcon, Visibility, VisibilityOff,
  Google as GoogleIcon, Email as EmailIcon
} from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");
    const refreshToken = urlParams.get("refreshToken");
    const role = urlParams.get("role");

    if (accessToken && refreshToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      login(accessToken);

      switch (role) {
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
          navigate("/");
          break;
      }
    }
  }, [navigate, login]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await axios.post(
        "https://r0rvz7pf-3000.inc1.devtunnels.ms/api/auth/login",
        { email, password }
      );
  
      const { accessToken, refreshToken } = response.data.data;
      if (!accessToken) throw new Error("Token not received from server");
  
      // Save tokens to localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      login(accessToken);
  
      // Fetch user details
      const userDetailsResponse = await axios.get(
        "https://r0rvz7pf-3000.inc1.devtunnels.ms/api/user/loggedUser",
        // {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // }
      );
  
      const { role } = userDetailsResponse.data.data;
  
      // Redirect based on role
      switch (role) {
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
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login Failed", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = "https://r0rvz7pf-3000.inc1.devtunnels.ms/api/auth/google";
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
          <Box sx={{ bgcolor: "primary.main", color: "white", width: 64, height: 64, borderRadius: "30%", mb: 2 }}>
            <LockIcon fontSize="large" />
          </Box>

          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Welcome Back
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon style={{ color: "#4285F4" }} />}
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            {googleLoading ? <CircularProgress size={24} /> : "Continue with Google"}
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || googleLoading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Login;
