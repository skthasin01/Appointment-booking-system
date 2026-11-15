import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/provider/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/provider/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/provider/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;