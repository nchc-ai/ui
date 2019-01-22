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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
  }

  next();
};

/**
 * Upload csv file of students list for classroom.
 * @param {String} token - The required token for calling API.
 * @param {Object} formData - Form data with file format.
 */
export const upladStudentsCSV = ({ token, formData, next }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/upload`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      types: types.UPLOAD_STUDENTS_CSV
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '上傳 csv 檔案失敗', 'error', TOAST_TIMING);
  } else {
    notify.show('上傳 csv 成功', 'success', TOAST_TIMING);
  }
};

// [List] classrooms
export const getClassroomList = ({ token, userInfo, next }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user: userInfo.username,
      }),
      types: types.GET_CLASSROOM_LIST
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
  }
};


/**
 * Get classroom detail for both detail and edit page.
 * @param {String} token - The required token for calling API.
 */
export const getClassroomDetail = ({ id, token, onSuccess }) => async (dispatch) => {

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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
  } else if (onSuccess) {
    onSuccess(response.payload.classroom)
  }
};


/**
 * Delete classroom with assigned id.
 * @param {String} id Classroom id for identfity.
 * @param {String} token Token for header
 */
export const deleteClassroom = ({ id, token }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/delete/${id}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.DELETE_CLASSROOM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
  } else {
    notify.show('刪除教室成功', 'success', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.users,
    complete: response.payload.users
  };
};