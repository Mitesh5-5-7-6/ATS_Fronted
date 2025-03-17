
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminVendor from "./pages/admin/AdminVendor"
import AdminProfile from "./pages/admin/AdminProfile";
import AdminServices from "./pages/admin/AdminService";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentOrders from "./pages/agent/AgentOrders";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorProfile from "./pages/vendor/VendorProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./Layout/AdminLayout";
import AgentLayout from "./Layout/AgentLayout";
import VendorLayout from "./Layout/VendorLayout";
import LogoutPage from "./components/Logout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<LogoutPage />} />

          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="Admin">
                <AdminLayout/>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="vendors" element={<AdminVendor />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          
          {/* Agent Routes */}
          <Route 
            path="/agent" 
            element={
              <ProtectedRoute role="Agent">
                <AgentLayout/>
              </ProtectedRoute>
            }
          >
            <Route index element={<AgentDashboard />} />
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/orders" element={<AgentOrders />} />
            <Route path="profile" element={<AgentProfile />} />
           
          </Route>
          <Route
            path="/vendor"
            element={
              <ProtectedRoute role="Vendor">
                <VendorLayout />
              </ProtectedRoute>
            }>
            <Route index element={<VendorDashboard />} />
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="profile" element={<VendorProfile />} />

            </Route>
          {/* Vendor Routes */}
        
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;