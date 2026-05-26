import axios from 'axios';

// Base URL - empty for dev (uses Vite proxy) and production (Nginx proxy)
const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token
const getToken = () => localStorage.getItem('token');

// ---- User APIs ----
export const registerUser = (data) =>
  api.post('/api/users/register', data);

export const loginUser = (data) =>
  api.post('/api/users/login', data);

export const getProfile = () =>
  api.get('/api/users/profile', { params: { token: getToken() } });

// ---- Meal APIs ----
export const createMeal = (data) =>
  api.post('/api/meals', data, { params: { token: getToken() } });

export const getMeals = () =>
  api.get('/api/meals', { params: { token: getToken() } });

export const updateMeal = (id, data) =>
  api.put(`/api/meals/${id}`, data, { params: { token: getToken() } });

export const deleteMeal = (id) =>
  api.delete(`/api/meals/${id}`, { params: { token: getToken() } });

// ---- Calorie APIs ----
export const getTodayCalories = () =>
  api.get('/api/calories/today', { params: { token: getToken() } });

export const getWeekCalories = () =>
  api.get('/api/calories/week', { params: { token: getToken() } });

export const getMonthCalories = () =>
  api.get('/api/calories/month', { params: { token: getToken() } });

export default api;
