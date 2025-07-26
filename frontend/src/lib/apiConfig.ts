import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8001', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * This runs before every request is sent. Its purpose is to automatically attach the
 * JWT access token to the `Authorization` header if it exists in localStorage.
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');

      if ( accessToken && !config.url?.includes('/auth/login') &&
        !config.url?.includes('/auth/registration') ) 
        {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    return config;
  },
  (error) => { Promise.reject(error); }
);

export default apiClient;