import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { ThemeProvider } from "./components/ThemeProvider";
import { CandidatePage } from "./pages/CandidatePage";
import { HomePage } from "./pages/HomePage";
import { JobsPage } from "./pages/JobsPage";
import { RecruiterPage } from "./pages/RecruiterPage";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<AppShell />}>
          <Route path="/candidate" element={<CandidatePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/recruiter" element={<RecruiterPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
