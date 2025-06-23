import { getTokenCookie } from '@/services';
import axios, {
  AxiosError,
  AxiosInstance, 
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

// Konfigurasi endpoint API
const baseAPIv1 = 'https://sipongi.menlhk.go.id/sipp-karhutla/api';
const baseAPIv2 = 'https://sipongi.menlhk.go.id/sipp-karhutla/api_v2';

// const baseAPIv1 = 'http://203.99.108.16/api-sipp-mobile';
// const baseAPIv2 = 'http://203.99.108.16/api-sipp-v2';

// const baseAPIv1 = 'https://sipp-api.gusendra.site/api-sipp-mobile';
// const baseAPIv2 = 'https://sipp-api.gusendra.site/api-sipp-v2';

// Deklarasi endpoint spesifik untuk layanan terpisah
export const simaduApiUrl = `${baseAPIv1}/simadu`;
export const authApiUrl = `${baseAPIv1}/auth`;
export const hotspotApiUrl = '/api/hotspot.php';
export const apiV2URL = `${baseAPIv1}`;
export const URLapiV2 = `${baseAPIv2}`;
 
const handleRequestSend = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => { 
  const token = getTokenCookie();
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};
 
const handleRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};
 
const handleResponseReceive = (response: AxiosResponse): any => {
  return response.data;
}; 

const handleResponseError = (error: AxiosError): any => {
  return error.response ? error.response.data : error;
};

// Inisialisasi instans Axios dengan konfigurasi dasar
export const API: AxiosInstance = axios.create({
  baseURL: baseAPIv2 || '',
  headers: { Accept: 'application/json' }
});

export const SimaduAPI: AxiosInstance = axios.create({
  baseURL: simaduApiUrl,
  headers: { Accept: 'application/json' }
});

export const apiV2: AxiosInstance = axios.create({
  baseURL: apiV2URL,
  headers: { Accept: 'application/json' }
});

export const AuthAPI: AxiosInstance = axios.create({
  baseURL: authApiUrl,
  headers: { Accept: 'application/json' }
});

export const HotspotAPI: AxiosInstance = axios.create({
  baseURL: hotspotApiUrl,
  headers: { Accept: 'application/json' }
});

// Konfigurasi interceptor untuk setiap instans API
API.interceptors.request.use(handleRequestSend, handleRequestError);
API.interceptors.response.use(handleResponseReceive, handleResponseError);

SimaduAPI.interceptors.request.use(handleRequestSend, handleRequestError);
SimaduAPI.interceptors.response.use(handleResponseReceive, handleResponseError);

AuthAPI.interceptors.request.use(handleRequestSend, handleRequestError);
AuthAPI.interceptors.response.use(handleResponseReceive, handleResponseError);

HotspotAPI.interceptors.request.use(handleRequestSend, handleRequestError);
HotspotAPI.interceptors.response.use(handleResponseReceive, handleResponseError);

apiV2.interceptors.request.use(handleRequestSend, handleRequestError);
apiV2.interceptors.response.use(handleResponseReceive, handleResponseError);