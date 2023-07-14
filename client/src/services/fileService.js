import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/files`;

export const getAllFiles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getFileById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const uploadFile = async (blob, filename) => {
    try {
        const formData = new FormData();
        formData.append('file', blob, filename);

        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } 
    catch (error) {
        console.error('Error uploading file:', error);
    }
};
