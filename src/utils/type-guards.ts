import { ErrorResponse } from '@/types/api';

// ErrorResponse 타입 가드
export function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as ErrorResponse).code === 'string' &&
    typeof (value as ErrorResponse).message === 'string'
  );
}

// 성공 응답인지 체크하는 헬퍼
export function isSuccessResponse<T>(value: T | ErrorResponse): value is T {
  return !isErrorResponse(value);
}
