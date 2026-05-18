import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Note: Make sure backend is running on port 5000
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
