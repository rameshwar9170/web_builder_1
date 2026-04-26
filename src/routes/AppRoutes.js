import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Super Admin Pages
import SuperAdminDashboard from '../pages/superadmin/Dashboard';
import ManageAdmins from '../pages/superadmin/ManageAdmins';
import ManageTemplates from '../pages/superadmin/ManageTemplates';
import TemplateEditor from '../pages/superadmin/TemplateEditor';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import MyCards from '../pages/admin/MyCards';
import CreateCard from '../pages/admin/CreateCard';
import CreatePremiumCard from '../pages/admin/CreatePremiumCard';
import EditCard from '../pages/admin/EditCard';
import EditPremiumCard from '../pages/admin/EditPremiumCard';
import MyPremiumCards from '../pages/admin/MyPremiumCards';
import CardSettings from '../pages/admin/CardSettings';

// Public Pages
import ViewCard from '../pages/public/ViewCard';
import PremiumViewCard from '../pages/public/PremiumViewCard';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

import { ROLES } from '../firebase/collections';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userData } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="templates" element={<ManageTemplates />} />
          <Route path="templates/new" element={<TemplateEditor />} />
          <Route path="templates/edit/:templateId" element={<TemplateEditor />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cards" element={<MyCards />} />
          <Route path="cards/create" element={<CreateCard />} />
          <Route path="cards/create-premium" element={<CreatePremiumCard />} />
          <Route path="premium-cards" element={<MyPremiumCards />} />
          <Route path="premium-cards/edit/:cardId" element={<EditPremiumCard />} />
          <Route path="cards/edit/:cardId" element={<EditCard />} />
          <Route path="cards/settings/:cardId" element={<CardSettings />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="card/:slug" element={<ViewCard />} />
          <Route path="premium-card/:slug" element={<PremiumViewCard />} />
        </Route>

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
