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

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <ProtectedRoute element={<Home />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "roles",
        path: "/roles",
        element: <ProtectedRoute element={<Roles />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "accesos",
        path: "/accesos",
        element: <ProtectedRoute element={<Accesos />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "personal",
        path: "/personal",
        element: <ProtectedRoute element={<Personal />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "departamentos",
        path: "/departamentos",
        element: <ProtectedRoute element={<Departamentos />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "division",
        path: "/division",
        element: <ProtectedRoute element={<Divisiones />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "u educativas",
        path: "/u-educativas",
        element: <ProtectedRoute element={<Ueducativas />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "u militares",
        path: "/u-militares",
        element: <ProtectedRoute element={<Umilitares />} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <ProtectedRoute element={<Tables />} />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
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
