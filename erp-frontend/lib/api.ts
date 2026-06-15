// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Attach JWT token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout jika token expired
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// --- Auth ---
// Sesuai LoginDto di backend: { login, password }
export const authApi = {
  login: (login: string, password: string) =>
    api.post('/auth/login', { login, password }),
};

// --- Products ---
export const productsApi = {
  getAll: (params?: { limit?: number; offset?: number; search?: string }) =>
    api.get('/api/products', { params }),
  getOne: (id: number) => api.get(`/api/products/${id}`),
  create: (data: any) => api.post('/api/products', data),
  update: (id: number, data: any) => api.put(`/api/products/${id}`, data),
  delete: (id: number) => api.delete(`/api/products/${id}`),
};

// --- Sales Orders ---
export const salesApi = {
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get('/api/sales', { params }),
  getOne: (id: number) => api.get(`/api/sales/${id}`),
  create: (data: any) => api.post('/api/sales', data),
  confirm: (id: number) => api.post(`/api/sales/${id}/confirm`),
};

// --- Customers ---
export const customersApi = {
  getAll: (params?: { limit?: number; search?: string }) =>
    api.get('/api/customers', { params }),
  getOne: (id: number) => api.get(`/api/customers/${id}`),
  create: (data: any) => api.post('/api/customers', data),
};

// --- Dashboard Stats ---
export const dashboardApi = {
  getStats: () => api.get('/api/dashboard/stats'),
};

export default api;