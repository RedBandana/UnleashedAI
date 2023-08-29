import React, { useEffect } from 'react';
import './AlertDialog.scss';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const AlertDialog = ({ title, text, onYes, onNo, onOk, onClose }) => {

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.className === "main-box") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  function handleOnYes() {
    onYes();
    onClose();
  }

  function handleOnNo() {
    onNo();
    onClose();
  }

  function handleOnOk() {
    onOk();
    onClose();
  }

  return (
    <div className='alert-dialog'>
      <div className="main-box">
        <div className="main-box-container">
          {title && (
            <div className='main-box-header'>
              <div className='main-box-title'>{title}</div>
            </div>
          )}
          {title && (
            <div className='bordered-top'></div>
          )}
          <div className='main-box-body'>
            <div className='main-box-body-row'>
              <ReactMarkdown children={text} />
            </div>
            <div className='main-box-body-row main-box-body-buttons-list'>
              {onYes && (
                <button className="main-box-body-row-button" onClick={handleOnYes}>
                  yes
                </button>
              )}
              {onNo && (
                <button className="main-box-body-row-button" onClick={handleOnNo}>
                  no
                </button>
              )}
              {onOk && (
                <button className="main-box-body-row-button" onClick={handleOnOk}>
                  ok
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlertDialog;