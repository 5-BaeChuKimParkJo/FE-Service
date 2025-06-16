import { ErrorResponse } from '@/types/api';
import { auth } from './auth-service';

interface RequestOptions extends RequestInit {
  timeout?: number;
  // Next.js 캐싱 옵션 추가
  cache?: RequestCache;
  next?: {
    tags?: string[];
    revalidate?: number | false;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_TIMEOUT = 10000; // 10초

// 타임아웃 기능을 위한 헬퍼 함수
const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout: number,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  });
};

const fetchInstance = async <T = undefined>(
  url: string,
  options: RequestOptions = {},
): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // 인증 헤더 설정 (나중에 구현) 현재 그냥 더미로 넣음
    // headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZjNjZjBmMy02MmI4LTQzNzEtYTAxNC02NDNmODIzMjNlZmQiLCJpYXQiOjE3NDgwODQ0MTZ9.tgqWbCcFhlGajZXiOSLa7tg9A3r0sYVNmGj8sx3nLJM`;
    // 인증 헤더 설정
    try {
      const session = await auth();
      if (session?.user?.accessToken) {
        headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
      if (session?.user?.memberUuid) {
        headers['X-Member-UUID'] = session.user.memberUuid;
      }
    } catch (authError) {
      console.error('인증 오류:', authError);
    }

    // Content-Type 설정
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // FormData인 경우 Content-Type 헤더 제거 (브라우저가 자동 설정)
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    } else if (typeof options.body === 'object' && options.body !== null) {
      options.body = JSON.stringify(options.body);
    }

    const timeout = options.timeout || DEFAULT_TIMEOUT;
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    // Next.js 캐싱 옵션 설정
    const fetchOptions: RequestInit & {
      next?: { tags?: string[]; revalidate?: number | false };
    } = {
      ...options,
      headers,
      cache: options.cache || 'no-store',
    };

    // next 옵션이 있으면 설정
    if (options.next) {
      fetchOptions.next = options.next;
    }

    const response = await fetchWithTimeout(fullUrl, fetchOptions, timeout);

    // 응답이 비어있는 경우 처리 (204 No Content 등)
    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      if (!response.ok) {
        throw {
          code: `HTTP_ERROR_${response.status}`,
          message: response.statusText,
        } as ErrorResponse;
      }
      return undefined as T;
    }

    const contentType = response.headers.get('content-type');

    // JSON이 아닌 응답도 허용 (파일 다운로드 등)
    if (!contentType?.includes('application/json')) {
      if (contentType?.includes('text/')) {
        const text = await response.text();
        if (!response.ok) {
          throw {
            code: 'HTTP_ERROR',
            message: text || `HTTP ${response.status}: ${response.statusText}`,
          } as ErrorResponse;
        }
        return text as T;
      }

      // 기타 바이너리 데이터
      const blob = await response.blob();
      if (!response.ok) {
        throw {
          code: 'HTTP_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        } as ErrorResponse;
      }
      return blob as T;
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw {
        code: 'PARSE_ERROR',
        message: 'Invalid JSON response',
      } as ErrorResponse;
    }

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        url: fullUrl,
      });

      // 서버에서 이미 ErrorResponse 형식으로 반환한 경우
      if (
        data &&
        typeof data.code === 'string' &&
        typeof data.message === 'string'
      ) {
        throw data as ErrorResponse;
      }

      // 기본 에러 형식
      throw {
        code: `HTTP_ERROR_${response.status}`,
        message:
          data?.message ||
          response.statusText ||
          '알 수 없는 오류가 발생했습니다.',
      } as ErrorResponse;
    }

    return data as T;
  } catch (error) {
    // AbortError (타임아웃) 처리
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout:', url);
      throw {
        code: 'TIMEOUT_ERROR',
        message: 'Request timeout',
      } as ErrorResponse;
    }

    // 네트워크 에러 처리
    if (error instanceof TypeError) {
      console.error('Network error:', error);
      throw {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
      } as ErrorResponse;
    }

    // 일반 Error 객체 처리
    if (error instanceof Error) {
      console.error('Fetch error:', error);
      throw {
        code: 'FETCH_ERROR',
        message: error.message,
      } as ErrorResponse;
    }

    // 이미 ErrorResponse 형태로 throw된 경우 그대로 전달
    throw error;
  }
};

// 캐시 무효화 헬퍼 함수 (서버 컴포넌트에서만 작동)
export const invalidateCache = async (tag: string) => {
  // 서버 환경에서만 실행
  if (typeof window === 'undefined') {
    try {
      // 동적 import를 사용하여 서버에서만 revalidateTag를 불러옴
      const { revalidateTag } = await import('next/cache');
      revalidateTag(tag);
      return true;
    } catch (error) {
      console.error('Error invalidating cache:', error);
      return false;
    }
  }

  // 클라이언트에서는 아무것도 하지 않음
  return false;
};

export const instance = {
  get: async <T = undefined>(
    url: string,
    options: Omit<RequestOptions, 'body' | 'method'> = {},
  ) => {
    return fetchInstance<T>(url, { method: 'GET', ...options });
  },

  post: async <T = undefined>(
    url: string,
    data?: object | FormData | string | null,
    options: Omit<RequestOptions, 'body' | 'method'> = {},
  ) => {
    return fetchInstance<T>(url, {
      method: 'POST',
      body: data as BodyInit,
      ...options,
    });
  },

  patch: async <T = undefined>(
    url: string,
    data?: object | FormData | string | null,
    options: Omit<RequestOptions, 'body' | 'method'> = {},
  ) => {
    return fetchInstance<T>(url, {
      method: 'PATCH',
      body: data as BodyInit,
      ...options,
    });
  },

  put: async <T = undefined>(
    url: string,
    data?: object | FormData | string | null,
    options: Omit<RequestOptions, 'body' | 'method'> = {},
  ) => {
    return fetchInstance<T>(url, {
      method: 'PUT',
      body: data as BodyInit,
      ...options,
    });
  },

  delete: async <T = undefined>(
    url: string,
    options: Omit<RequestOptions, 'body' | 'method'> = {},
  ) => {
    return fetchInstance<T>(url, { method: 'DELETE', ...options });
  },
};
