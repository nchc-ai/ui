
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL, AUTH_PROVIDER_URL } from '../config/api';
import { makeUserRequest, setLocalStorageItem, getLocalStorageItem, resetLocalStorageItem } from '../libraries/utils';


// 獲取課程列表
export const getCourseList = (user, token) => async (dispatch) => {

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


export const createCourse = token => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "user": "user-name",
        "name": "course name",
        "introduction":"markdown text with escape",
        "image":"course docker image",
        "level": "basic",
        "GPU": 1,
        "datasets": [
          "mnist",
          "caltech256"
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