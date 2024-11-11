import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { useAuth } from "@/context/AuthContext";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logoutUser();
    navigate("/auth/sign-in");
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        {/* Breadcrumbs */}
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" color="blue-gray" className="font-normal">
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>

        {/* Barra derecha */}
        <div className="flex items-center">
          {/* Campo de búsqueda */}
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* Botón de notificaciones */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              {/* Lista de notificaciones */}
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="user"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    <strong>New message</strong> from John
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs opacity-60">
                    <ClockIcon className="h-3.5 w-3.5 inline-block" /> 5 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="spotify"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    <strong>New album</strong> released
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs opacity-60">
                    <ClockIcon className="h-3.5 w-3.5 inline-block" /> 1 hour ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    Payment received
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs opacity-60">
                    <ClockIcon className="h-3.5 w-3.5 inline-block" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Menú de usuario con cierre de sesión */}
          {user ? (
            <Menu>
              <MenuHandler>
                <Button variant="text" color="blue-gray" className="flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  {user.nombres}
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleLogout} className="flex items-center gap-2">
                  <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
                  Cerrar sesión
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/auth/sign-in">
              <Button variant="text" color="blue-gray">
                Sign In
              </Button>
            </Link>
          )}

          {/* Botón de configuración */}
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenConfigurator(dispatch, true)}>
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
