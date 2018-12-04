
import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseListCon 失敗');
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getConImagesOpts 失敗');
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getConDatasetsOpts 失敗');
  }

  return {
    options: response.payload.datasets,
    complete: response.payload.datasets
  };
};




// submit
export const submitCourseContainer = (token, userInfo, formData, next) => async (dispatch) => {
  // console.log('[createCourse] formData', formData, _.escape(formData.intro));
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/course/create`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user: userInfo.username,
        name: formData.name,
        introduction: _.escape(formData.introduction),
        image: formData.image.value,
        level: formData.level.value,
        GPU: parseInt(formData.gpu.value, 10),
        datasets: formData.datasets.map(d => d.value),
        writablePath: "/tmp/work"
      }
    ),
      types: types.SUBMIT_COURSE_CONTAINER
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('submitCourseContainer 失敗');
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseListVM 失敗');
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getImagesOptsVM 失敗');
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getFlavorOptsVM 失敗');
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getSshKeysOptsVM 失敗');
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
        flavor: formData.level.value,
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('createCourse 失敗');
  }

  next();
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseListAll 失敗');
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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getCourseListByLevel 失敗');
  }
};

// Course > Get
export const getCourseDetail = (courseId, token, next) => async (dispatch) => {

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

  if (_.isUndefined(response) || response.payload.error) {
    console.error('searchCourse 失敗');
  }
};
