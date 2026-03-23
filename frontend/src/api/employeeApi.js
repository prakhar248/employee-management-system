import axios from "axios";

const API_BASE = "https://employee-management-system-yj3n.onrender.com/api/employees";

// Fetch all employees with optional query params
export const fetchEmployees = (params = {}) => {
  return axios.get(API_BASE, { params });
};

// Fetch a single employee by ID
export const fetchEmployee = (id) => {
  return axios.get(`${API_BASE}/${id}`);
};

// Create a new employee
export const createEmployee = (data) => {
  return axios.post(API_BASE, data);
};

// Update an existing employee
export const updateEmployee = (id, data) => {
  return axios.put(`${API_BASE}/${id}`, data);
};

// Delete an employee
export const deleteEmployee = (id) => {
  return axios.delete(`${API_BASE}/${id}`);
};

// Get list of all departments
export const fetchDepartments = () => {
  return axios.get(`${API_BASE}/meta/departments`);
};
