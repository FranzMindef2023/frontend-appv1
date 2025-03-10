import {
  Card,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { EyeFilledIcon } from "@/pages/componentes/modals/password/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/pages/componentes/modals/password/EyeSlashFilledIcon";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from "../../component/Loader/Loader";


export function SignIn() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controla el estado del loader
  const { handleSubmit, handleBlur, values, handleChange, errors, touched, resetForm } = useFormik({
    initialValues: {
      email: 'juan.perez@example.com',
      password: 'hashed_password',
    },
    onSubmit: async (values) => {
      setIsLoading(true); // Activa el loader
      const success = await loginUser(values);
      setIsLoading(false); // Desactiva el loader
      if (success) {
        navigate('/dashboard/home'); // Redirige a la ruta deseada tras el login
      } else {
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
      resetForm();
    },
    validationSchema: Yup.object({
      password: Yup.string().max(50, 'Debe tener maximo de 50 caracteres').required('Campo requerido'),
      email: Yup.string().email('El correo no tiene un formato corecto').required('El email es requerido'),
    }),
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4" >¡Bienvenido/a!<span aria-label="emoji" className="ml-2" role="img" >
            👋
          </span></Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Sistema de Control del Personal Militar del <br /> Ministerio de Defensa</Typography>
          <Typography variant="h2" className="font-bold mb-4" >SICPM25<span aria-label="emoji" className="ml-2" role="img" >
          </span></Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              variant="bordered"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              isInvalid={!!errors.email && touched.email}
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              value={values.email}
              color={errors.email ? "danger" : "success"}
              errorMessage={errors.email}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              size="lg"
              isRequired
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.password && touched.password}
              errorMessage={errors.password}
              color={errors.password ? "danger" : "success"}
              variant="bordered"
              placeholder="Ingrese la contraseña"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            type="submit"
            disabled={isLoading} // Deshabilita el botón mientras carga
          >
            {isLoading ? <Loader /> : "INGRESAR"} {/* Muestra el loader si está cargando */}
          </Button>


          <div className="flex items-center justify-between gap-2 mt-6">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Subscribe me to newsletter
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
          <div className="space-y-4 mt-8">
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
            </Button>
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
              <img src="/img/twitter-logo.svg" height={24} width={24} alt="" />
              <span>Sign in With Twitter</span>
            </Button>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
