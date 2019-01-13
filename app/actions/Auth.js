
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import * as types from './actionTypes';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import { API_URL, API_VERSION, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem, tempfyData } from '../libraries/utils';


// 設定userInfo

export const setLoginState = (isLogin) => ({
  type: types.SET_LOGIN_STATE,
  isLogin
});

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
export const retrieveToken = (codeObj, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/token`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codeObj),
      types: types.RETRIEVE_TOKEN
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
  if (next) {
    next(response.payload.token);
  }
};

// Proxy > Introspection
export const getUserInfo = (token, history, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/introspection`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token
      }),
      types: types.GET_USER_INFO
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
    next(response.error);
  }

  next(response.payload);
};


// Proxy > Logout
export const logout = (token, next) => async (dispatch) => {
  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/logout`,
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
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  if (next) {
    next();
  }
};

// Proxy > Register
export const signup = (formData, next) => async (dispatch) => {

  // const tempData = tempfyData(formData);
  // console.log('tempData', tempData);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/register`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      types: types.SIGNUP
    }
  });

  console.log('[signup] payload', response)

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  next(response);
};


// Proxy > UpdataProfile
export const updateProfile = (formData, token, next) => async (dispatch) => {

  // console.log('formData', formData);
  // const tempData = tempfyData(formData);

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/update`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
      types: types.UPDATE_PROFILE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  next();
};


// Proxy > UpdataPassword
export const updatePassword = (username, formData, token, next) => async (dispatch) => {

  const tempData = {
    username,
    password: formData.password
  };

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/changePW`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tempData),
      types: types.UPDATE_PASSWORD
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
  next();
};


// Proxy > UserInfo
export const getProfile = (token) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/query`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_PROFILE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};




// Health Check > check-kubernetes
export const healthCheck = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/health/kubernetes`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      types: types.HEALTH_CHECK
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

// Health Check > check-database
export const checkDatabase = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/health/database`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' }),
      types: types.CHECK_DATABASE
    }
  });

  // console.log("response", response);
  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

// 登入
export const manualLogin = (formData, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/auth/login`,
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
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
  // next(response.payload.result[0]);
};

// 註冊
export const manualSignup = (formData, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/auth/register`,
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
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  // next(response.payload.result[0]);
};
