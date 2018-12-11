import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL } from '../config/api';

// [List] classrooms
export const getClassroomList = (user, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user
      }),
      types: types.GET_CLASSROOM_LIST
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getClassroomList 失敗');
  }
};


// [Tags] courses
export const loadCourseTagsRoomCreate = token => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}//beta/course/namelist`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_COURSE_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('loadCourseTagsRoomCreate 失敗');
  }

  return {
    options: response.payload.courses,
    complete: response.payload.courses
  };
};

// [Tags] teacher
export const loadTeacherTagsRoomCreate = token => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/beta/proxy/role/teacher`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_TEACHER_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('loadTeacherTagsRoomCreate 失敗');
  }

  return {
    options: response.payload.users,
    complete: response.payload.users
  };
};

// [Tags] student
export const loadStudentTagsRoomCreate = token => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/beta/proxy/role/student`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_STUDENT_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('loadStudentTagsRoomCreate 失敗');
  }

  return {
    options: response.payload.users,
    complete: response.payload.users
  };
};