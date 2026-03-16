import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Composants
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import Navbar from './components/layout/Navbar';
import ReferenceForm from './components/references/ReferenceForm';
import HospitalProposal from './components/references/HospitalProposal';

import ReferenceList from './components/references/ReferenceList';
import ReferenceDetail from './components/references/ReferenceDetail';
import Sidebar from './components/layout/Sidebar';

import HospitalList from './components/hospitals/HospitalList';
import ServiceList from './components/services/ServiceList';

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser(JSON.parse(localStorage.getItem('user')));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
<ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <Box sx={{ display: 'flex' }}>
          {isAuthenticated && <Sidebar />}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              // On retire le "ml" (marginLeft) car le flex s'en occupe
              // On ajuste la largeur pour qu'elle occupe TOUT le reste de l'écran
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              mt: '64px', // Hauteur de la Navbar
              minHeight: 'calc(100vh - 64px)',
              bgcolor: '#f4f7fa', // Fond gris léger pour faire ressortir les cartes blanches
              overflow: 'auto'
            }}
          >
            <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Login onLogin={handleLogin} />
              } 
            />  
            <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
              />
            <Route path="/hospitals" element={isAuthenticated ? <HospitalList /> : <Navigate to="/login" />} />
            <Route path="/services" element={isAuthenticated ? <ServiceList /> : <Navigate to="/login" />} />
            
            <Route 
              path="/patients" 
              element={
                isAuthenticated ? 
                <PatientList /> : 
                <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/patients/nouveau" 
              element={
                isAuthenticated ? 
                <PatientForm /> : 
                <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/patients/:id" 
              element={
                isAuthenticated ? 
                <PatientForm /> : 
                <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/patients/:id/edit" 
              element={
                isAuthenticated ? 
                <PatientForm /> : 
                <Navigate to="/login" />
              } 
            />

            <Route 
              path="/references/nouvelle" 
              element={
                isAuthenticated ? 
                <ReferenceForm /> : 
                <Navigate to="/login" />
              } 
            />

            {/* Route temporaire pour tester le composant de recommandation */}
            <Route 
              path="/test-recommandation" 
              element={
                isAuthenticated ? 
                <HospitalProposal patientId={1} serviceId={1} /> : 
                <Navigate to="/login" />
              } 
            />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/references" element={isAuthenticated ? <ReferenceList /> : <Navigate to="/login" />} />

            <Route path="/references/:id" element={isAuthenticated ? <ReferenceDetail /> : <Navigate to="/login" />} />
          </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;