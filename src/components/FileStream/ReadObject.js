import React from "react";

/*
Note: In Electron, you need to use `window.require` to access Node.js modules in the renderer process. 
Also, you need to handle errors when reading and writing files using the `fs` module.
Note: These functions use the `Blob` and `FileReader` APIs to read and write files on the client-side. 
Also, you need to handle errors when reading and writing files using these APIs.
*/

const readJSONFromFile = (filename) => {
    const reader = new FileReader();
    reader.readAsText(filename);
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            try {
                const jsonObject = JSON.parse(reader.result);
                resolve(jsonObject);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
}

const readJSONFromUserInput = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                try {
                    const jsonObject = JSON.parse(reader.result);
                    resolve(jsonObject);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        };
        input.click();
    });
}

function ReadObject({ onObjectRead }) {
    const handleFileChange = async (e) => {
        const object = await readJSONFromUserInput();
        onObjectRead(object);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
}

export default ReadObject;