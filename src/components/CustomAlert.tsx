
import React from 'react';

interface CustomAlertProps {
  onClose?: () => void;
  message: React.ReactNode;
  type: 'success' | 'danger' | 'info';
}

const CustomAlert: React.FC<CustomAlertProps> = ({ onClose, message, type }) => {
  if (onClose) {
    return (
      <>
        <div className="custom-alert-backdrop" onClick={onClose}></div>
        <div className={`custom-alert-container alert alert-${type}`}>
          {message}
          <button type="button" className="btn-close" onClick={onClose} style={{float: 'right'}}></button>
        </div>
      </>
    );
  }

  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  );
};

export default CustomAlert;
