import React,{useState,useEffect } from "react";
import * as Yup from "yup";
import { Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button,
  Input,
  InputOtp ,
  Textarea,
  Alert,
  Autocomplete, 
  AutocompleteItem,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { usePersonas } from "@/context/PersonasContext";
import { useHomes } from "@/context/HomeContext";


const CustomModal = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData}) => {
  // const { createUser,loading , updateUser } = useUsers();
  const {updateEndDate} = usePersonas();
  const { fetchReparticion,isInitialRepart,reparticion} = useHomes();

  // const [ItemFuerzas, setfuerza] = useState([]);
  // const [ItemGrados, setGrados] = useState([]);
  // const [ItemArmas, setArmas] = useState([]);
  // const [ItemEsp, setEsp] = useState([]);
  // const [ItemSexo, setSexo] = useState([]);
  // const [ItemSituad, setSituad] = useState([]);
  // const [ItemExped, setExped] = useState([]);
  // const [ItemStatuscv, setStatuscv] = useState([]);

  // const { selects,fetchSelects, isInitializedSelect} = useselects();
  //  const [alertVisible, setAlertVisible] = useState(false);


  const handleDateInput = (e, setFieldValue) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
    if (value.length >= 2) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    setFieldValue("enddate", value);
  };

  useEffect(() => {
    
    if (!isInitialRepart) fetchReparticion();
  },[isInitialRepart]);

  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue,setValues }= useFormik({
    initialValues: {
      idpersona:[],
      idassig:[],
      code:[],
      ci: '',
      complemento: '',
      codper: '',
      fechnacimeinto: '',
      fechaegreso: '',
      organizacion:'',
      puesto:'',
      situacion:'',
      fuerza:'',
      fechaingreso:'',
      gestion_ingreso:'',
      gsanguineo: '',
      carnetmil: '',
      carnetseg: '',
      nuacua: '',
      tipoper: 'M',
      motivofin:'',
      estserv: '',
      namepersona:'',
      ...initialData, // Sobrescribe los valores con `initialData` si está presente
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
      try {
        await updateEndDate(values);
        // if (initialData?.id) {
        //   // Si `initialData` tiene un `id`, es edición
        //   await updateEndDate(values); // Asume que tienes esta función
        // } else {
        //   await createPersona(values);
        // }
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario');
      }
    },
    validationSchema:Yup.object({
      motivofin: Yup.string().max(250,'Debe tener maximo de 250 caracteres').required('Campo requerido'),
      code: Yup.number()
            .required('Debes seleccionar destino anterior') 
            .typeError('Debes seleccionar destino anterior'),
      fechaingreso:Yup.string().required('No exite la fecha de Ingreso'),
      gestion_ingreso:Yup.number().required('No exite gestion de Ingreso'),
      ci: Yup.string()
            .matches(/^\d+$/, 'La cédula debe contener solo números') // Permitir solo dígitos
            .min(6, 'La cédula debe tener mínimo 6 caracteres') // Longitud mínima
            .max(10, 'La cédula debe tener máximo 10 caracteres') // Longitud máxima
            .required('La cédula de identidad es requerida y luego realizar la busqueda'),
      enddate: Yup.string()
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
    })
  });
  // useEffect(() => {
  //   if (initialData?.idfuerza) {
  //     const slectedFuerza = selects.fuerzas.data.find((item) => item.idfuerza === Number(initialData.idfuerza)); // Forzar a tipo número
  //     setfuerza(slectedFuerza);
  //     setFieldValue('idfuerza', slectedFuerza?.idfuerza || ''); // Actualiza Formik
  //   }
  //   if (initialData?.idgrado) {
  //     const selectedGrados = selects.grados.data.find((item) => item.idgrado === Number(initialData.idgrado)); // Forzar a tipo número
  //     setGrados(selectedGrados);
  //     setFieldValue('idgrado', selectedGrados?.idgrado || ''); // Actualiza Formik
  //   }
  //   if (initialData?.idarma) {
  //     const selectedArmas = selects.armas.data.find((item) => item.idarma === Number(initialData.idarma)); // Forzar a tipo número
  //     setArmas(selectedArmas);
  //     setFieldValue('idarma', selectedArmas?.idarma || ''); // Actualiza Formik
  //   }

  //   if (initialData?.idespecialidad) {
  //     const selectedEspecial = selects.especialidades.data.find((item) => item.idespecialidad === Number(initialData.idespecialidad)); // Forzar a tipo número
  //     setEsp(selectedEspecial);
  //     setFieldValue('idespecialidad', selectedEspecial?.idespecialidad || ''); // Actualiza Formik
  //   }

  //   if (initialData?.idcv) {
  //     const selectedStatus = selects.estadocv.data.find((item) => item.idcv === Number(initialData.idcv)); // Forzar a tipo número
  //     setStatuscv(selectedStatus);
  //     setFieldValue('idcv', selectedStatus?.idcv || ''); // Actualiza Formik
  //   }
  //   if (initialData?.idsexo) {
  //     const selectedsetSexo = selects.sexos.data.find((item) => item.idsexo === Number(initialData.idsexo)); // Forzar a tipo número
  //     setSexo(selectedsetSexo);
  //     setFieldValue('idsexo', selectedsetSexo?.idsexo || ''); // Actualiza Formik
  //   }
  //   if (initialData?.idsituacion) {
  //     const selectedSitua = selects.situaciones.data.find((item) => item.idsituacion === Number(initialData.idsituacion)); // Forzar a tipo número
  //     setSituad(selectedSitua);
  //     setFieldValue('idsituacion', selectedSitua?.idsituacion || ''); // Actualiza Formik
  //   }
  //   if (initialData?.idexpedicion) {
  //     const selectedExped = selects.expediciones.data.find((item) => item.idexpedicion === Number(initialData.idexpedicion)); // Forzar a tipo número
  //     setExped(selectedExped);
  //     setFieldValue('idexpedicion', selectedExped?.idexpedicion || ''); // Actualiza Formik
  //   }
  // }, [initialData,selects,  setFieldValue]);
 
  // const handleSearchByCI = async () => {
  //   if (!values.ci) {
  //     // Mostrar alerta si el usuario no está seleccionado
  //     setAlertVisible(true);
  //     setTimeout(() => setAlertVisible(false), 3000); // Ocultar después de 3 segundos
  //     return;
  //   }
  //   try {
  //     const persona=await showPersonalById(values.ci);
  //     // Actualiza los campos del formulario si se encuentra la persona
  //   setValues({
  //     ...values,
  //     idpersona:persona.idpersona || "",
  //     namepersona: persona.namepersona || "",
  //     appaterno: persona.appaterno || "",
  //     apmaterno: persona.apmaterno || "",
  //     email: persona.email || "",
  //     celular: persona.celular || "",
  //     carnetmil: persona.carnetmil || "",
  //     fechnacimeinto: persona.fechnacimeinto || "",
  //     gestion_ingreso: persona.gestion_ingreso || "",
  //     fechaingreso: persona.fechaingreso || "",
  //     fuerza:persona.fuerza || "",
  //     situacion:persona.situacion || "",
  //     organizacion:persona.organizacion || "",
  //     puesto:persona.puesto || "",
  //     idassig:persona.idassig || "",
  //   });
  //   } catch (error) {
  //     console.error('Error al registrar usuario:', error);
  //     // alert('Error al registrar usuario');
  //   }
  // };
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <form noValidate onSubmit={handleSubmit}>
              <ModalBody>
                {/* {alertVisible && (
                  <Alert color="danger" title="Por favor Ingres el Numero de la cedula de identidad" />
                )} */}
              {/* <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <div className="flex w-full gap-4 items-center">
                  <InputOtp
                    variant="bordered"
                    length={9} // Longitud máxima del CI
                    isInvalid={!!errors.ci && touched.ci}
                    errorMessage={errors.ci}
                    value={values.ci}
                    placeholder="Ingrese CI"
                    onValueChange={(value) => setFieldValue("ci", value)} // Actualiza el campo en Formik
                  />
                </div>
              </div> */}
              {/* <div className="flex w-full flex-wrap md:flex-nowrap gap-6 justify-end">
                <Button color="primary" onClick={handleSearchByCI}>
                  BUSCAR
                </Button>
              </div> */}
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input 
                size="sm" 
                isReadOnly
                type="text" 
                name="namepersona"
                label="CEDUAL DE IDENTIDAD" 
                variant="bordered"
                placeholder="Número de docuemnto de identidad"
                value={values.namepersona}
                color= "success"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input 
                size="sm" 
                isReadOnly
                type="text" 
                name="ci"
                label="CEDUAL DE IDENTIDAD" 
                variant="bordered"
                placeholder="Número de docuemnto de identidad"
                value={values.ci}
                color= "success"
                />
                <Input 
                size="sm" 
                isReadOnly
                type="text" 
                label="COMPLEMENTO" 
                name="complemento"
                placeholder="Complemento" 
                variant="bordered"
                value={values.complemento}
                color= "success"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input 
                size="sm" 
                type="text" 
                label="CARTNET MILITAR" 
                name="carnetmil"
                placeholder="Número de carnet militar" 
                variant="bordered"
                value={values.carnetmil}
                errorMessage={errors.carnetmil}
                className="block w-full"
                color= "success"
                />
                <Input
                  size="sm"
                  isReadOnly
                  type="text"
                  label="FECHA DE NACIMIENTO"
                  variant="bordered"
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="fechnacimeinto"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.fechnacimeinto}  // El valor actual del campo en el formulario
                  placeholder="Fecha de nacimiento"
                  className="block w-full"
                  color= "success"

                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isReadOnly
                  label="FECHA DE INGRESO"
                  variant="bordered"
                  name="fechaingreso"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.fechaingreso}  // El valor actual del campo en el formulario
                  placeholder="Fecha de ingreso"
                  className="block w-full"
                  color= "success"
                  isInvalid={!!errors.fechaingreso && touched.fechaingreso}
                  errorMessage={errors.fechaingreso}
                />
                
                <Input
                  size="sm"
                  isReadOnly
                  label="GESTION DE INGRESO"
                  variant="bordered"
                  name="gestion_ingreso"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.gestion_ingreso}  // El valor actual del campo en el formulario
                  placeholder="Gestion de ingreso"
                  className="block w-full"
                  color= "success"
                  isInvalid={!!errors.gestion_ingreso && touched.gestion_ingreso}
                  errorMessage={errors.gestion_ingreso}
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isReadOnly
                  label="FUERZA"
                  variant="bordered"
                  name="fuerza"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.fuerza}  // El valor actual del campo en el formulario
                  placeholder="Fecha de ingreso"
                  className="block w-full"
                  color= "success"
                />
                <Input
                  size="sm"
                  isReadOnly
                  label="SITUACION"
                  variant="bordered"
                  name="situacion"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.situacion}  // El valor actual del campo en el formulario
                  placeholder="Fecha de ingreso"
                  className="block w-full"
                  color= "success"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isReadOnly
                  label="REPARTICION"
                  variant="bordered"
                  name="organizacion"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.organizacion}  // El valor actual del campo en el formulario
                  placeholder="Reparticion"
                  className="block w-full"
                  color= "success"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isReadOnly
                  label="CARGO ACTUAL"
                  variant="bordered"
                  name="puesto"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.puesto}  // El valor actual del campo en el formulario
                  placeholder="Cargo"
                  className="block w-full"
                  color= "success"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isRequired={true}
                  type="text"
                  label="FECHA DE DESVINCULACION"
                  variant="bordered"
                  isInvalid={!!errors.enddate && touched.enddate}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => handleDateInput(e, setFieldValue)}
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="enddate"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.enddate}  // El valor actual del campo en el formulario
                  placeholder="Ingrese la fecha de desvinculacion"
                  color={errors.enddate ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.enddate}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Textarea
                  key="bordered"
                  className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                  label="DESCRIPCION DE MOTIVO"
                  placeholder="Ingrese la descripcion"
                  variant="bordered"
                  isRequired={true}
                  type="text"
                  isInvalid={!!errors.motivofin && touched.motivofin}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={(e) => {
                    // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                    handleChange({
                      target: { name: e.target.name, value: e.target.value.toUpperCase() },
                    });
                  }}
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="motivofin"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.motivofin}  // El valor actual del campo en el formulario
                  color={errors.motivofin ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.motivofin}  // Mostrar el mensaje de error desde Formik
                />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Autocomplete
                  size="sm"
                  isRequired
                  label="DESTINO DE REPLIEGUE"
                  variant="bordered"
                  className="block w-full"
                  isInvalid={!!errors.code && touched.code}
                  color={errors.code ? "danger" : "success"}
                  errorMessage={errors.code}
                  selectedKey={values.code ? String(values.code) : undefined} // Asegúrate de que es una cadena
                  onSelectionChange={(key) => {
                    if (!key) {
                      setFieldValue('code', ''); // Limpia el valor en Formik
                      setfuerza(null); // Limpia el estado local
                      return;
                    }
                    const selectedExped = reparticion.find((item) => item.code === Number(key)); // Convertir clave a número
                    setFieldValue('code', selectedExped?.code || ''); // Actualiza Formik
                    setfuerza(selectedExped); // Actualiza el estado local
                  }}
                  defaultItems={reparticion}
                >
                  {(item) => <AutocompleteItem key={String(item.code)}>{item.reparticion}</AutocompleteItem>}
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
              <Button color="primary" type="submit"  >
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
