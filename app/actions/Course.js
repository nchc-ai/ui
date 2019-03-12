
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { notify } from 'components/common/NotifyToast';
import { TOAST_TIMING } from '../constants';
import { isStringEmpty, decodeHtml } from '../libraries/utils';
import { API_URL, API_VM_URL, AUTH_PROVIDER_URL, API_VERSION, API_VM_VERSION } from '../config/api';

// Container 課程 ---------------------------------------------------

export const getAllPublicCourseList = ({ token }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_ALL_PUBLIC_COURSE_LIST
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
  }
};

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
    notify.show(_.get(response, 'payload.response.message', 'get all course list fail'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', 'get container images options fail'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', 'get container datasets options'), 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.datasets,
    complete: response.payload.datasets
  };
};



/**
 * Create / Update container course
 * @param {Object} token - .
 * @param {Object} userInfo - .
 * @param {Object} submitData - .
 * @param {Object} onSuccess - .
 */
export const submitContainerCourse = ({ token, userInfo, submitData, condition, onFail, onSuccess }) => async (dispatch) => {

  const finalSubmitData = {
    ...submitData,
    id: _.get(submitData, 'id', ''),
    user: userInfo.username,
    accessType: _.get(submitData, 'accessType.value', 'NodePort'),
    level: _.get(submitData, 'level.value', 'basic'),
    ports: submitData.ports.map(d => ({ name: d.keyItem, port: parseInt(d.valueItem) })) || [],
  };

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/${condition.apiAction}`,
      method: condition.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(finalSubmitData),
      types: condition.types
    }
  });

  // response.error = true;  // DEBUG
  if (_.isUndefined(response) || response.error) {
    const actionName = actionType === 'create' ? '新增' : '更新';
    notify.show(_.get(response, 'payload.response.message', `容器課程${actionName}失敗`), 'error', TOAST_TIMING);
    onFail()
  } else if (onSuccess) {
    onSuccess(condition);
  }
};



// submit
export const submitVMCourse = ({ token, userInfo, submitData, condition, onFail, onSuccess }) => async (dispatch) => {

  const finalSubmitData = {
    ...submitData,
    id: _.get(submitData, 'id', ''),
    user: userInfo.username,
    level: _.get(submitData, 'level.value'),
    associate: _.get(submitData, 'associate', false).toString()
  };

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/course/${condition.apiAction}`,
      method:  condition.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(finalSubmitData),
      types: condition.types
    }
  });

  if (_.isUndefined(response) || response.error) {
    const actionName = condition.apiAction === 'create' ? '新增' : '更新';
    notify.show(_.get(response, 'payload.response.message', `VM課程${actionName}失敗`), 'error', TOAST_TIMING);
    onFail();
  } else if (onSuccess) {
    onSuccess(condition);
  }
};

// Course > Delete
export const deleteContainerCourse = ({ courseId, token, next }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/delete/${courseId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.DELETE_CONTAINER_COURSE
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
    notify.show(_.get(response, 'payload.response.message', 'get VM images options fail'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', 'get VM flavors options fail'), 'error', TOAST_TIMING);
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
    notify.show(_.get(response, 'payload.response.message', 'get VM sshkeys options fail'), 'error', TOAST_TIMING);
  }

  return {
    options: response.payload.keys,
    complete: response.payload.keys
  };
};


export const deleteVMCourse = ({ courseId, token, next }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/course/delete/${courseId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.DELETE_VM_COURSE
    }
  });
  // console.log('[deleteCourse] response', response);
  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', '課程刪除失敗'), 'error', TOAST_TIMING);
  }
  next();
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
    notify.show(_.get(response, 'payload.response.message', 'search course fail'), 'error', TOAST_TIMING);
  }
};


