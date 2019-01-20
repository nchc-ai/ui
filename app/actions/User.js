
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
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

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};




// Course > Update
export const updateCourse = (token, userInfo, formData, next) => async (dispatch) => {
  // console.log('[createCourse] formData', formData, _.escape(formData.intro));
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/update`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: formData.id,
        user: userInfo.username,
        name: formData.name,
        intro: _.escape(formData.intro),
        image: formData.image.value,
        level: formData.level.value,
        GPU: parseInt(formData.gpu.value, 10),
        datasets: formData.datasets.map(d => d.value)
      }
    ),
      types: types.UPDATE_USER_COURSE
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
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
//         intro: formData.intro,
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

//   if (_.isUndefined(response) || response.error) {
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
  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  next();
};






