import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AuthRoute = ({ element }) => {
  const { loggedIn } = useAuth();

  // Si el usuario está autenticado, redirigir al dashboard
  if (loggedIn) {
    return <Navigate to="/dashboard/home" replace />;
  }

  // Si no está autenticado, renderizar el componente solicitado
  return element;
};

export default AuthRoute;
