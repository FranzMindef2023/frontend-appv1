import React,{useState,useEffect } from "react";
import * as Yup from "yup";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,Input,Autocomplete,DateInput, AutocompleteItem,Select, SelectItem } from "@nextui-org/react";
import {CalendarDate} from "@internationalized/date";
import { useFormik } from "formik";
import { useUsers } from "@/context/UserContext";
import { useselects } from "@/context/SelectsContext";
import { usePersonas } from "@/context/PersonasContext";


const CustomModal = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData}) => {
  const { createUser,loading , updateUser } = useUsers();
  const { createPersona,loadingPer , updatePersona } = usePersonas();
  const [Item, setItem] = useState([]);
  const [ItemFuerzas, setfuerza] = useState([]);
  const [ItemGrados, setGrados] = useState([]);
  const [ItemArmas, setArmas] = useState([]);
  const [ItemEsp, setEsp] = useState([]);
  const [ItemSexo, setSexo] = useState([]);
  const [ItemSituad, setSituad] = useState([]);
  const [ItemExped, setExped] = useState([]);
  const [ItemStatuscv, setStatuscv] = useState([]);

  const { selects,fetchSelects, isInitializedSelect} = useselects();


  const handleDateInput = (e, setFieldValue) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
    if (value.length >= 2) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    setFieldValue("fechnacimeinto", value);
  };
  const handleDateInputEgreso = (e, setFieldValue) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
    if (value.length >= 2) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    setFieldValue("fechaegreso", value);
  };


  useEffect(() => {
    
    if (!isInitializedSelect) fetchSelects();
  },[fetchSelects]);

  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue }= useFormik({
    initialValues: {
      nombres: '',
      appaterno: '',
      apmaterno: '',
      ci: '',
      complemento: '',
      codper: '',
      email: '',
      celular: '',
      fechnacimeinto: '',
      fechaegreso: '',
      gsanguineo: '',
      carnetmil: '',
      carnetseg: '',
      nuacua: '',
      tipoper: 'M',
      estserv: '',
      idfuerza:[],
      idespecialidad: [],
      idgrado: [],
      idsexo: [],
      idarma: [],
      idcv:[],
      status: true,
      idsituacion: [],
      idexpedicion: [],
      ...initialData, // Sobrescribe los valores con `initialData` si está presente
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
      try {
        if (initialData?.id) {
          // Si `initialData` tiene un `id`, es edición
          await updatePersona(values); // Asume que tienes esta función
        } else {
          await createPersona(values);
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
      appaterno:Yup.string().max(30,'Debe tenere maximo 30 caracteres').min(3,'Debe tener como minimo 3 caracteres').nullable(),
      apmaterno: Yup.string().max(30,'Debe tenere maximo 30 caracteres').nullable(),
      email: Yup.string().email('El correo no tiene un formato corecto').required('El email es requerido'),
      ci: Yup.string()
    .matches(/^\d+$/, 'La cédula debe contener solo números') // Permitir solo dígitos
    .min(6, 'La cédula debe tener mínimo 6 caracteres') // Longitud mínima
    .max(10, 'La cédula debe tener máximo 10 caracteres') // Longitud máxima
    .required('La cédula de identidad es requerida'),
      celular:Yup.string()
      .matches(/^[0-9]{8,15}$/, 'El número de celular debe tener entre 8 y 15 dígitos')
      .nullable(),
      idgrado: Yup.number()
      .required('Es necesario seleccionar una unidad organizacional.'), 
      // grado :Yup.string().max(50,'Debe tener maximo de 50 caracteres').required('Campo requerido'),
      idexpedicion: Yup.number()
      .required('Debes seleccionar una expedición') // Mensaje de error
      .typeError('El valor debe ser un número válido') // Por si llega un string o undefined 
      .min(1, 'Selecciona una opción válida'),
      idfuerza: Yup.number()
      .required('Debes seleccionar una fuerza') // Mensaje de error
      .typeError('El valor debe ser un número válido') // Por si llega un string o undefined  idcv
      .min(1, 'Selecciona una opción válida'),
      idcv: Yup.number()
      .required('Debes seleccionar un estado civil') // Mensaje de error
      .typeError('El valor debe ser un número válido') // Por si llega un string o undefined   idsexo
      .min(1, 'Selecciona una opción válida'),
      idsexo: Yup.number()
      .required('Debes seleccionar el genero') // Mensaje de error
      .typeError('El valor debe ser un número válido') // Por si llega un string o undefined    
      .min(1, 'Selecciona una opción válida'),
      idsituacion: Yup.number()
      .required('Debes seleccionar la situación') // Mensaje de error
      .typeError('El valor debe ser un número válido') // Por si llega un string o undefined    
      .min(1, 'Selecciona una opción válida'),
      fechnacimeinto: Yup.string()
      .matches(
        /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/, // Cambiado para soportar DD-MM-YYYY
        "El formato debe ser DD-MM-YYYY"
      )
      .test("is-valid-date", "Fecha inválida", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("-").map(Number); // Divide por '-' en lugar de '/'
        const date = new Date(year, month - 1, day);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      })
      .test("not-future-date", "La fecha no puede ser futura", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date <= new Date(); // La fecha ingresada debe ser menor o igual a hoy
      })
      .required("La fecha de nacimiento es obligatoria"),
      fechaegreso:Yup.string()
      .matches(
        /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/, // Cambiado para soportar DD-MM-YYYY
        "El formato debe ser DD-MM-YYYY"
      )
      .test("is-valid-date", "Fecha inválida", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("-").map(Number); // Divide por '-' en lugar de '/'
        const date = new Date(year, month - 1, day);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      })
      .test("not-future-date", "La fecha no puede ser futura", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date <= new Date(); // La fecha ingresada debe ser menor o igual a hoy
      })
      .required("La fecha de nacimiento es obligatoria"),
      carnetmil: Yup.string()
      .matches(/^[a-zA-Z0-9]*$/, "El carnet militar debe contener solo letras y números")
      .notRequired(), // No es obligatorio
      carnetseg: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, "El carnet de seguro debe contener solo letras y números")
        .notRequired(), // No es obligatorio
      codper: Yup.string()
      .matches(/^\d+$/, "El código personal solo puede contener números") // Permite solo números
      .min(3, "El código personal debe tener al menos 3 caracteres")
      .max(20, "El código personal no debe superar los 20 caracteres")
      .required("El código personal es obligatorio"), // Es obligatorio
      gsanguineo: Yup.string()
      .matches(
        /^(A|B|AB|O)RH[+-]$/,
        "El grupo sanguíneo debe ser un valor válido como ARH+, ORH-, etc."
      )
      .required("El grupo sanguineo es obligatorio"), // Es obligatorio
    })
  });
  useEffect(() => {
    if (initialData?.idfuerza) {
      const slectedFuerza = selects.fuerzas.data.find((item) => item.idfuerza === Number(initialData.idfuerza)); // Forzar a tipo número
      setfuerza(slectedFuerza);
      setFieldValue('idfuerza', slectedFuerza?.idfuerza || ''); // Actualiza Formik
    }
    if (initialData?.idgrado) {
      const selectedGrados = selects.grados.data.find((item) => item.idgrado === Number(initialData.idgrado)); // Forzar a tipo número
      setGrados(selectedGrados);
      setFieldValue('idgrado', selectedGrados?.idgrado || ''); // Actualiza Formik
    }
    if (initialData?.idarma) {
      const selectedArmas = selects.armas.data.find((item) => item.idarma === Number(initialData.idarma)); // Forzar a tipo número
      setArmas(selectedArmas);
      setFieldValue('idarma', selectedArmas?.idarma || ''); // Actualiza Formik
    }

    if (initialData?.idespecialidad) {
      const selectedEspecial = selects.especialidades.data.find((item) => item.idespecialidad === Number(initialData.idespecialidad)); // Forzar a tipo número
      setEsp(selectedEspecial);
      setFieldValue('idespecialidad', selectedEspecial?.idespecialidad || ''); // Actualiza Formik
    }

    if (initialData?.idcv) {
      const selectedStatus = selects.estadocv.data.find((item) => item.idcv === Number(initialData.idcv)); // Forzar a tipo número
      setStatuscv(selectedStatus);
      setFieldValue('idcv', selectedStatus?.idcv || ''); // Actualiza Formik
    }
    if (initialData?.idsexo) {
      const selectedsetSexo = selects.sexos.data.find((item) => item.idsexo === Number(initialData.idsexo)); // Forzar a tipo número
      setSexo(selectedsetSexo);
      setFieldValue('idsexo', selectedsetSexo?.idsexo || ''); // Actualiza Formik
    }
    if (initialData?.idsituacion) {
      const selectedSitua = selects.situaciones.data.find((item) => item.idsituacion === Number(initialData.idsituacion)); // Forzar a tipo número
      setSituad(selectedSitua);
      setFieldValue('idsituacion', selectedSitua?.idsituacion || ''); // Actualiza Formik
    }
    if (initialData?.idexpedicion) {
      const selectedExped = selects.expediciones.data.find((item) => item.idexpedicion === Number(initialData.idexpedicion)); // Forzar a tipo número
      setExped(selectedExped);
      setFieldValue('idexpedicion', selectedExped?.idexpedicion || ''); // Actualiza Formik
    }
  }, [initialData,selects,  setFieldValue]);
 


  

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
                  label="NOMBRES"
                  variant="bordered"
                  isInvalid={!!errors.nombres && touched.nombres}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}
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
                label="APELLIDO PATERNO" 
                name="appaterno" 
                variant="bordered"
                placeholder="Ingrese apellido paterno" 
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
                label="APELLIDO MATERNO" 
                variant="bordered"
                name="apmaterno"
                placeholder="Ingrese apellido materno"
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
                size="sm" 
                type="text" 
                isRequired
                name="ci"
                label="CEDUAL DE IDENTIDAD" 
                variant="bordered"
                placeholder="Ingrese número de ci"
                
                value={values.ci}
                isInvalid={!!errors.ci && touched.ci}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.ci ? "danger" : "success"}
                errorMessage={errors.ci}
                className="block w-full"
                />
                <Input 
                size="sm" 
                type="text" 
                label="COMPLEMENTO" 
                name="complemento"
                placeholder="Ingrese el complemento" 
                variant="bordered"
                value={values.complemento}
                isInvalid={!!errors.complemento && touched.complemento}
                onChange={(e) => {
                  // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                  handleChange({
                    target: { name: e.target.name, value: e.target.value.toUpperCase() },
                  });
                }}
                onBlur={handleBlur}
                color={errors.complemento ? "danger" : "success"}
                errorMessage={errors.complemento}
                className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                
                <Input
                  size="sm"
                  isRequired={true}
                  type="text"
                  label="FECHA DE NACIMIENTO"
                  variant="bordered"
                  isInvalid={!!errors.fechnacimeinto && touched.fechnacimeinto}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => handleDateInput(e, setFieldValue)}
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="fechnacimeinto"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.fechnacimeinto}  // El valor actual del campo en el formulario
                  placeholder="Ingrese fecha de nacimiento"
                  color={errors.fechnacimeinto ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.fechnacimeinto}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                  placeholderValue={new CalendarDate(1995, 11, 6)}
                />
              <Autocomplete
                size="sm"
                isRequired
                label="BUCAR EL GRADO"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idexpedicion ? String(values.idexpedicion) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idexpedicion', ''); // Limpia el valor en Formik
                    setExped(null); // Limpia el estado local
                    return;
                  }
                  const selectedExped = selects.expediciones.data.find((item) => item.idexpedicion === Number(key)); // Convertir clave a número
                  setFieldValue('idexpedicion', selectedExped?.idexpedicion || ''); // Actualiza Formik
                  setExped(selectedExped); // Actualiza el estado local
                }}
                defaultItems={selects.expediciones.data}
              >
                {(item) => <AutocompleteItem key={String(item.idexpedicion)}>{item.Departamento}</AutocompleteItem>}
              </Autocomplete>
              <Input 
              size="sm" 
              type="text" 
              label="CARNET MILITAR" 
              name="carnetmil"
              placeholder="Ingrese el n° de Carnet Mil." 
              variant="bordered"
              value={values.carnetmil}
              isInvalid={!!errors.carnetmil && touched.carnetmil}
              onChange={(e) => {
                // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                handleChange({
                  target: { name: e.target.name, value: e.target.value.toUpperCase() },
                });
              }}
              onBlur={handleBlur}
              color={errors.carnetmil ? "danger" : "success"}
              errorMessage={errors.carnetmil}
              className="block w-full"
              />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input 
                size="sm" 
                type="text" 
                label="CODIGO PERSONA" 
                name="codper"
                placeholder="Ingrese el Cod. Persona" 
                variant="bordered"
                value={values.codper}
                isInvalid={!!errors.codper && touched.codper}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.codper ? "danger" : "success"}
                errorMessage={errors.codper}
                className="block w-full"
                />
                <Input 
                isRequired
                size="sm" 
                value={values.carnetseg}
                name="carnetseg"
                label="MATRICULA DE SEGURO" 
                placeholder="Ingrese la matricula" 
                variant="bordered"
                onChange={(e) => {
                  // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                  handleChange({
                    target: { name: e.target.name, value: e.target.value.toUpperCase() },
                  });
                }}
                onBlur={handleBlur}
                isInvalid={!!errors.carnetseg && touched.carnetseg}
                color={errors.carnetseg ? "danger" : "success"}
                errorMessage={errors.carnetseg}
                className="block w-full "/>
                <Input 
                isRequired
                size="sm" 
                value={values.nuacua}
                name="nuacua"
                label="NUA/CUA" 
                placeholder="Ingrese nua/cua" 
                variant="bordered"
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.nuacua && touched.nuacua}
                color={errors.nuacua ? "danger" : "success"}
                errorMessage={errors.nuacua}
                className="block w-full "/>
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input 
                  size="sm" 
                  type="text" 
                  label="CELULAR" 
                  name="celular"
                  placeholder="Ingrese el n° de celular" 
                  variant="bordered"
                  value={values.celular}
                  isInvalid={!!errors.celular && touched.celular}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  color={errors.celular ? "danger" : "success"}
                  errorMessage={errors.celular}
                  className="block w-full"
                  />
                <Input 
                  isRequired
                  size="sm" 
                  value={values.email}
                  name="email"
                  type="email" 
                  label="EMAIL" 
                  placeholder="Inrese el email" 
                  variant="bordered"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.email && touched.email}
                  color={errors.email ? "danger" : "success"}
                  errorMessage={errors.email}
                  className="block w-full "/>
                
                <Input
                  size="sm"
                  isRequired={true}
                  label="TIPO DE SANGRE"
                  variant="bordered"
                  isInvalid={!!errors.gsanguineo && touched.gsanguineo}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="gsanguineo"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.gsanguineo}  // El valor actual del campo en el formulario
                  placeholder="Ingrese el grupo sanguineo"
                  color={errors.gsanguineo ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.gsanguineo}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isRequired={true}
                  label="FECHA DE ALTA"
                  variant="bordered"
                  isInvalid={!!errors.fechaegreso && touched.fechaegreso}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => handleDateInputEgreso(e, setFieldValue)}
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="fechaegreso"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.fechaegreso}  // El valor actual del campo en el formulario
                  placeholder="Ingrese el fechaegreso de forma Abreviada"
                  color={errors.fechaegreso ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.fechaegreso}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
              <Autocomplete
                size="sm"
                isRequired
                label="ELECCIONAR FUERZA"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idfuerza ? String(values.idfuerza) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idfuerza', ''); // Limpia el valor en Formik
                    setfuerza(null); // Limpia el estado local
                    return;
                  }
                  const selectedExped = selects.fuerzas.data.find((item) => item.idfuerza === Number(key)); // Convertir clave a número
                  setFieldValue('idfuerza', selectedExped?.idfuerza || ''); // Actualiza Formik
                  setfuerza(selectedExped); // Actualiza el estado local
                }}
                defaultItems={selects.fuerzas.data}
              >
                {(item) => <AutocompleteItem key={String(item.idfuerza)}>{item.fuerza}</AutocompleteItem>}
              </Autocomplete>
              <Autocomplete
                size="sm"
                isRequired
                label="BUCAR EL GRADO"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idgrado ? String(values.idgrado) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idgrado', ''); // Limpia el valor en Formik
                    setGrados(null); // Limpia el estado local
                    return;
                  }
                  const selectedGrado = selects.grados.data.find((item) => item.idgrado === Number(key)); // Convertir clave a número
                  setFieldValue('idgrado', selectedGrado?.idgrado || ''); // Actualiza Formik
                  setGrados(selectedGrado); // Actualiza el estado local
                }}
                defaultItems={selects.grados.data}
              >
                {(item) => <AutocompleteItem key={String(item.idgrado)}>{item.abregrado}</AutocompleteItem>}
              </Autocomplete>
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Autocomplete
                  size="sm"
                  isRequired
                  label="BUSCAR EL ARMA"
                  variant="bordered"
                  className="block w-full"
                  selectedKey={values.idarma ? String(values.idarma) : undefined} // Asegúrate de que es una cadena
                  onSelectionChange={(key) => {
                    if (!key) {
                      setFieldValue('idarma', ''); // Limpia el valor en Formik
                      setArmas(null); // Limpia el estado local
                      return;
                    }
                    const selectedArmas = selects.armas.data.find((item) => item.idarma === Number(key)); // Convertir clave a número
                    setFieldValue('idarma', selectedArmas?.idarma || ''); // Actualiza Formik
                    setArmas(selectedArmas); // Actualiza el estado local
                  }}
                  defaultItems={selects.armas.data}
                >
                {(item) => <AutocompleteItem key={String(item.idarma)}>{item.abrearma}</AutocompleteItem>}
              </Autocomplete>
              <Autocomplete
                size="sm"
                isRequired
                label="BUSCAR LA ESPECIALIDAD"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idespecialidad ? String(values.idespecialidad) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idespecialidad', ''); // Limpia el valor en Formik
                    setEsp(null); // Limpia el estado local
                    return;
                  }
                  const selectedEspecial = selects.especialidades.data.find((item) => item.idespecialidad === Number(key)); // Convertir clave a número
                  setFieldValue('idespecialidad', selectedEspecial?.idespecialidad || ''); // Actualiza Formik
                  setEsp(selectedEspecial); // Actualiza el estado local
                }}
                defaultItems={selects.especialidades.data}
              >
                {(item) => <AutocompleteItem key={String(item.idespecialidad)}>{item.especialidad}</AutocompleteItem>}
              </Autocomplete>
            <Autocomplete
                size="sm"
                isRequired
                label="SELECCIONAR ESTADO CIVIL"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idcv ? String(values.idcv) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idcv', ''); // Limpia el valor en Formik
                    setStatuscv(null); // Limpia el estado local
                    return;
                  }
                  const selectedExped = selects.estadocv.data.find((item) => item.idcv === Number(key)); // Convertir clave a número
                  setFieldValue('idcv', selectedExped?.idcv || ''); // Actualiza Formik
                  setStatuscv(selectedExped); // Actualiza el estadocv local
                }}
                defaultItems={selects.estadocv.data}
              >
                {(item) => <AutocompleteItem key={String(item.idcv)}>{item.name}</AutocompleteItem>}
              </Autocomplete>
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Autocomplete
                size="sm"
                isRequired
                label="SELECIONAR GENERO"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idsexo ? String(values.idsexo) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idsexo', ''); // Limpia el valor en Formik
                    setSexo(null); // Limpia el estado local
                    return;
                  }
                  const selectedExped = selects.sexos.data.find((item) => item.idsexo === Number(key)); // Convertir clave a número
                  setFieldValue('idsexo', selectedExped?.idsexo || ''); // Actualiza Formik
                  setSexo(selectedExped); // Actualiza el sexos local
                }}
                defaultItems={selects.sexos.data}
              >
                {(item) => <AutocompleteItem key={String(item.idsexo)}>{item.sexo}</AutocompleteItem>}
              </Autocomplete>
                <Autocomplete
                size="sm"
                isRequired
                label="SELECIONAR SITUACIÓN"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idsituacion ? String(values.idsituacion) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idsituacion', ''); // Limpia el valor en Formik
                    setSituad(null); // Limpia el estado local
                    return;
                  }
                  const selectedExped = selects.situaciones.data.find((item) => item.idsituacion === Number(key)); // Convertir clave a número
                  setFieldValue('idsituacion', selectedExped?.idsituacion || ''); // Actualiza Formik
                  setSituad(selectedExped); // Actualiza el sexos local
                }}
                defaultItems={selects.situaciones.data}
              >
                {(item) => <AutocompleteItem key={String(item.idsituacion)}>{item.situacion}</AutocompleteItem>}
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
