import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import { API_URL } from '../config/api';

export const getClassroomList = () => async (dispatch, token) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/beta/classroom/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_CLASSROOM_LIST
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getClassroomList 失敗');
  }
};