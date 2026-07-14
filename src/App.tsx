import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import EditProfile from './pages/EditProfile';


import StudentCompanies from './pages/StudentCompanies';
import StudentPractice from './pages/StudentPractice';
import StudentLearning from './pages/StudentLearning';
import StudentResources from './pages/StudentResources';
import StudentApplications from './pages/StudentApplications';
import StudentCertificates from './pages/StudentCertificates';
import StudentSettings from './pages/StudentSettings';
import StudentNotifications from './pages/StudentNotifications';
import StudentHelp from './pages/StudentHelp';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/companies" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentCompanies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/practice" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPractice />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/learning" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLearning />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/resources" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentResources />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/applications" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentApplications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/certificates" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentCertificates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/settings" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/notifications" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentNotifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/help" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHelp />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
