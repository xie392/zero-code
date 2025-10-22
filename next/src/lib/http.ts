"use client";
type RequestInterceptor = (
  options: ExtendedRequestInit
) => void | Promise<void>;
type ResponseInterceptor = (response: Response) => void | Promise<void>;

interface ExtendedRequestInit extends RequestInit {
  params?: Record<string, any>;
  url: string;
  headers?: HeadersInit & Record<string, string>;
  data?: BodyInit | Record<string, any> | null;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export const addRequestInterceptor = (interceptor: RequestInterceptor) => {
  requestInterceptors.push(interceptor);
};

export const addResponseInterceptor = (interceptor: ResponseInterceptor) => {
  responseInterceptors.push(interceptor);
};

const applyInterceptors = async (
  interceptors: Array<Function>,
  ...args: any[]
) => {
  for (const interceptor of interceptors) {
    await interceptor(...args);
  }
};

export const request = async <T = any>(
  options: ExtendedRequestInit
): Promise<T> => {
  await applyInterceptors(requestInterceptors, options);

  if (!options.method || options.method === "GET") {
    const queryString = toQueryString(options?.params || {});
    if (queryString) options.url += queryString;
  }

  const response = await fetch(baseUrl + options.url, {
    ...options,
    body: options.data ? JSON.stringify(options.data) : null,
    // 带上 cookie
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  await applyInterceptors(responseInterceptors, response);

  if (!response.ok) {
    const errorDetails = await response.json();
    return errorDetails;
  }

  return response.json();
};

// 请求拦截器
addRequestInterceptor(async (options) => {
  //   const { token } = useUserStore.getState();
  options.headers = {
    ...(options.headers as Record<string, string>),
    // Authorization: options.headers?.Authorization || `Bearer ${token}`,
  };
});

// 响应拦截器
addResponseInterceptor(async (response) => {
  if (!response.ok) return;
  const clonedResponse = response.clone();
  const data = await clonedResponse.json();
  // 处理 401 错误
  if (data.code === 40100) {
    window.location.href = "/login";
  }
});

const toQueryString = (params: Record<string, any>) => {
  const queryString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return queryString ? `?${queryString}` : "";
};
