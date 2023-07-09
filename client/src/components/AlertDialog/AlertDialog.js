import React, { useState } from 'react';
import './AlertDialog.scss';

const AlertDialog = ({ text }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => {
    setShowDialog(false);
  };

  if (!showDialog) {
    return null; // Return null to hide the component
  }

  return (
    <div className="alert-dialog">
      <div className="alert-dialog-content">
        <div className="alert-dialog-text">{text}</div>
        <button className="alert-dialog-button" onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertDialog;