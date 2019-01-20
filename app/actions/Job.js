import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import * as types from './actionTypes';
import { API_URL, API_VM_URL, AUTH_PROVIDER_URL, API_VERSION, API_VM_VERSION } from '../config/api';


// List
export const getConJobList = ({ user, token }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/job/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user }),
      types: types.GET_CON_JOB_LIST
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};

export const getVMJobList = ({ user, token }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/job/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user }),
      types: types.GET_VM_JOB_LIST
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }
};


// Launch
export const launchCourseJob = ({ user, courseId, token, next }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/job/launch`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user, course_id: courseId, classroom_id: '' }),
      types: types.LAUNCH_COURSE_JOB
    }
  });

  // console.log('[launchJob] response', response);

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  next();
};

// Delete
export const deleteJob = ({ jobId, token, next }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/job/delete/${jobId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.DELETE_JOB
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  }

  next();
};

/**
 * Snapshot image of vm job (vm only).
 * @param {String} token - The required token for calling API.
 * @param {String} job - The job object for retrieving id and name.
 * @param {String} next - Callback.
 */
export const snapshotJob = ({ token, job, next }) => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_VM_URL}/${API_VM_VERSION}/vm/snapshot`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: job.course_id, name: job.name }),
      types: types.SNAPSHOT_JOB
    }
  });

  if (_.isUndefined(response) || response.error) {
    notify.show(response.payload.response.message || '', 'error', TOAST_TIMING);
  } else if (next) {
    next();
  }

};



