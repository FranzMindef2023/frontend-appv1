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
  Accesos,
  Personal,
  Personalrrhh,
  Vacaciones,
  Novedades,
  Partediaria,
  Informes,
  Permisos,
  Parterrhh
} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import ProtectedRoute from "@/component/ProtectedRoute";
import AuthRoute from "@/component/AuthRoute";



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
        allowedRoles: [1,2],
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
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "ACCESOS",
        path: "/accesos",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Accesos />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PERSONAL MINDEF",
        path: "/personal",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Personal />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "RELACIÓN NOMINAL",
        path: "/Personalrrhh",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Personalrrhh />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "VACACIONES",
        path: "/vacaciones",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Vacaciones />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "NOVEDADES",
        path: "/novedades",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Novedades />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PARTE DIARIA",
        path: "/Partediaria",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Partediaria />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "INFORMES",
        path: "/Informes",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Informes />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PERMISOS SOLICITADOS",
        path: "/Permisos",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Permisos />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "PARTE RRHH",
        path: "/Parterrhh",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Parterrhh />} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        allowedRoles: [1,2],
        element: <ProtectedRoute element={<Tables />} />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        allowedRoles: [1,2],
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
