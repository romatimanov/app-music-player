import React from "react";
import ReactDOM from "react-dom";
import "./modal.css";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__content">
        <span className="modal__close" onClick={onClose}>
          ×
        </span>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};
