import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAppContext();

  if (state.loading) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <Spinner className="size-6 text-blue-500" />
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
