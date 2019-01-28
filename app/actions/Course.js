
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import { isStringEmpty, decodeHtml } from '../libraries/utils';
import { API_URL, API_VM_URL, AUTH_PROVIDER_URL, API_VERSION, API_VM_VERSION } from '../config/api';

// Container 課程 ---------------------------------------------------


/**
 * Both container and vm course
 * Called when clicking submit button to create container course.
 * @param {Object} token - .
 * @param {Object} userInfo - .
 * @param {Object} formData - .
 * @param {Object} next - .
 */
export const getCourseListAll = ({ user, token }) => async (dispatch) => {

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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
 * @param {Object} submitData - .
 * @param {Object} onSuccess - .
 */
export const submitContainerCourse = ({ token, userInfo, submitData, actionType, onFail, onSuccess }) => async (dispatch) => {

  console.log('submitData', submitData)

  const finalSubmitData = {
    id: submitData.id,
    user: userInfo.username,
    name: submitData.name,
    accessType: submitData.accessType.value || 'NodePort',
    introduction: decodeHtml(submitData.introduction) || '',
    image: submitData.image.value || '',
    level: submitData.level.value || '',
    GPU: parseInt(submitData.gpu.value, 10),
    datasets: submitData.datasets.map(d => d.value) || [],
    writablePath: isStringEmpty(submitData.writablePath) ? '' : submitData.writablePath || '',
    ports: submitData.ports.map(d => ({ name: d.keyItem, port: parseInt(d.valueItem) })) || [],
  };
  console.log('finalSubmitData', finalSubmitData)

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/${actionType}`,
      method: actionType === 'create' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(finalSubmitData),
      types: types.CREATE_CONTAINER_COURSE
    }
  });

  // response.error = true;  // DEBUG
  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', '容器課程建立失敗'), 'error', TOAST_TIMING);
    onFail({ actionType, courseType: 'container'  })
  } else if (onSuccess) {
    onSuccess({ actionType, courseType: 'container' });
  }
};



// submit
export const submitVMCourse = ({ token, userInfo, submitData, actionType, onFail, onSuccess }) => async (dispatch) => {

  const finalSubmitData = {
    user: userInfo.username,
    name: submitData.name,
    introduction: _.escape(_.get(submitData, 'introduction', "")),
    level: _.get(submitData, 'level.value', ""),
    image: _.get(submitData, 'image.value', ""),
    flavor: submitData.flavor.value,
    associate: _.get(submitData, 'associate.value', "").toString(),
    extraports: submitData.extraPorts,
    sshkey: _.get(submitData, 'sshKey.value', ""),
    mount: _.get(submitData, 'mount.value', "").toString(),
    volume: _.get(submitData, 'volume.value', "")
  };

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/course/${actionType}`,
      method:  actionType === 'create' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(finalSubmitData),
      types: types.SUBMIT_COURSE_VM
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', 'VM課程建立失敗'), 'error', TOAST_TIMING);
    onFail({ actionType, courseType: 'vm' });
  } else if (onSuccess) {
    onSuccess({ actionType, courseType: 'vm' });
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
    notify.show(_.get(response, 'payload.response.message', '課程刪除失敗'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.keys,
    complete: response.payload.keys
  };
};









//-------------------------------------------------------------------------


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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
  }
};

/**
 * [Container Course]
 * Called when accessing container course with courseId.
 * @param {String} token - .
 * @param {String} courseId - .
 * @param {Function} next - .
 */
export const getContainerCourseDetail = ({ token, actionType, courseId, onSuccess }) => async (dispatch) => {

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
  } else if (onSuccess) {
    onSuccess({
      actionType,
      courseType: 'CONTAINER',
      course:response.payload.course
    });
  }
};

/**
 * [Container Course]
 * Called when accessing container course with courseId.
 * @param {String} token - .
 * @param {String} courseId - .
 * @param {Function} next - .
 */
export const getVMCourseDetail = ({ token, actionType, courseId, onSuccess }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/course/get/${courseId}`,
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
  } else if (onSuccess) {
    onSuccess({
      actionType,
      courseType: 'VM',
      course:response.payload.course
    });
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
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
  }
};


