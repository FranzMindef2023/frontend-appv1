import { Routes, Route , Navigate} from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import AuthRoute from "@/component/AuthRoute";
import ProtectedRoute from "@/component/ProtectedRoute";
import NotFound from "@/pages/auth/NotFound"; // Importamos la página 404

function App() {
  return (
    <Routes>
      {/* Rutas protegidas para el dashboard */}
      <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />} />
      
      {/* Rutas públicas para autenticación */}
      <Route path="/auth/*" element={<AuthRoute element={<Auth />} />} />

     {/* 🔥 Ruta 404 */}
     <Route path="/auth/*" element={<NotFound />} />
      
      {/* 🔥 Cualquier otra ruta incorrecta redirige a 404 */}
      <Route path="/auth/*" element={<NotFound />}  />
    </Routes>
  );
}

export default App;
