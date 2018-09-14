import { RSAA } from 'redux-api-middleware';
import _ from 'lodash';
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
    console.error('getResultList 失敗');
  }
  // next(response.payload.result[0]);
};
