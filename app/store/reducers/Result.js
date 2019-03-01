import _ from 'lodash';
import * as actionTypes from 'actions/actionTypes';
import { LOADING, SUCCESS } from 'constants/apiActions';

const InitialState = {
  List: {
    loading: false,
    data: []
  }
};

export default function Result(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.GET_RESULT_LIST[LOADING]:
    return {
      ...state,
      List: {
        ...state.List,
        loading: true
      }
    };
  case actionTypes.GET_RESULT_LIST[SUCCESS]:
    return {
      ...state,
      List: {
        loading: false,
        data: action.payload.result
      }
    };
  default:
    return state;
  }
}
