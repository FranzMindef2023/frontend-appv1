import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
} from "@nextui-org/react";
import { useUsers } from "@/context/UserContext";

const CustomModal = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData, initialDataUser}) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { createUserRols} = useUsers();

  // Configurar el rol seleccionado basado en `assigned`
  useEffect(() => {
    if (Array.isArray(initialData)) {
      const initiallySelected = initialData.find((role) => role.assigned === 1);
      setSelectedRole(initiallySelected ? initiallySelected.idrol.toString() : null);
    }
  }, [initialData,initialDataUser]);

  // Manejar cambio de switches (único rol activo)
  const handleSwitchChange = (id) => {
    setSelectedRole(id); // Actualiza el rol seleccionado
  };

  const handleSubmit = async () => {
    try {
      await createUserRols(selectedRole,initialDataUser);
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };
  

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {Array.isArray(initialData) && initialData.length > 0 ? (
            initialData.map((role) => (
              <div
                key={role.idrol}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>{role.rol}</span>
                <Switch
                  color="secondary"
                  isSelected={selectedRole === role.idrol.toString()}
                  onChange={() => handleSwitchChange(role.idrol.toString())}
                />
              </div>
            ))
          ) : (
            <p>No roles available</p> // Mensaje alternativo si initialData es null o vacío
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            {closeLabel}
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {actionLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
