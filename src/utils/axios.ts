import axios from 'axios';

import { appConfig } from '@/config';
import useUserStore from '@/store/useUserStore';
import { ILoginRes, ITokens } from '@/types/auth.type';
import { IResponData } from '@/types/api.type';

const baseURL = appConfig.publicUrl;
const contentType = 'application/json';

let refreshTokenRequest: Promise<ITokens> | null = null;

export const axiosNoAuthInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': contentType },
});

export const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': contentType },
});

const getToken = () => useUserStore.getState()?.tokens;
const setTokens = (tokens: ITokens | null) => useUserStore.getState().setUserAndTokens(null, tokens);
const logoutUser = () => {
  const userStore = useUserStore.getState();
  userStore.setUserAndTokens(null, null);
};

const isExpired = (date: string) => {
  return new Date(date).getTime() < Date.now();
};

const getRefreshToken = async (refreshToken: string) => {
  const tokensData = await axiosNoAuthInstance.post<IResponData<ILoginRes>>('/auth/refresh-tokens', { refreshToken });
  if (![200, 201].includes(tokensData?.status)) throw tokensData;
  return tokensData.data.data.tokens;
};

const refreshToken = async (tokens?: ITokens | null) => {
  try {
    if (!tokens) {
      tokens = getToken();
      if (!tokens) throw new Error('token not found');
    }

    if (isExpired(tokens.refresh.expires)) throw new Error('refresh token expired');
    refreshTokenRequest = refreshTokenRequest ?? getRefreshToken(tokens.refresh.token);
    const newToken = await refreshTokenRequest;
    // reset token request for the next expiration
    refreshTokenRequest = null;
    await setTokens(newToken);
    return newToken.access.token;
  } catch (err) {
    console.error(err);
    // reset tokens
    await logoutUser();
    return null;
  }
};

async function getAccessToken() {
  try {
    const tokens = getToken();
    if (!tokens) return null;

    if (isExpired(tokens.access.expires)) return refreshToken(tokens);

    return tokens?.access.token;
  } catch {
    return null;
  }
}

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;
    if ([401, 403].includes(error?.response?.status) && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await refreshToken();
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  },
);
