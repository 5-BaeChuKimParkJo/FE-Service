export interface ApiResponse<T> {
  httpStatus: string;

  isSuccess: boolean;

  message: string;

  code: number;

  result: T | null;
}
