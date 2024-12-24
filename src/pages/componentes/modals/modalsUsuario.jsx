import React,{useState,useEffect } from "react";
import * as Yup from "yup";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,Input,Autocomplete, AutocompleteItem } from "@nextui-org/react";
import {EyeFilledIcon} from "@/pages/componentes/modals/password/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/pages/componentes/modals/password/EyeSlashFilledIcon";
import { useFormik } from "formik";
import { useUsers } from "@/context/UserContext";
import { useOrganigrama } from "@/context/OrganigramaContext";
import { useCargo } from "@/context/GargosContext";

const CustomModal = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData}) => {
  const { createUser,loading , updateUser } = useUsers();
  const [selectedItem, setSelectedItem] = useState([]);
  const [Item, setItem] = useState([]);
  const { organi,fetchOrganigrama, isInitializedOrg} = useOrganigrama();
  const { cargos,fetchCargos, isInitializedCar } = useCargo();
  useEffect(() => {
      if (!isInitializedOrg) {
        fetchOrganigrama();
          // console.log('desde el componete roles');
          // console.log(organi);
      }
      if (!isInitializedCar) {
        fetchCargos();
        // console.log('desde el componete roles');
        // console.log(cargos);
    }
  }, [isInitializedOrg,isInitializedCar]);
  // const [value, setValue] = React.useState("");

  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue }= useFormik({
    initialValues:{
      nombres: '',
      appaterno: '',
      apmaterno: '',
      email: '',
      usuario: '',
      password: '',
      ci:'',
      celular:'',
      status:true,
      idorg:[],
      idpuesto:[],
      grado:'',
      ...initialData,
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
      // console.log(values);
      // return true;
      try {
        if (initialData?.id) {
          // Si `initialData` tiene un `id`, es edición
          await updateUser(values); // Asume que tienes esta función
        } else {
          await createUser(values);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario');
      }
    },
    validationSchema:Yup.object({
      nombres: Yup.string().max(50,'Debe tener maximo de 50 caracteres').required('Campo requerido'),
      appaterno:Yup.string().max(30,'Debe tenere maximo 30 caracteres').min(3,'Debe tener como minimo 3 caracteres'),
      apmaterno: Yup.string().max(30,'Debe tenere maximo 30 caracteres'),
      email: Yup.string().email('El correo no tiene un formato corecto').required('El email es requerido'),
      usuario: Yup.string().min(3,'Debe tener minimo 3 caracteres').max(10,'Debe tener maximo 10 caracteres').required('Campo requerido'),
      password: Yup.string().nullable()
      .min(5, 'La contraseña debe tener al menos 5 caracteres')
      .max(15, 'La contraseña no debe exceder los 15 caracteres')
      .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .matches(/\d/, 'La contraseña debe contener al menos un número')
      .matches(/[@$!%*?&#]/, 'La contraseña debe contener al menos un carácter especial (@$!%*?&#)'),
      ci:Yup.number().
      min(6000000,'La cédula debe tener minimo 6 caracteres').
      max(10000000000,'La cédula debe tener maximo 10 caracteres')
      .required('La cédula de identidad es requerida'),
      celular:Yup.string()
      .matches(/^[0-9]{8,15}$/, 'El número de celular debe tener entre 8 y 15 dígitos')
      .nullable(),
      // idorg: Yup.number()
      // .required('Es necesario seleccionar una unidad organizacional.'), 
      grado :Yup.string().max(50,'Debe tener maximo de 50 caracteres').required('Campo requerido'),
    })
  });
  useEffect(() => {
    if (initialData?.idorg) {
      const selectedOrg = organi.find((item) => item.idorg === Number(initialData.idorg)); // Forzar a tipo número
      setSelectedItem(selectedOrg);
      setFieldValue('idorg', selectedOrg?.idorg || ''); // Actualiza Formik
    }
  
    if (initialData?.idpuesto) {
      const selectedPuesto = cargos.find((item) => item.idpuesto === Number(initialData.idpuesto)); // Forzar a tipo número
      setItem(selectedPuesto);
      setFieldValue('idpuesto', selectedPuesto?.idpuesto || ''); // Actualiza Formik
    }
  }, [initialData, organi, cargos, setFieldValue]);
 


  

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} size="4xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <form noValidate onSubmit={handleSubmit}>
              <ModalBody>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isRequired={true}
                  type="text"
                  label="Abreviatura del grado"
                  variant="bordered"
                  isInvalid={!!errors.grado && touched.grado}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}  // Manejar el cambio con Formik
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="grado"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.grado}  // El valor actual del campo en el formulario
                  placeholder="Ingrese el grado de forma Abreviada"
                  color={errors.grado ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.grado}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isRequired={true}
                  type="text"
                  label="Nombres"
                  variant="bordered"
                  isInvalid={!!errors.nombres && touched.nombres}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}  // Manejar el cambio con Formik
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="nombres"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.nombres}  // El valor actual del campo en el formulario
                  placeholder="Ingrese los nombres"
                  color={errors.nombres ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.nombres}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
                <Input 
                size="sm" 
                type="text" 
                label="Paterno" 
                name="appaterno" 
                variant="bordered"
                placeholder="Ingrese el apellido paterno" 
                value={values.appaterno}
                isInvalid={!!errors.appaterno && touched.appaterno}
                onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}
                onBlur={handleBlur}
                color={errors.appaterno ? "danger" : "success"}
                errorMessage={errors.appaterno}
                className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input 
                  size="sm" 
                  type="text" 
                  label="Materno" 
                  variant="bordered"
                  name="apmaterno"
                  placeholder="Ingrese el apellido materno"
                  value={values.apmaterno}
                  isInvalid={!!errors.apmaterno && touched.apmaterno}
                  onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}
                  onBlur={handleBlur}
                  color={errors.apmaterno ? "danger" : "success"}
                  errorMessage={errors.apmaterno}
                  className="block w-full"
                  />
                <Input 
                isRequired
                size="sm" 
                value={values.email}
                name="email"
                type="email" 
                label="Email" 
                placeholder="Enter your email" 
                variant="bordered"
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.email && touched.email}
                color={errors.email ? "danger" : "success"}
                errorMessage={errors.email}
                className="block w-full "/>
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input 
                  size="sm" 
                  type="text" 
                  isRequired
                  name="ci"
                  label="N° de CI" 
                  variant="bordered"
                  placeholder="Ingrese el numero de ci"
                  
                  value={values.ci}
                  isInvalid={!!errors.ci && touched.ci}
                  onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}
                  onBlur={handleBlur}
                  color={errors.ci ? "danger" : "success"}
                  errorMessage={errors.ci}
                  className="block w-full"
                  />
                <Input 
                size="sm" 
                type="number" 
                label="Celular" 
                name="celular"
                placeholder="Ingrese el n° de celular" 
                variant="bordered"
                value={values.celular}
                isInvalid={!!errors.celular && touched.celular}
                onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}
                onBlur={handleBlur}
                color={errors.celular ? "danger" : "success"}
                errorMessage={errors.celular}
                className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input 
                  size="sm" 
                  isRequired
                  type="text" 
                  name="usuario"
                  label="Usuario" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.usuario && touched.usuario}
                  color={errors.usuario ? "danger" : "success"}
                  variant="bordered"
                  placeholder="Ingrese el nobre de usuario"
                  value={values.usuario}
                  errorMessage={errors.usuario}
                  className="block w-full"
                  />
                <Input
                  label="Password"
                  size="sm" 
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
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Autocomplete
                size="sm"
                isRequired
                label="Buscar unidad orgnaizacional"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idorg ? String(values.idorg) : undefined} // Maneja valores vacíos correctamente
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idorg', ''); // Limpia el valor en Formik
                    setItem(null); // Limpia el estado local
                    return;
                  }

                  const selectedOrg = organi.find((item) => item.idorg === Number(key));
                  setFieldValue('idorg', selectedOrg?.idorg || ''); // Actualiza Formik
                  setItem(selectedOrg); // Actualiza el estado local
                }}
                defaultItems={organi}
              >
                {(item) => <AutocompleteItem key={String(item.idorg)}>{item.nomorg}</AutocompleteItem>}
              </Autocomplete>
              <Autocomplete
                isRequired
                size="sm"
                label="Buscar puesto"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idpuesto ? String(values.idpuesto) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  const selectedPuesto = cargos.find((item) => item.idpuesto === Number(key)); // Convertir clave a número
                  setFieldValue('idpuesto', selectedPuesto?.idpuesto || ''); // Actualiza Formik
                  setItem(selectedPuesto); // Actualiza el estado local
                }}
                defaultItems={cargos}
              >
                {(item) => <AutocompleteItem key={String(item.idpuesto)}>{item.nompuesto}</AutocompleteItem>}
              </Autocomplete>
              </div>
              </ModalBody>
              <ModalFooter>
              <Button color="danger" variant="light" onClick={() => {
                  resetForm();  // Call reset form function
                  onClose();    // Call close function
                }}>
                {closeLabel}
              </Button>
              <Button color="primary" type="submit"  disabled={loading}>
                {actionLabel}
              </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
