import crypto from 'crypto-browserify';

const algorithm = 'aes-256-ctr';
const secretKey = 'mE2ggXIIpZn9MPO1iIln3X0ywajtI1Y=';
const iv = crypto.randomBytes(16);

const encryptJson = (jsonObj) => {
  const jsonString = JSON.stringify(jsonObj);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(jsonString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    content: encrypted,
  };
};

const decryptJson = (encryptedJson) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encryptedJson.iv, 'hex'));
  let decrypted = decipher.update(encryptedJson.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};

const saveJSONToFile = (jsonObject, filename) => {
    const data = encryptJson(jsonObject)
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

const readJSONFromUserInput = (inputFile) => {
    const fileReader = new FileReader();
    fileReader.readAsText(inputFile);

    return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
            fileReader.abort();
            reject(new Error('Unable to read file.'));
        };

        fileReader.onload = () => {
            try {
                const encryptedData = fileReader.result;
                const decryptedData = decryptJson(encryptedData);
                const jsonObject = JSON.parse(decryptedData);
                resolve(jsonObject);
            } catch (error) {
                reject(error);
            }
        };
    });
}

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

export { saveJSONToFile, readJSONFromFile, readJSONFromUserInput, encryptJson, decryptJson }
