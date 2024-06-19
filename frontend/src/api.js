import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const uploadVideo = (formData) => {
    return axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getVideoStatus = (taskId) => {
    return axios.get(`${API_BASE_URL}/status/video/${taskId}`);
};

export const getProcessedText = (videoId) => {
    return axios.get(`${API_BASE_URL}/result/${videoId}`);
};

export const generateGIFs = (data) => {
    return axios.post(`${API_BASE_URL}/generate_gifs`, data);
};

export const getGIFStatus = (taskId) => {
    return axios.get(`${API_BASE_URL}/status/gif/${taskId}`);
};

export const downloadGIFs = (videoId) => {
    return axios.get(`${API_BASE_URL}/gifs/${videoId}`, { responseType: 'blob' });
};
