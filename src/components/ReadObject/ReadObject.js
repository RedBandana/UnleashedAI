import React from "react";
import { decryptJson } from '../../utils/Encrypt'
import fsExtra from 'fs-extra';

const { dialog } = require('electron');

const readObjectFromFile = () => {
    const filePath = dialog.showOpenDialogSync();

    if (filePath) {
        fsExtra.readFileSync(filePath[0], 'utf-8', (err, encryptedJsonString) => {
            if (err) {
                console.log(err);
                return;
            }

            const decryptedJsonString = decryptJson(encryptedJsonString);
            const jsonObj = JSON.parse(decryptedJsonString);
            return jsonObj;
        });
    }
};

function ReadObject({ onObjectRead }) {
    const handleFileChange = async (e) => {
        const object = await readObjectFromFile();
        onObjectRead(object);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
}

export default ReadObject;