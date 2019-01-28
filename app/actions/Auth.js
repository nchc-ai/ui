
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import Cookies from 'js-cookie';
import * as types from './actionTypes';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import { API_URL, API_VERSION, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem, tempfyData, dayToSecond } from '../libraries/utils';


// 設定userInfo

export const setLoginState = (isLogin) => ({
  type: types.SET_LOGIN_STATE,
  isLogin
});

export const setUserToken = ({ token }) => ({
  type: types.SET_USER_TOKEN,
  token
});

export const setUserInfo = ({ userInfo }) => ({
  type: types.SET_USER_INFO,
  userInfo
});

export const resetAuth = () => ({
  type: types.RESET_AUTH,
  isLogin: false,
  token: '',
  userInfo: {}
});

export const retrieveAuthFromSession = ({ tokenObj, userInfo, isLogin }) => ({
  type: types.RETRIEVE_AUTH_FROM_SESSION,
  payload: {
    tokenObj,
    userInfo,
    isLogin
  }
});

// Health Check > check-database
export const checkDatabase = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/health/database`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' }),
      options: { timeout: 3000 },
      types: types.CHECK_DATABASE
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', '無法建立 DB 連線'), 'error', TOAST_TIMING);
  }
};

// Proxy > Token
export const getToken = (codeObj, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/token`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codeObj),
      options: { timeout: 3000 },
      types: types.GET_TOKEN
    }
  });

  console.log('[auth] getToken', response);

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, "payload.response.message", "get token fail"), 'error', TOAST_TIMING);
  } else if (next) {
    next(response.payload);
  }
};

/**
 * Refresh if token is invalid.
 * @param {String} refreshToken - Token to be refresh.
 * @param {Function} next - Callback function.
 */
export const refreshToken = ({ refresh_token, next, fail }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/refresh`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refresh_token
      }),
      types: types.REFRESH_TOKEN
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, "payload.response.message", "refresh token fail"), 'error', TOAST_TIMING);
    fail();
  } else if (next) {
    Cookies.set('token_obj', response.payload, { path: '/', maxAge: dayToSecond(1) });
    next();
  }
};

// Proxy > Introspection
export const getMetaInfo = ({ token, onSuccess }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/introspection`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token
      }),
      types: types.GET_META_INFO
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, "payload.response.message", "get user info fail"), 'error', TOAST_TIMING);
  } else if (onSuccess) {
    onSuccess();
  }
};


// Proxy > Introspection
export const getUserInfo = ({ token, onSuccess }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/query`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_USER_INFO
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, "payload.response.message", "get user info fail"), 'error', TOAST_TIMING);
  } else if (onSuccess) {
    onSuccess();
  }
};

// Proxy > Logout
export const logout = ({ token, next }) => async (dispatch) => {
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, "payload.response.message", "logout fail"), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
  }

  // next(response.payload.result[0]);
};
