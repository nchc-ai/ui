import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import * as types from './actionTypes';
import { API_URL, API_VERSION } from '../config/api';

export const getUserListByRole = (role, token) => async (dispatch) => {

  const response = await dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/${API_VERSION}/proxy/role/${role}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      types: types.GET_USER_LIST_BY_ROLE
    }
  });

  if (_.isUndefined(response) || response.payload.error) {
    console.error('getUserListByRole 失敗');
  }
};