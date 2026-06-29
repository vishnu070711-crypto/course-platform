import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentSubmissions from './pages/AssignmentSubmissions';
import SubmitAssignment from './pages/SubmitAssignment';
import MySubmissions from './pages/MySubmissions';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;
  return children;
}

function DashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.role === 'instructor' ? <Navigate to="/instructor-dashboard" replace /> : <Dashboard />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardRedirect /></PrivateRoute>} />
            <Route path="/instructor-dashboard" element={<PrivateRoute requiredRole="instructor"><InstructorDashboard /></PrivateRoute>} />
            <Route path="/create-course" element={<PrivateRoute requiredRole="instructor"><CreateCourse /></PrivateRoute>} />
            <Route path="/courses/:id/add-assignment" element={<PrivateRoute requiredRole="instructor"><CreateAssignment /></PrivateRoute>} />
            <Route path="/assignments/:assignmentId/submit" element={<PrivateRoute requiredRole="student"><SubmitAssignment /></PrivateRoute>} />
            <Route path="/assignments/:assignmentId/submissions" element={<PrivateRoute requiredRole="instructor"><AssignmentSubmissions /></PrivateRoute>} />
            <Route path="/my-submissions" element={<PrivateRoute requiredRole="student"><MySubmissions /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;