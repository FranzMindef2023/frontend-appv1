import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ element,allowedRoles }) => {
  const { loggedIn,user } = useAuth();
  

  // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
  if (!loggedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return element;
};

export default ProtectedRoute;
