
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem } from '../libraries/utils';

// Course > List
export const getCourseList = (userInfo, token) => async (dispatch) => {

  // console.log('[getCourseList] token', userInfo, token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user: userInfo.username }),
      types: types.GET_USER_COURSE_LIST
    }
  });

  // console.log('[getCourseList] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseList 失敗');
  }
};

// Course > Create
export const createCourse = (token, userInfo, formData, next) => async (dispatch) => {
  // console.log('[createCourse] formData', formData, _.escape(formData.intro));
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user: userInfo.username,
        name: formData.name,
        introduction: _.escape(formData.intro),
        image: formData.image.value,
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


// Course > Luanch
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

// Course > Delete
export const deleteCourse = (courseId, token, next) => async (dispatch) => {
  // console.log('[deleteCourse] token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/delete/${courseId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.DELETE_USER_COURSE
    }
  });
  // console.log('[deleteCourse] response', response);
  if (_.isUndefined(response) || response.payload.error) {
    console.error('deleteCourse 失敗');
  }

  next();
};


// Job > List
export const getJobList = (user, token, next) => async (dispatch) => {

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

  // console.log('[getJobList] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getJobList 失敗');
  }
};

// Job > Launch
export const launchJob = (user, courseId, token, next) => async (dispatch) => {
  // console.log('user, courseId, token', user, courseId, token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/job/launch`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user, course_id: courseId }),
      types: types.LAUNCH_JOB
    }
  });

  // console.log('[launchJob] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('launchJob 失敗');
  }

  next();
};

// Job > Delete
export const deleteJob = (jobId, token, next) => async (dispatch) => {

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

  // console.log('[deleteJob] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('deleteJob 失敗');
  }

  next();
};

// DataSet > List
export const getDatasetsOpts = token => async (dispatch) => {

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

  // console.log('[getDatasetsOpts] response', response, response.payload.datasets);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getDatasetsOpts 失敗');
  }

  return {
    options: response.payload.datasets,
    complete: response.payload.datasets
  };
};


// Image > List
export const getImagesOpts = token => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/images/`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_IMAGES_OPTS
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getImagesOpts 失敗');
  }

  return {
    options: response.payload.images,
    complete: response.payload.images
  };
};
