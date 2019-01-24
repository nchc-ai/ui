
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import { isStringEmpty, decodeHtml } from '../libraries/utils';
import { API_URL, API_VM_URL, AUTH_PROVIDER_URL, API_VERSION, API_VM_VERSION } from '../config/api';

// Container 課程 ---------------------------------------------------

// list
export const getCourseListCon = (user, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user
      }),
      types: types.GET_COURSE_LIST_CON
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

// load images
export const getConImagesOpts = token => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/images/`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_IMAGES_OPTS_CON
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.images,
    complete: response.payload.images
  };
};


// load datasets
export const getConDatasetsOpts = token => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/datasets/`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_CON_DATASETS_OPTS
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.datasets,
    complete: response.payload.datasets
  };
};



/**
 * Container Course
 * Called when clicking submit button to create container course.
 * @param {Object} token - .
 * @param {Object} userInfo - .
 * @param {Object} formData - .
 * @param {Object} next - .
 */
export const createContainerCourse = ({ token, userInfo, formData, next }) => async (dispatch) => {

  const submitData = {
    user: userInfo.username,
    name: formData.name,
    accessType: formData.accessType.value || 'NodePort',
    introduction: decodeHtml(formData.introduction) || '',
    image: formData.image.value || '',
    level: formData.level.value || '',
    GPU: parseInt(formData.gpu.value, 10),
    datasets: formData.datasets.map(d => d.value) || [],
    writablePath: isStringEmpty(formData.writablePath) ? '' : formData.writablePath || '',
    ports: formData.ports.map(d => ({ name: d.keyItem, port: parseInt(d.valueItem) })) || [],
  };
  // console.log('submitData', submitData, JSON.stringify(submitData))

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(submitData),
      types: types.CREATE_CONTAINER_COURSE
    }
  });

  // response.error = true;  // DEBUG
  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', '容器課程建立失敗'), 'error', TOAST_TIMING);
  } else if (next) {
    next();
  }
};


// Course > Delete
export const deleteCourseContainer = ({ courseId, token, next }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/delete/${courseId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.DELETE_COURSE_CONTAINER
    }
  });
  // console.log('[deleteCourse] response', response);
  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  next();
};



// VM 課程 ---------------------------------------------------

// list
export const getCourseListVM = (user, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/course/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user
      }),
      types: types.GET_COURSE_LIST_VM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

// [select] load images
export const getImagesOptsVM = token => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/image/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_IMAGES_OPTS_VM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.images,
    complete: response.payload.images
  };
};

// [select] load flavors
export const getFlavorsOptsVM = token => async (dispatch) => {

  // console.log('token', token);
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/flavor/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_FLAVORS_OPTS_VM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.flavors,
    complete: response.payload.flavors
  };
};

// [select] load SSHKEYS
export const getSshKeysOptsVM = token => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/key/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_SSH_KEYS_OPTS_VM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.keys,
    complete: response.payload.keys
  };
};





// submit
export const submitCourseVM = (token, userInfo, formData, next) => async (dispatch) => {
  // console.log('[createCourse] formData', formData, _.escape(formData.intro));
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/course/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user: userInfo.username,
        name: formData.name,
        introduction: _.escape(formData.introduction),
        level: formData.level.value,
        image: formData.image.value,
        flavor: formData.flavor.value,
        associate: formData.associate.value.toString(),
        extraports: formData.extraPorts,
        sshkey: formData.sshKey.value,
        mount: formData.mount.value.toString(),
        volume: formData.volume.value,
      }
    ),
      types: types.SUBMIT_COURSE_VM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.message', 'VM課程建立失敗'), 'error', TOAST_TIMING);
  } else if (next) {
    next();
  }
};




//-------------------------------------------------------------------------

// Course > List all courses
export const getCourseListAll = () => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/list`,
      method: 'GET',
      types: types.GET_COURSE_LIST_ALL
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};


// Course > List different level course
export const getCourseListByLevel = level => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/level/${level}`,
      method: 'GET',
      types: types.GET_COURSE_LIST_BY_LEVEL
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

// Course > Get
export const getCourseDetail = ({ courseId, token, next }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/get/${courseId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_COURSE_DETAIL
    }
  });

  // console.log('[getCourseDetail] response', response);

  if (_.isUndefined(response) || response.error) {
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
      endpoint: `${API_URL}/${API_VERSION}/course/search`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query }),
      types: types.SEARCH_COURSE
    }
  });

  // console.log('[searchCourse] response', response);

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};


