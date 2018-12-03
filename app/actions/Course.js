
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL, API_VM_URL, AUTH_PROVIDER_URL } from '../config/api';


// load 映像檔  > con

export const getConImagesOpts = token => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/beta/images`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_CON_IMAGES_OPTS
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getConImagesOpts 失敗');
  }

  return {
    options: response.payload.images,
    complete: response.payload.images
  };
};


export const getVMImagesOpts = token => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/v1/images`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_VM_IMAGES_OPTS
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getVMImagesOpts 失敗');
  }

  return {
    options: response.payload.images,
    complete: response.payload.images
  };
};

// 新建 vm 課程









export const getCourseVMList = (user, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/v1/course/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user
      }),
      types: types.GET_COURSE_VM_LIST
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseVMList 失敗');
  }
};




export const getCourseConList = (user, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/beta/course/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user
      }),
      types: types.GET_COURSE_CON_LIST
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseConList 失敗');
  }
};







// Course > List all courses
export const getCourseListAll = () => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/v1/course/list`,
      method: 'GET',
      types: types.GET_COURSE_LIST_ALL
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseListAll 失敗');
  }
};


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
export const getCourseDetail = (courseId, token, next) => async (dispatch) => {

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

  if (next) {
    next(response.payload.course);
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

  // console.log('[searchCourse] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('searchCourse 失敗');
  }
};
