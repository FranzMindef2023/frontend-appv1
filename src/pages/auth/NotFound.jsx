import { Link } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Typography variant="h1" color="red">
        404
      </Typography>
      <Typography variant="h4" color="blue-gray" className="mt-2">
        Página no encontrada
      </Typography>
      <Typography className="mt-4">
        Lo sentimos, la página que estás buscando no existe.
      </Typography>
      <Button color="blue" className="mt-6" as={Link} to="/dashboard/home">
        Volver al inicio
      </Button>
    </div>
  );
};

export default NotFound;
