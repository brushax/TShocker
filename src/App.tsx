import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import AppLayout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import ServerStatusPage from '@/pages/dashboard';
import UserManagementPage from '@/pages/users';
import PlayerManagementPage from '@/pages/players';
import CommandExecutionPage from '@/pages/command';
import WorldEventsPage from '@/pages/events';
import SystemManagementPage from '@/pages/system';
import BanManagementPage from '@/pages/bans';
import GroupManagementPage from '@/pages/groups';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<ServerStatusPage />} />
                    <Route path="/users" element={<UserManagementPage />} />
                    <Route path="/groups" element={<GroupManagementPage />} />
                    <Route path="/bans" element={<BanManagementPage />} />
                    <Route path="/players" element={<PlayerManagementPage />} />
                    <Route path="/events" element={<WorldEventsPage />} />
                    <Route path="/commands" element={<CommandExecutionPage />} />
                    <Route path="/system" element={<SystemManagementPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </AppProvider>
  );
}

export default App;
