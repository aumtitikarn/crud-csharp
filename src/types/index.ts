export interface Employee {
    id: number;
    name: string;
    position: string;
    salary: number;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }