import { getIsMobile } from '../redux/selectors/uiSelectors';
import { uploadFile } from '../services/fileService';

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;
const isMobile = useSelector(getIsMobile);

export const saveJSONToFile = async (jsonObject, filename) => {
    const data = JSON.stringify(jsonObject);
    const blob = await encryptDataToBlob(data);

    try {
        const link = document.createElement('a');
        link.download = filename;
        
        if (isMobile) {
            const fileId = await uploadFile(blob, filename);
            link.href = `${process.env.REACT_APP_API_URL}/files/download/${fileId}`;
            triggerDownload(link);
        }
        else {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            triggerDownload(link);
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

export const readJSONFromUserInput = (inputFile) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(inputFile);

        fileReader.onerror = () => {
            fileReader.abort();
            reject(new Error('Unable to read file.'));
        };

        fileReader.onload = async () => {
            try {
                const decryptedData = await decryptData(fileReader.result);
                const jsonObject = JSON.parse(new TextDecoder().decode(decryptedData));
                resolve(jsonObject);
            } catch (error) {
                reject(error);
            }
        };
    });
}

function triggerDownload(link) {
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function encryptDataToBlob(data) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(encryptionKey), 'AES-GCM', true, ['encrypt']);
    const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv, additionalData: salt }, key, new TextEncoder().encode(data));
    const blob = new Blob([salt, iv, encryptedData], { type: 'application/octet-stream' });

    return blob;
}

async function decryptData(result) {
    const fileData = new Uint8Array(result);
    const salt = fileData.slice(0, 16);
    const iv = fileData.slice(16, 28);
    const encryptedData = fileData.slice(28);
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(encryptionKey), 'AES-GCM', true, ['decrypt']);
    const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv, additionalData: salt }, key, encryptedData);
    return decryptedData;
}
