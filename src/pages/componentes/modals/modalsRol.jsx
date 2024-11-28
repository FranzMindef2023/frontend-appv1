import React,{useStat,useEffect} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRols } from "@/context/RolesContext";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,Input } from "@nextui-org/react";
const CustomModal = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData  }) => {
  const { createRols,updateRolsData } = useRols();
  // Verificar que `initialData` se recibe correctamente
  // useEffect(() => {
  //   console.log("Initial data received:", initialData);
  // }, [initialData]);
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm, }= useFormik({
    initialValues:{
      rol: '',
      status:true,
      ...initialData,
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
      try {
        if (initialData?.id) {
          // Si `initialData` tiene un `id`, es edición
          await updateRolsData(true, values); // Asume que tienes esta función
        } else {
          // Si no hay `id`, es registro
          console.log("Registrando nuevo usuario:", values);
          await createRols(values);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario');
      }
    },
    validationSchema:Yup.object({
      rol: Yup.string().max(20,'Debe tener maximo de 20 caracteres').required('Campo es requerido'),
    })
  });

  
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} >
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
                  label="Rol"
                  variant="bordered"
                  isInvalid={!!errors.rol && touched.rol}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={handleChange}  // Manejar el cambio con Formik
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="rol"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.rol}  // El valor actual del campo en el formulario
                  placeholder="Ingrese el rol"
                  color={errors.rol ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.rol}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
            </div>
            </ModalBody>
            <ModalFooter>
            <Button color="danger" variant="light" onClick={() => {
                  resetForm();  // Call reset form function
                  onClose();    // Call close function
                }}>
                {closeLabel}
              </Button>
              <Button color="primary" type="submit">
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
