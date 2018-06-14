
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import * as types from './actionTypes';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem } from '../libraries/utils';

// 設定userInfo

export const setUserInfo = (userInfo, isLogin) => ({
  type: types.SET_USER_INFO,
  userInfo,
  isLogin
});

// 登出

export const logout = () => ({
  type: types.LOGOUT
});


// 檢查健康狀況
export const healthCheck = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: 'http://localhost:38080/v1/health/kubernetes',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      types: types.HEALTH_CHECK
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('healthCheck 失敗');
  }
};

// 檢查DB狀況
export const checkDatabase = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: 'http://localhost:38080/v1/health/database',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' }),
      types: types.CHECK_DATABASE
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('checkDatabase 失敗');
  }
};

// 登入
export const manualLogin = (user, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: '/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
      types: types.MANUAL_LOGIN
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('manual Login 失敗');
  }
  next(response.payload.result[0]);
};

// 註冊
export const manualSignup = (user, next) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: '/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
      types: types.MANUAL_SIGNUP
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    console.error('manual Signup 失敗');
  }

  next(response.payload.result[0]);
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

// 未整理
export const thirdPartyLoginLoading = () => ({
  type: types.THIRD_PARTY_LOGIN_LOADING
});
export const thirdPartyLoginSuccess = () => ({
  type: types.THIRD_PARTY_LOGIN_SUCCESS
});
export const thirdPartyLogin = email => (dispatch) => {
  dispatch(thirdPartyLoginLoading());
  return makeUserRequest('post', '/thirdPartyLogin', { email })
  .then((response) => {
    if (response && response.data.success) {
      const userObj = response.data.result;
      // cookie.save('auth', userObj, { path: '/' });
      dispatch(thirdPartyLoginSuccess());
      dispatch(setUserInfo(userObj));
    }
    return response.data;
  })
  .catch((response) => {
    if (response instanceof Error) {
      console.error('Error', response);
    }
  });
};
