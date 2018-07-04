
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem } from '../libraries/utils';


// 獲取課程列表
export const getCourseList = (user, token) => async (dispatch) => {

  console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user }),
      types: types.GET_USER_COURSE_LIST
    }
  });

  console.log('response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseList 失敗');
  }
};

// 獲取工作清單列表
export const getJobList = (user, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/job/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user }),
      types: types.GET_JOB_LIST
    }
  });

  console.log('[getJobList] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getJobList 失敗');
  }
};

export const createCourse = (token, formData) => async (dispatch) => {
  console.log('formData', formData);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user: 'jimmy',
        name: formData.name,
        introduction: formData.intro,
        image: formData.image,
        level: formData.level,
        GPU: parseInt(formData.gpu, 10),
        datasets: [
          'mnist',
          'caltech256'
        ]
      }
    ),
      types: types.CREATE_USER_COURSE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('createCourse 失敗');
  }
};


// 獲取datasets選項
export const getDatasetsOpts = (user, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/datasets`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_DATASETS_OPTS
    }
  });

  console.log('[getDatasetsOpts] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getDatasetsOpts 失敗');
  }
};

// export const luanchCourse = (token, formData) => async (dispatch) => {
//   const response = await dispatch({
//     [RSAA]: {
//       endpoint: `${API_URL}/v1/course/create`,
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         user: 'jimmy',
//         name: formData.user,
//         introduction: formData.intro,
//         image: formData.image,
//         level: formData.level,
//         GPU: parseInt(formData.gpu, 10),
//         datasets: [
//           'mnist',
//           'caltech256'
//         ]
//       }
//     ),
//       types: types.CREATE_USER_COURSE
//     }
//   });

//   if (_.isUndefined(response) || response.payload.error) {
//     console.error('createCourse 失敗');
//   }
// };