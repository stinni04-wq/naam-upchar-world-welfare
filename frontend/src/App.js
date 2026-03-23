import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return user ? <Dashboard /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
