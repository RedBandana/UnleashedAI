import React from "react";

const saveJSONToFile = (jsonObject, filename) => {
    const data = JSON.stringify(jsonObject);
  const blob = new Blob([data], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function SaveObject({ objectToSave }) {
    const handleSave = () => {
        saveJSONToFile(objectToSave);
    };

    return (
        <button onClick={handleSave}>
            Save Object
        </button>
    );
}

export default SaveObject;