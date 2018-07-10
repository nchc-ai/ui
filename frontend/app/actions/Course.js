
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL, AUTH_PROVIDER_URL } from '../config/api';

// Course > List different level course
export const getCourseListByLevel = level => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/level/${level}`,
      method: 'GET',
      types: types.GET_COURSE_LIST_BY_LEVEL
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseListByLevel 失敗');
  }
};

// Course > Get
export const getCourseDetail = (courseId, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/get/${courseId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_COURSE_DETAIL
    }
  });

  // console.log('[getCourseDetail] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseDetail 失敗');
  }
};


// Course > Search
export const searchCourse = query => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/search`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query }),
      types: types.SEARCH_COURSE
    }
  });

  console.log('[searchCourse] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('searchCourse 失敗');
  }
};