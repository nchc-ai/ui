import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import * as types from './actionTypes';
import { API_URL, API_VM_URL, AUTH_PROVIDER_URL, API_VERSION, API_VM_VERSION } from '../config/api';


// List
export const getJobList = ({ user, token }) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/job/list`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user }),
      types: types.GET_JOB_LIST
    }
  });

  // console.log('[getJobList] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getJobList 失敗');
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
      body: JSON.stringify({ user, course_id: courseId, classroom_id: 'default' }),
      types: types.LAUNCH_COURSE_JOB
    }
  });

  // console.log('[launchJob] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('launchCourseJob 失敗');
  }

  next();
};

// Delete
export const deleteJob = (jobId, token, next) => async (dispatch) => {

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

  // console.log('[deleteJob] response', response);

  if (_.isUndefined(response) || response.payload.error) {
    console.error('deleteJob 失敗');
  }

  next();
};


