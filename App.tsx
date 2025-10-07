
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/pages/Dashboard';
import InvoicePage from './components/pages/InvoicePage';
import PurchaseCreditsPage from './components/pages/PurchaseCreditsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Main />
      </HashRouter>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />
            <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/invoice" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
            <Route path="/purchase-credits" element={<ProtectedRoute><PurchaseCreditsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
        </Routes>
    );
};

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }
    return children;
};

export default App;
