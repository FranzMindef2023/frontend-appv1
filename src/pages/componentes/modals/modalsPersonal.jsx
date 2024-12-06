import React,{useState,useEffect } from "react";
import * as Yup from "yup";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,Input,Autocomplete, AutocompleteItem } from "@nextui-org/react";
import {EyeFilledIcon} from "@/pages/componentes/modals/password/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/pages/componentes/modals/password/EyeSlashFilledIcon";
import { useFormik } from "formik";
import { useUsers } from "@/context/UserContext";
import { useOrganigrama } from "@/context/OrganigramaContext";
import { useCargo } from "@/context/GargosContext";
/*import de selects*/
import { useArmas } from "@/context/ArmasContext";
import { useEspecial } from "@/context/EspecialidadContext";
import { useEstadocv } from "@/context/EstadocvContext";
import { useFuerzas } from "@/context/FuerzasContext";
import { useGeneros } from "@/context/GenerosContext";
import { useGrados } from "@/context/GradosContext";
import { useSitua } from "@/context/SituacionesContext";
import { useExpedido } from "@/context/ExpedicionesContext";

const CustomModal = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData}) => {
  const { createUser,loading , updateUser } = useUsers();
  const [selectedItem, setSelectedItem] = useState([]);
  const [Item, setItem] = useState([]);
  const [ItemFuerzas, setfuerza] = useState([]);
  const [ItemGrados, setGrados] = useState([]);
  const [ItemArmas, setArmas] = useState([]);
  const [ItemEsp, setEsp] = useState([]);
  const [ItemSexo, setSexo] = useState([]);
  const [ItemSituad, setSituad] = useState([]);
  const [ItemExped, setExped] = useState([]);
  const [ItemStatuscv, setStatuscv] = useState([]);
  const { organi,fetchOrganigrama, isInitializedOrg} = useOrganigrama();
  const { cargos,fetchCargos, isInitializedCar } = useCargo();

  const { armas,fetchArmas, isInitializedArm} = useArmas();
  const { especial,fetchEspecialidades, isInitializedEsp} = useEspecial();
  const { statuscv,fetchStatuscv, isInitializedCV} = useEstadocv();
  const { fuerzas,fetchFuerzas, isInitializedF} = useFuerzas();
  const { sexos,fetchSexos, isInitializedGen} = useGeneros();
  const { grados,fetchGrados, isInitializedGra} = useGrados();
  const { situaciones,fetchSituacion, isInitializedSitua} = useSitua();
  const { expedidos,fetchExpedidos, isInitializedExp} = useExpedido();




  useEffect(() => {
    if (!isInitializedOrg) fetchOrganigrama();
    if (!isInitializedCar) fetchCargos();
    if (!isInitializedArm) fetchArmas();
    if (!isInitializedEsp) fetchEspecialidades();
    if (!isInitializedCV) fetchStatuscv();
    if (!isInitializedF) fetchFuerzas();
    if (!isInitializedGen) fetchSexos();
    if (!isInitializedGra) fetchGrados();
    if (!isInitializedSitua) fetchSituacion();
    if (!isInitializedExp) fetchExpedidos();
  });
  // const [value, setValue] = React.useState("");

  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue }= useFormik({
    initialValues:{
      nombres: '',
      appaterno: '',
      apmaterno: '',
      email: '',
      complemento: '',
      codper: '',
      ci:'',
      carnetmil:'',
      carnetseg:'',
      celular:'',
      fechnacimeinto:'',
      gsanguineo:'',
      tipoper:'',
      estserv:'',
      status:true,
      idfuerza:[],
      idespecialidad:[],
      idgrado:[],
      idsexo:[],
      idarma:[],
      idcv:[],
      ...initialData,
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
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
    if (initialData?.idfuerza) {
      const selectedFuerzas = fuerzas.find((item) => item.idfuerza === Number(initialData.idfuerza)); // Forzar a tipo número
      setfuerza(selectedFuerzas);
      setFieldValue('idfuerza', selectedFuerzas?.idfuerza || ''); // Actualiza Formik
    }
    if (initialData?.idgrado) {
      const selectedGrados = grados.find((item) => item.idgrado === Number(initialData.idgrado)); // Forzar a tipo número
      setGrados(selectedGrados);
      setFieldValue('idgrado', selectedGrados?.idgrado || ''); // Actualiza Formik
    }
    if (initialData?.idarma) {
      const selectedArmas = armas.find((item) => item.idarma === Number(initialData.idarma)); // Forzar a tipo número
      setArmas(selectedArmas);
      setFieldValue('idarma', selectedArmas?.idarma || ''); // Actualiza Formik
    }

    if (initialData?.idespecialidad) {
      const selectedEspecial = especial.find((item) => item.idespecialidad === Number(initialData.idespecialidad)); // Forzar a tipo número
      setEsp(selectedEspecial);
      setFieldValue('idespecialidad', selectedEspecial?.idespecialidad || ''); // Actualiza Formik
    }

    if (initialData?.idcv) {
      const selectedStatus = statuscv.find((item) => item.idcv === Number(initialData.idcv)); // Forzar a tipo número
      setStatuscv(selectedStatus);
      setFieldValue('idcv', selectedStatus?.idcv || ''); // Actualiza Formik
    }
    if (initialData?.idsexo) {
      const selectedsetSexo = sexos.find((item) => item.idsexo === Number(initialData.idsexo)); // Forzar a tipo número
      setSexo(selectedsetSexo);
      setFieldValue('idsexo', selectedsetSexo?.idsexo || ''); // Actualiza Formik
    }
    if (initialData?.idsituacion) {
      const selectedSitua = situaciones.find((item) => item.idsituacion === Number(initialData.idsituacion)); // Forzar a tipo número
      setSituad(selectedSitua);
      setFieldValue('idsituacion', selectedSitua?.idsituacion || ''); // Actualiza Formik
    }
    if (initialData?.idexpedicion) {
      const selectedExped = expedidos.find((item) => item.idexpedicion === Number(initialData.idexpedicion)); // Forzar a tipo número
      setExped(selectedExped);
      setFieldValue('idexpedicion', selectedExped?.idexpedicion || ''); // Actualiza Formik
    }
  }, [initialData, organi, cargos,fuerzas, grados,especial,sexos,situaciones,expedidos, setFieldValue]);
 


  

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
                  label="Nombres"
                  variant="bordered"
                  isInvalid={!!errors.nombres && touched.nombres}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={handleChange}  // Manejar el cambio con Formik
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                label="N° de CI" 
                variant="bordered"
                placeholder="Ingrese el numero de ci"
                
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
                type="number" 
                label="complemento" 
                name="celular"
                placeholder="Ingrese el complemento" 
                variant="bordered"
                value={values.celular}
                isInvalid={!!errors.celular && touched.celular}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.celular ? "danger" : "success"}
                errorMessage={errors.celular}
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
                  isInvalid={!!errors.grado && touched.grado}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={handleChange}  // Manejar el cambio con Formik
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="grado"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.grado}  // El valor actual del campo en el formulario
                  placeholder="Ingrese el grado de forma Abreviada"
                  color={errors.grado ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.grado}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
                <Autocomplete
                size="sm"
                isRequired
                label="Buscar unidad Expedicion"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idexpedicion ? String(values.idexpedicion) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  const selectedExped = expedidos.find((item) => item.idexpedicion === Number(key)); // Convertir clave a número
                  setFieldValue('idexpedicion', selectedExped?.idexpedicion || ''); // Actualiza Formik
                  setExped(selectedExped); // Actualiza el estado local
                }}
                defaultItems={expedidos}
              >
                {(item) => <AutocompleteItem key={String(item.idexpedicion)}>{item.Departamento}</AutocompleteItem>}
              </Autocomplete>
                
                <Input 
                size="sm" 
                type="number" 
                label="Carnet Mil." 
                name="celular"
                placeholder="Ingrese el n° de Carnet Mil." 
                variant="bordered"
                value={values.celular}
                isInvalid={!!errors.celular && touched.celular}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.celular ? "danger" : "success"}
                errorMessage={errors.celular}
                className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input 
                size="sm" 
                type="number" 
                label="Cod. Persona" 
                name="celular"
                placeholder="Ingrese el Cod. Persona" 
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
                label="Carnet de Seguro" 
                placeholder="Enter your Carnet de Seguro" 
                variant="bordered"
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.email && touched.email}
                color={errors.email ? "danger" : "success"}
                errorMessage={errors.email}
                className="block w-full "/>
                <Input 
                isRequired
                size="sm" 
                value={values.email}
                name="email"
                type="email" 
                label="NUA/CUA" 
                placeholder="Enter your Carnet de Seguro" 
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
                type="number" 
                label="Celular" 
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
                label="Email" 
                placeholder="Enter your email" 
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
                  type="text"
                  label="TIPO DE SANGRE"
                  variant="bordered"
                  isInvalid={!!errors.grado && touched.grado}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={handleChange}  // Manejar el cambio con Formik
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
                label="FECHA DE ALTA"
                variant="bordered"
                isInvalid={!!errors.grado && touched.grado}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="grado"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.grado}  // El valor actual del campo en el formulario
                placeholder="Ingrese el grado de forma Abreviada"
                color={errors.grado ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.grado}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
              <Autocomplete
                size="sm"
                allowsCustomValue
                isRequired
                label="BUCAR LA FUERZA"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idfuerza ? String(values.idfuerza) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idfuerza', ''); // Limpia el valor en Formik
                    setfuerza(null); // Limpia el estado local
                    return;
                  }
                  const selectedFuerzas = fuerzas.find((item) => item.idfuerza === Number(key)); // Convertir clave a número
                  setFieldValue('idfuerza', selectedFuerzas?.idfuerza || []); // Actualiza Formik
                  setfuerza(selectedFuerzas); // Actualiza el estado local
                }}
                defaultItems={fuerzas}
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
                  const selectedGrado = grados.find((item) => item.idgrado === Number(key)); // Convertir clave a número
                  setFieldValue('idgrado', selectedGrado?.idgrado || ''); // Actualiza Formik
                  setGrados(selectedGrado); // Actualiza el estado local
                }}
                defaultItems={grados}
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
                  const selectedArmas = armas.find((item) => item.idarma === Number(key)); // Convertir clave a número
                  setFieldValue('idarma', selectedArmas?.idarma || ''); // Actualiza Formik
                  setArmas(selectedArmas); // Actualiza el estado local
                }}
                defaultItems={armas}
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
                  const selectedEspecial = especial.find((item) => item.idespecialidad === Number(key)); // Convertir clave a número
                  setFieldValue('idespecialidad', selectedEspecial?.idespecialidad || ''); // Actualiza Formik
                  setEsp(selectedEspecial); // Actualiza el estado local
                }}
                defaultItems={especial}
              >
                {(item) => <AutocompleteItem key={String(item.idespecialidad)}>{item.especialidad}</AutocompleteItem>}
              </Autocomplete>
              <Autocomplete
                isRequired
                size="sm"
                label="BUSCAR EL ESTADO CIVIL"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idcv ? String(values.idcv) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idcv', ''); // Limpia el valor en Formik
                    setEsp(null); // Limpia el estado local
                    return;
                  }
                  const selectedStatus = statuscv.find((item) => item.idcv === Number(key)); // Convertir clave a número
                  setFieldValue('idcv', selectedStatus?.idcv || ''); // Actualiza Formik
                  setItem(selectedStatus); // Actualiza el estado local
                }}
                defaultItems={statuscv}
              >
                {(item) => <AutocompleteItem key={String(item.idcv)}>{item.name}</AutocompleteItem>}
              </Autocomplete>
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Autocomplete
                size="sm"
                isRequired
                label="BUSCAR EL GENERO"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idsexo ? String(values.idsexo) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idsexo', ''); // Limpia el valor en Formik
                    setEsp(null); // Limpia el estado local
                    return;
                  }
                  const selectedSexo = sexos.find((item) => item.idsexo === Number(key)); // Convertir clave a número
                  setFieldValue('idsexo', selectedSexo?.idsexo || ''); // Actualiza Formik
                  setItem(selectedSexo); // Actualiza el estado local
                }}
                defaultItems={sexos}
              >
                {(item) => <AutocompleteItem key={String(item.idsexo)}>{item.sexo}</AutocompleteItem>}
              </Autocomplete>
              <Autocomplete
                size="sm"
                isRequired
                label="BUSCAR SITUACION"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idsituacion ? String(values.idsituacion) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('idsituacion', ''); // Limpia el valor en Formik
                    setEsp(null); // Limpia el estado local
                    return;
                  }
                  const selectedSitua = situaciones.find((item) => item.idsituacion === Number(key)); // Convertir clave a número
                  setFieldValue('idsituacion', selectedSitua?.idsituacion || ''); // Actualiza Formik
                  setItem(selectedSitua); // Actualiza el estado local
                }}
                defaultItems={situaciones}
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
