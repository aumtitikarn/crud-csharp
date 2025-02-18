// src/services/employeeService.ts
import { Employee, ApiResponse } from '@/types';

const BASE_URL = 'https://localhost:7140/api/employee';

export async function fetchEmployees(): Promise<ApiResponse<Employee[]>> {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data;
}

export async function createEmployee(employeeData: Omit<Employee, 'id'>): Promise<ApiResponse<Employee>> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  });
  return response.json();
}

export async function updateEmployee(id: number, employeeData: Omit<Employee, 'id'>): Promise<ApiResponse<Employee>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  });
  return response.json();
}

export async function deleteEmployee(id: number): Promise<ApiResponse<Employee>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function searchEmployees(name: string): Promise<ApiResponse<Employee[]>> {
  const response = await fetch(`${BASE_URL}/search/${name}`);
  return response.json();
}