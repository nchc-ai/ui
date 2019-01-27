import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import * as types from './actionTypes';
import { API_URL, API_VERSION } from '../config/api';

export const resetStudentsField = () => ({
  type: types.RESET_STUDENTS_FIELD
});

/**
 * Create classroom.
 * @param {String} token - .
 * @param {Object} formData - .
 * @param {Function} next - .
 */
export const createClassroom = ({ token, students, formData, next }) => async (dispatch) => {

  const submitData = {
    courses: _.get(formData, 'courses', []).map(d => d.value),
    description: formData.description,
    name: formData.name,
    public: true,
    schedules: [
      `* ${_.get(formData, 'schedules', '* * * *')}`
    ],
    students: students.map(d => d.valueItem),
    teachers:  _.get(formData, 'teachers', []).map(d => d.value)
  };

  // console.log('[classroom] submitData', submitData);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(submitData),
      types: types.CREATE_CLASSROOM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
  }

  next('create');
};


/**
 * Updata classroom.
 * @param {String} token - .
 * @param {Object} userInfo - .
 * @param {Object} formData - .
 * @param {Function} next - .
 */
export const updateClassroom = ({ token, students, formData, next }) => async (dispatch) => {

  const submitData = {
    courses: _.get(formData, 'courses', []).map(d => d.value),
    description: formData.description,
    name: formData.name,
    public: true,
    schedules: [
      `* ${_.get(formData, 'schedules', '* * * *')}`
    ],
    students: students.map(d => d.valueItem),
    teachers:  _.get(formData, 'teachers', []).map(d => d.value)
  };

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/update`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(submitData),
      types: types.CREATE_CLASSROOM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', ''), 'error', TOAST_TIMING);
  }

  next('update');
};

/**
 * Upload csv file of students list for classroom.
 * @param {String} token - The required token for calling API.
 * @param {Object} formData - Form data with file format.
 */
export const uploadStudentsCSV = ({ token, formData, next }) => async (dispatch) => {

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
    notify.show(_.get(response, 'payload.response.message', '上傳 csv 檔案失敗 （可能檔案規格不符）'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
export const deleteClassroom = ({ id, token, onSuccess }) => async (dispatch) => {

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
  } else if(onSuccess) {
    notify.show('刪除教室成功', 'success', TOAST_TIMING);
    onSuccess();
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