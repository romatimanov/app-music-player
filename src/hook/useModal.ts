import { useState, useEffect } from "react";

let activeModal: (() => void) | null = null;

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = () => {
    if (activeModal && activeModal !== closeModal) {
      activeModal();
    }
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    activeModal = closeModal;
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    if (activeModal === closeModal) {
      activeModal = null;
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
  };
}
