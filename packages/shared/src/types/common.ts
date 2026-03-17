export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface SoftDelete {
  deletedAt: string | null;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export type SortDirection = "asc" | "desc";

export interface SortOrder {
  field: string;
  direction: SortDirection;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
