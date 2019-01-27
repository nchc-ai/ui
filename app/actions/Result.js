import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../constants';
import * as types from './actionTypes';

export const getResultList = () => async (dispatch) => {
  const response = await dispatch({
    [RSAA]: {
      endpoint: '/getResultList',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      types: types.GET_RESULT_LIST
    }
  });

  if (_.isUndefined(response) || !response.payload.success) {
    notify.show(_.get(response, 'payload.response.message', ''), 'error', TOAST_TIMING);
  }
  // next(response.payload.result[0]);
};
