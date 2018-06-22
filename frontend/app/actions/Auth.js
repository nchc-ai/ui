
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import * as types from './actionTypes';
import { API_URL, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem } from '../libraries/utils';

// 設定userInfo

export const setUserInfo = (userInfo, isLogin) => ({
  type: types.SET_USER_INFO,
  userInfo,
  isLogin
});

//

export const login = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${AUTH_PROVIDER_URL}/client_id=test_client_1`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      types: types.LOGIN
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('login 失敗');
  }
};


// 登出

export const logout = () => ({
  type: types.LOGOUT
});


// 檢查健康狀況
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

// 檢查DB狀況
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



export const getUserInfo = (email, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: '/getUserInfo',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      types: types.GET_USER_INFO
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('getUserInfo 失敗');
  }
  next(response.payload.result[0]);
};

export const updateUserInfoInDB = (email, formData, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: '/updateUserInfo',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, formData }),
      types: types.UPDATE_USER_INFO
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('updateUserInfo 失敗');
  }

  // console.log('formData', formData);
  setLocalStorageItem('userInfo', formData);
  dispatch(setUserInfo(formData));
  next();
};
