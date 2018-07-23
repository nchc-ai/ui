
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import * as types from './actionTypes';
import { API_URL, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem, tempfyData } from '../libraries/utils';


// 設定userInfo

export const setUserInfo = (userInfo, isLogin) => ({
  type: types.SET_USER_INFO,
  userInfo,
  isLogin
});

export const setUserToken = token => ({
  type: types.SET_USER_TOKEN,
  token
});

export const resetAuth = () => ({
  type: types.RESET_AUTH
});


// Proxy > Token
export const retrieveToken = (code, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/proxy/token`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code
      }),
      types: types.RETRIEVE_TOKEN
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('retrieveToken 失敗', response);
  }

  next(response.payload.token);
};

// Proxy > Introspection
export const getUserInfo = (token, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/proxy/introspection`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token
      }),
      types: types.GET_USER_INFO
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getUserInfo 失敗', response);
  }

  if (next) {
    next();
  }
};


// Proxy > Logout
export const logout = (token, next) => async (dispatch) => {
  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/proxy/logout`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        token
      }),
      types: types.LOGOUT
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('logout 失敗', response);
  }

  if (next) {
    next();
  }
};

// Proxy > Register
export const signup = formData => async (dispatch) => {

  const tempData = tempfyData(formData);

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/proxy/register`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tempData),
      types: types.SIGNUP
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('signup 失敗');
  }
};


// Proxy > Updata
export const updateProfile = (formData, token) => async (dispatch) => {
 
  const tempData = tempfyData(formData);

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/proxy/update`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tempData),
      types: types.UPDATE_PROFILE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('updateProfile 失敗');
  }
};


// Proxy > UserInfo
export const getProfile = (token, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/proxy/query`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_PROFILE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getProfile 失敗');
  }

  console.log('[getProfile] payload', response.payload);
  next(response.payload);
};




// Health Check > check-kubernetes
export const healthCheck = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/health/kubernetes`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      types: types.HEALTH_CHECK
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('healthCheck 失敗');
  }
};

// Health Check > check-database
export const checkDatabase = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/health/database`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' }),
      types: types.CHECK_DATABASE
    }
  });

  // console.log("response", response);
  if (_.isUndefined(response) || response.payload.error) {
    console.error('checkDatabase 失敗');
  }
};

// 登入
export const manualLogin = (formData, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/auth/login`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      }),
      types: types.MANUAL_LOGIN
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('manual Login 失敗');
  }
  // next(response.payload.result[0]);
};

// 註冊
export const manualSignup = (formData, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/auth/register`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      }),
      types: types.MANUAL_SIGNUP
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('manual Signup 失敗');
  }

  // next(response.payload.result[0]);
};
