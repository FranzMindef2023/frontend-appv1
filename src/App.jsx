import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import AuthRoute from "@/component/AuthRoute";
import ProtectedRoute from "@/component/ProtectedRoute";
import NotFound from "@/pages/auth/NotFound"; // Importamos la página 404

function App() {
  return (
    <Routes>
      {/* 🔹 Redirigir "/" a "/dashboard" */}
      <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

      {/* 🔹 Rutas protegidas para el dashboard */}
      <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />} />

      {/* 🔹 Rutas públicas para autenticación */}
      <Route path="/auth/*" element={<AuthRoute element={<Auth />} />} />

      {/* 🔥 Capturar cualquier ruta no encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
