import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// Envuelve cualquier ruta que requiera sesión iniciada, y opcionalmente
// restringe el acceso a ciertos roles.
//
// Uso:
//   <ProtectedRoute><Dashboard /></ProtectedRoute>
//   <ProtectedRoute allowedRoles={['docente']}><AgregarAuxiliar /></ProtectedRoute>
//   <ProtectedRoute allowedRoles={['docente', 'auxiliar']}><Reportes /></ProtectedRoute>
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const user = authService.getCurrentUser();
    const rolActual = user?.rol;

    if (!rolActual || !allowedRoles.includes(rolActual)) {
      // Está logeado pero no tiene permiso para esta pantalla en particular
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
