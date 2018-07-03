
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem } from '../libraries/utils';


// Course > List
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



// Job > List
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
// Job > Delete
export const deleteJob = (jobId, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/job/delete/${jobId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.DELETE_JOB
    }
  });

  console.log('[deleteJob] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('deleteJob 失敗');
  }
};


export const createCourse = (token, formData, next) => async (dispatch) => {
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
        level: formData.level.value,
        GPU: parseInt(formData.gpu.value, 10),
        datasets: formData.datasets.map(d => d.value)
      }
    ),
      types: types.CREATE_USER_COURSE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('createCourse 失敗');
  }

  next();
};


// 獲取datasets選項
export const getDatasetsOpts = (user, token) => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/datasets/`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_DATASETS_OPTS
    }
  });

  console.log('[getDatasetsOpts] response', response, response.payload.datasets);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getDatasetsOpts 失敗');
  }

  return {
    options: response.payload.datasets,
    complete: response.payload.datasets
  };
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