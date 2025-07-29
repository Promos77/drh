import axios from 'axios';

export const uploadCv = async (file) => {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await axios.post('/api/parse-cv', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};