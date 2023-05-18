import React from "react";
import { encryptJson } from '../../utils/Encrypt'
import fsExtra from 'fs-extra';

const { dialog } = require('electron');

const saveObjectToFile = (jsonObj) => {
  const encryptedJsonString = encryptJson(jsonObj);
  const filePath = dialog.showSaveDialogSync();

  if (filePath) {
    fsExtra.writeFile(filePath, encryptedJsonString, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console .log('File saved successfully.');
    });
  } 
  else {
    console.log('No file selected.');
  }
};

function SaveObject({ objectToSave }) {
  const handleSave = () => {
    saveObjectToFile(objectToSave);
  };

  return (
    <button onClick={handleSave}>
      Save Object
    </button>
  );
}

export default SaveObject;