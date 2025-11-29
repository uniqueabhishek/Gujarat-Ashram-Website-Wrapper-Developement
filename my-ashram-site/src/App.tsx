import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainSite from "./MainSite";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Homepage - loads content from backend API */}
        <Route path="/" element={<MainSite />} />

        {/* Login Page - accessible at /login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Dashboard - accessible at /admin (requires login) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: any other route shows homepage */}
        <Route path="*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
