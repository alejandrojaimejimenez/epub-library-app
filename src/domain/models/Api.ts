export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
