import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import AuthRoute from "@/component/AuthRoute";
import ProtectedRoute from "@/component/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Rutas protegidas para el dashboard */}
      <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />} />
      
      {/* Rutas públicas para autenticación */}
      <Route path="/auth/*" element={<AuthRoute element={<Auth />} />} />

      {/* Redirigir cualquier otra ruta al dashboard si está autenticado, o a sign-in si no lo está */}
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
