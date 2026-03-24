import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, we could add response interceptors here 
// to handle 401s and automatically call /auth/refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 401, we could attempt to refresh the token, 
    // but in Week 1, we let the backend handle token validation
    // and just redirect to login if it fully fails.
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Simple redirect to login on client side if 401
        // window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);
