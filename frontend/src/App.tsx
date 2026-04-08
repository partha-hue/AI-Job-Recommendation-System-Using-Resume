import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./components/AuthProvider";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import { CandidatePage } from "./pages/CandidatePage";
import { HomePage } from "./pages/HomePage";
import { JobsPage } from "./pages/JobsPage";
import { LoginPage } from "./pages/LoginPage";
import { RecruiterPage } from "./pages/RecruiterPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<AppShell />}>
            <Route
              path="/candidate"
              element={
                <ProtectedRoute role="candidate">
                  <CandidatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
