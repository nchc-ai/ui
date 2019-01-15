import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import * as types from './actionTypes';
import { API_URL, API_VERSION } from '../config/api';

// [Create] classrooms
export const createClassroom = ({ token, userInfo, formData, next }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courses: formData.courses,
        description: formData.description,
        name: formData.name,
        public: true,
        schedules: [
          `*${formData.schedules}`
        ],
        students: formData.students,
        teachers: formData.teachers,
      }
    ),
      types: types.CREATE_CLASSROOM
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  next();
};

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
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

/**
 * Get public classroom for classroom management.
 * @param {String} token - The required token for calling API.
 */

export const getPublicClassrooms = ({ token }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_PUBLIC_CLASSROOMS
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};


// [Detail] classrooms
export const getClassroomDetail = (id, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/get/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_CLASSROOM_DETAIL
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

// [Tags] courses
export const loadCourseTagsForRoomCreate = token => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/namelist`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_COURSE_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.courses,
    complete: response.payload.courses
  };
};

// [Tags] teacher
export const loadTeacherTagsForRoomCreate = token => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/role/teacher`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_TEACHER_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.users,
    complete: response.payload.users
  };
};

// [Tags] student
export const loadStudentTagsForRoomCreate = token => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/role/student`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_STUDENT_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.users,
    complete: response.payload.users
  };
};