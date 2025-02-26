import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import { notify } from 'components/common/NotifyToast';
import { TOAST_TIMING } from '../constants';
import * as types from './actionTypes';
import { API_URL, API_VERSION } from '../config/api';
import moment from 'moment';

export const setStudentsField = ({ students }) => ({
  type: types.SET_STUDENTS_FIELD,
  students
});

export const resetStudentsField = () => ({
  type: types.RESET_STUDENTS_FIELD
});

/**
 * Create classroom.
 * @param {String} token - .
 * @param {Object} formData - .
 * @param {Function} next - .
 */
export const createClassroom = ({ token, formData, rawStudents, next }) => async (dispatch) => {

  const submitData = {
    ...formData,
    students: rawStudents.map(d => ({ label: d.keyItem, value: d.valueItem })),
    schedule: {
      ...formData.schedule,
      startDate: moment(formData.schedule.startDate).format('YYYY-MM-DD'),
      endDate: moment(formData.schedule.endDate).format('YYYY-MM-DD')
    },
    studentCount: rawStudents.length,
    public: formData.public.value,
  };
  // console.log('[create] submitData', submitData);

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
    notify.show(_.get(response, 'payload.response.message', '建立課程失敗'), 'error', TOAST_TIMING);
    next('create', false)
    return
  }

  next('create', true);
};


/**
 * Updata classroom.
 * @param {String} token - .
 * @param {Object} userInfo - .
 * @param {Object} formData - .
 * @param {Function} next - .
 */
export const updateClassroom = ({ token, formData, rawStudents, next }) => async (dispatch) => {

  const submitData = {
    ...formData,
    students: rawStudents.map(d => ({ label: d.keyItem, value: d.valueItem })),
    schedule: {
      ...formData.schedule,
      startDate: moment(formData.schedule.startDate).format('YYYY-MM-DD'),
      endDate: moment(formData.schedule.endDate).format('YYYY-MM-DD')
    },
    studentCount: rawStudents.length,
    public: formData.public.value
  };

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/classroom/update`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(submitData),
      types: types.UPDATE_CLASSROOM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', '更新課程失敗'), 'error', TOAST_TIMING);
    next('edit', false)
    return
  }

  next('edit', true);
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
    notify.show(_.get(response, 'payload.response.message', 'get classroom list fail'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', 'get public classroom fail'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', 'get detail of classroom fail'), 'error', TOAST_TIMING);
  } else if (onSuccess) {
    onSuccess(response.payload.classroom);
  }
};


/**
 * Delete classroom with assigned id.
 * @param {String} id Classroom id for identfity.
 * @param {String} token Token for header
 */
export const deleteClassroom = ({ id, token, next }) => async (dispatch) => {

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
    notify.show(_.get(response, 'payload.response.message', 'delete classroom fail'), 'error', TOAST_TIMING);
    next(false)
  } else {
    next(true);
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
    notify.show(_.get(response, 'payload.response.message', 'load course options fail'), 'error', TOAST_TIMING);
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
      endpoint: `${API_URL}/${API_VERSION}/user/role/teacher`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_TEACHER_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', 'load teacher options fail'), 'error', TOAST_TIMING);
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
      endpoint: `${API_URL}/${API_VERSION}/user/role/student`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.LOAD_STUDENT_TAGS_ROOM_CREATE
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', 'load students options fail'), 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.users,
    complete: response.payload.users
  };
};
