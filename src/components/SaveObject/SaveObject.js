import React from "react";
import { encryptJson } from '../../utils/Encrypt'

const fs = require('fs');
const { dialog } = require('electron');

const saveObjectToFile = (jsonObj) => {
  const encryptedJsonString = encryptJson(jsonObj);
  const filePath = dialog.showSaveDialogSync();

  if (filePath) {
    fs.writeFileSync(filePath, encryptedJsonString);
    console.log('File saved successfully.');
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