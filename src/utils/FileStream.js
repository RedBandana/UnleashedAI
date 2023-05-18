
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
                const jsonObject = JSON.parse(fileReader.result);
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

export { saveJSONToFile, readJSONFromFile, readJSONFromUserInput }
