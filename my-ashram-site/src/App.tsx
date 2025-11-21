import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainSite from "./MainSite";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Homepage - loads content from backend API */}
        <Route path="/" element={<MainSite />} />

        {/* Protected Admin Dashboard - accessible at /admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch-all: any other route shows homepage */}
        <Route path="*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
