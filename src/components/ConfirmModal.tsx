
import React from 'react';

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="custom-alert-backdrop" onClick={onClose}></div>
      <div className="custom-alert-container bg-light">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body text-dark text-center">
          <p className="fw-bold modal-body-text">{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Conferma</button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
