import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import { notify } from 'components/common/NotifyToast';
import { TOAST_TIMING } from '../constants';
import * as types from './actionTypes';
import { API_URL, API_VERSION } from '../config/api';

export const startSubstituating = ({ label, role, value }) => ({
  type: types.START_SUBSTITUATING,
  label,
  role,
  value
});

export const toggleSubstituating = (status) => ({
  type: types.TOGGLE_SUBSTITUATING,
  status
});

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

  if (_.isUndefined(response) || response.error) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
  }

  // 在陣列先進行分類 teacher or student
  const options = _.map(response.payload.users, o => _.extend({ role }, o));

  return {
    options,
    complete: options
  };
};

