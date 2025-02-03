import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import {
  Home,
  Profile,
  Tables,
  Notifications,
  Roles,
  Departamentos,
  Divisiones,
  Ueducativas,
  Umilitares,
} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import ProtectedRoute from "@/component/ProtectedRoute";
import AuthRoute from "@/component/AuthRoute";
import Personal from "./pages/dashboard/personal";
import Accesos from "./pages/dashboard/accesos";
import Desvinculacion from "./pages/dashboard/desvinculacion";
import Novedades from "./pages/dashboard/novedades";
import Partediaria from "./pages/dashboard/partediaria";
import Informes from "./pages/dashboard/informes";
import Permisos from "./pages/dashboard/permisos";
import Parterrhh from "./pages/dashboard/parterrhh";
import Personalrrhh from "./pages/dashboard/personalrrhh";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "INICIO",
        path: "/home",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Home />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "ROLES",
        path: "/roles",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Roles />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PERFILES",
        path: "/profile",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "ACCESOS",
        path: "/accesos",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Accesos />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PERSONAL MINDEF",
        path: "/personal",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Personal />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "RELACIÓN NOMINAL",
        path: "/Personalrrhh",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Personalrrhh />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "DESVINCULACIÓN",
        path: "/desvinculacion",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Desvinculacion />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "NOVEDADES",
        path: "/novedades",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Novedades />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PARTE DIARIA",
        path: "/Partediaria",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Partediaria />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "INFORMES",
        path: "/Informes",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Informes />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PERMISOS SOLICITADOS",
        path: "/Permisos",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Permisos />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PARTE RRHH",
        path: "/Parterrhh",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Parterrhh />} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Tables />} />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        allowedRoles: [2],
        element: <ProtectedRoute element={<Notifications />} />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <AuthRoute element={<SignIn />} />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <AuthRoute element={<SignUp />} />,
      },
    ],
  },
];

export default routes;
